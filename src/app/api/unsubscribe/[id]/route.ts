import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Contact from "@/models/Contact";

type Params = { params: Promise<{ id: string }> };

// GET /api/unsubscribe/[id] — página de baja pública (sin auth)
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const contact = await Contact.findById(id);
    if (!contact) {
      return new NextResponse(htmlPage("Error", "No se encontró el contacto.", false), {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    if (contact.unsubscribed) {
      return new NextResponse(
        htmlPage("Ya estás dado de baja", `<strong>${contact.email}</strong> ya está dado de baja de nuestras comunicaciones.`, false),
        { headers: { "Content-Type": "text/html; charset=utf-8" } }
      );
    }

    await Contact.findByIdAndUpdate(id, {
      unsubscribed: true,
      unsubscribedAt: new Date(),
      status: "no-contactar",
    });

    return new NextResponse(
      htmlPage(
        "Baja confirmada",
        `<strong>${contact.email}</strong> ha sido dado de baja correctamente.<br/><br/>No volverás a recibir comunicaciones comerciales de <strong>Novitic</strong>.`,
        true
      ),
      { headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  } catch (error) {
    console.error("[GET /api/unsubscribe/id]", error);
    return new NextResponse(htmlPage("Error", "Ha ocurrido un error. Por favor contacta con info@novitic.com.", false), {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }
}

function htmlPage(title: string, message: string, success: boolean) {
  const color = success ? "#16a34a" : "#dc2626";
  const bg = success ? "#f0fdf4" : "#fef2f2";
  const border = success ? "#bbf7d0" : "#fecaca";
  const icon = success ? "✅" : "ℹ️";

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${title} — Novitic</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f4f4f5; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
    .card { background: white; border-radius: 16px; padding: 40px; max-width: 480px; width: 100%; box-shadow: 0 4px 24px rgba(0,0,0,0.08); text-align: center; }
    .icon { font-size: 48px; margin-bottom: 20px; }
    h1 { font-size: 22px; font-weight: 700; color: #18181b; margin-bottom: 16px; }
    .msg { background: ${bg}; border: 1px solid ${border}; color: ${color}; border-radius: 10px; padding: 16px; font-size: 14px; line-height: 1.6; }
    .footer { margin-top: 24px; font-size: 12px; color: #a1a1aa; }
    .logo { font-size: 18px; font-weight: 800; color: #7c3aed; margin-bottom: 8px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">Novitic</div>
    <div class="icon">${icon}</div>
    <h1>${title}</h1>
    <div class="msg">${message}</div>
    <div class="footer">
      Novitic · info@novitic.com<br/>
      De acuerdo con el RGPD y la LSSI, tienes derecho a revocar esta baja enviando un email a info@novitic.com
    </div>
  </div>
</body>
</html>`;
}
