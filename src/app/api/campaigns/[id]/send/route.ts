import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Campaign from "@/models/Campaign";
import Contact from "@/models/Contact";
import EmailLog from "@/models/EmailLog";
import nodemailer from "nodemailer";
import { requireAuth } from "@/lib/auth-guard";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  const authError = await requireAuth();
  if (authError) return authError;
  try {
    await connectToDatabase();
    const { id } = await params;
    const { contactIds } = await req.json();

    if (!contactIds?.length) {
      return NextResponse.json({ error: "Debes seleccionar al menos un contacto." }, { status: 400 });
    }

    const campaign = await Campaign.findById(id);
    if (!campaign) return NextResponse.json({ error: "Campaña no encontrada." }, { status: 404 });

    const contacts = await Contact.find({ _id: { $in: contactIds } });

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: Number(process.env.EMAIL_PORT) === 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    let sent = 0;
    const errors: string[] = [];

    const baseUrl = (() => {
      // Derivar la URL base del request (funciona en local y en producción)
      const origin = req.headers.get("origin") ?? req.headers.get("x-forwarded-host");
      if (origin) return origin.startsWith("http") ? origin : `https://${origin}`;
      const host = req.headers.get("host") ?? "localhost:3000";
      const proto = req.headers.get("x-forwarded-proto") ?? "http";
      return `${proto}://${host}`;
    })();

    for (const contact of contacts) {
      // Saltar contactos que se han dado de baja
      if ((contact as unknown as { unsubscribed?: boolean }).unsubscribed) {
        errors.push(`${contact.email} (dado de baja)`);
        continue;
      }

      try {
        const personalize = (text: string) =>
          text
            .replace(/\{\{nombre\}\}/g, contact.name)
            .replace(/\{\{empresa\}\}/g, contact.company ?? contact.name)
            .replace(/\{\{web\}\}/g, contact.website ?? "");

        // Crear log ANTES de enviar para obtener el ID del pixel
        const log = await EmailLog.create({
          campaignId: id,
          contactId: contact._id,
          email: contact.email,
          contactName: contact.name,
          sentAt: new Date(),
          opened: false,
        });

        const pixelUrl = `${baseUrl}/api/track/${log._id}`;
        const unsubscribeUrl = `${baseUrl}/api/unsubscribe/${contact._id}`;
        const trackingPixel = `<img src="${pixelUrl}" width="1" height="1" alt="" style="display:none;"/>`;

        const legalFooter = `
<div style="margin-top:32px; padding-top:16px; border-top:1px solid #e4e4e7;">
  <p style="font-size:11px; color:#a1a1aa; line-height:1.6; margin:0;">
    <strong style="color:#71717a;">Novitic</strong> · info@novitic.com<br/>
    Has recibido este email porque tu empresa puede estar interesada en nuestros servicios.<br/>
    Tratamos tus datos bajo la base legal de interés legítimo (Art. 6.1.f RGPD) con fines de prospección comercial B2B.<br/>
    Tienes derecho de acceso, rectificación, supresión y oposición enviando un email a <a href="mailto:info@novitic.com" style="color:#a1a1aa;">info@novitic.com</a>.<br/>
    Si no deseas recibir más comunicaciones, <a href="${unsubscribeUrl}" style="color:#7c3aed;">haz clic aquí para darte de baja</a>.
  </p>
</div>`;

        const personalizedBody = personalize(campaign.body) + legalFooter + trackingPixel;
        const personalizedSubject = personalize(campaign.subject);

        await transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: contact.email,
          subject: personalizedSubject,
          html: personalizedBody,
        });

        sent++;
      } catch (err) {
        console.error(`Error enviando a ${contact.email}:`, err);
        errors.push(contact.email);
      }
    }

    // Actualizar campaña
    campaign.status = "enviada";
    campaign.recipientCount = sent;
    campaign.sentAt = new Date();
    await campaign.save();

    return NextResponse.json({
      message: `Emails enviados: ${sent}`,
      sent,
      errors,
    });
  } catch (error) {
    console.error("[POST /api/campaigns/id/send]", error);
    return NextResponse.json({ error: "Error interno." }, { status: 500 });
  }
}
