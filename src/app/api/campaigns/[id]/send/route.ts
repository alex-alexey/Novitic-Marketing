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

    const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

    for (const contact of contacts) {
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
        const trackingPixel = `<img src="${pixelUrl}" width="1" height="1" alt="" style="display:none;"/>`;

        const personalizedBody = personalize(campaign.body) + trackingPixel;
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
