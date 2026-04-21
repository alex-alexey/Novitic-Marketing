import nodemailer from "nodemailer";

export function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: Number(process.env.EMAIL_PORT) === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

const PRIORIDAD_LABEL: Record<string, string> = {
  baja: "Baja",
  media: "Media",
  alta: "Alta",
  critica: "Crítica",
};

const PRIORIDAD_COLOR: Record<string, string> = {
  baja: "#6b7280",
  media: "#3b82f6",
  alta: "#f59e0b",
  critica: "#ef4444",
};

interface TicketEmailOptions {
  ticketId: string;
  titulo: string;
  descripcion?: string;
  prioridad: string;
  emailCliente: string;
  nombreCliente?: string;
}

export async function sendTicketConfirmacion(opts: TicketEmailOptions) {
  const transporter = createTransporter();
  const prioLabel = PRIORIDAD_LABEL[opts.prioridad] ?? opts.prioridad;
  const prioColor = PRIORIDAD_COLOR[opts.prioridad] ?? "#6b7280";

  await transporter.sendMail({
    from: `"Novitic Soporte" <${process.env.EMAIL_FROM}>`,
    to: opts.emailCliente,
    subject: `[Ticket #${opts.ticketId.slice(-6).toUpperCase()}] Hemos recibido tu solicitud`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#18181b;">
        <div style="background:#2563eb;padding:24px 32px;border-radius:12px 12px 0 0;">
          <h1 style="color:white;font-size:20px;margin:0;">Novitic · Soporte técnico</h1>
        </div>
        <div style="background:#ffffff;padding:32px;border:1px solid #e4e4e7;border-top:none;border-radius:0 0 12px 12px;">
          <p style="margin:0 0 8px;font-size:15px;">Hola${opts.nombreCliente ? ` <strong>${opts.nombreCliente}</strong>` : ""},</p>
          <p style="margin:0 0 24px;font-size:15px;color:#52525b;">
            Hemos recibido tu solicitud de soporte. Nos pondremos en contacto contigo lo antes posible.
          </p>

          <div style="background:#f4f4f5;border-radius:10px;padding:20px 24px;margin-bottom:24px;">
            <p style="margin:0 0 12px;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:#71717a;">
              Resumen del ticket
            </p>
            <table style="width:100%;border-collapse:collapse;font-size:14px;">
              <tr>
                <td style="padding:4px 0;color:#71717a;width:110px;">Número</td>
                <td style="padding:4px 0;font-weight:600;font-family:monospace;">#${opts.ticketId.slice(-6).toUpperCase()}</td>
              </tr>
              <tr>
                <td style="padding:4px 0;color:#71717a;">Asunto</td>
                <td style="padding:4px 0;font-weight:500;">${opts.titulo}</td>
              </tr>
              ${opts.descripcion ? `
              <tr>
                <td style="padding:4px 0;color:#71717a;vertical-align:top;">Descripción</td>
                <td style="padding:4px 0;color:#3f3f46;">${opts.descripcion.replace(/\n/g, "<br>")}</td>
              </tr>` : ""}
              <tr>
                <td style="padding:4px 0;color:#71717a;">Urgencia</td>
                <td style="padding:4px 0;">
                  <span style="background:${prioColor}1a;color:${prioColor};font-weight:600;font-size:12px;padding:2px 10px;border-radius:20px;">
                    ${prioLabel}
                  </span>
                </td>
              </tr>
            </table>
          </div>

          <p style="font-size:13px;color:#71717a;margin:0;">
            Si tienes más detalles que añadir, responde a este correo indicando tu número de ticket.
          </p>
        </div>
        <p style="text-align:center;font-size:12px;color:#a1a1aa;margin-top:16px;">
          Novitic · info@novitic.com
        </p>
      </div>
    `,
  });
}

export async function sendTicketNotificacionInterna(opts: TicketEmailOptions) {
  const transporter = createTransporter();
  const notifyEmails = (process.env.SOPORTE_NOTIFY_EMAIL ?? process.env.EMAIL_FROM ?? "").split(",").map(e => e.trim()).filter(Boolean);
  if (!notifyEmails.length) return;

  const prioLabel = PRIORIDAD_LABEL[opts.prioridad] ?? opts.prioridad;
  const prioColor = PRIORIDAD_COLOR[opts.prioridad] ?? "#6b7280";
  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

  await transporter.sendMail({
    from: `"Novitic Soporte" <${process.env.EMAIL_FROM}>`,
    to: notifyEmails.join(", "),
    subject: `[Nuevo ticket] ${opts.titulo}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#18181b;">
        <div style="background:#18181b;padding:24px 32px;border-radius:12px 12px 0 0;">
          <h1 style="color:white;font-size:18px;margin:0;">🎫 Nuevo ticket de soporte</h1>
        </div>
        <div style="background:#ffffff;padding:32px;border:1px solid #e4e4e7;border-top:none;border-radius:0 0 12px 12px;">
          <div style="background:#f4f4f5;border-radius:10px;padding:20px 24px;margin-bottom:24px;">
            <table style="width:100%;border-collapse:collapse;font-size:14px;">
              <tr>
                <td style="padding:4px 0;color:#71717a;width:110px;">Ticket</td>
                <td style="padding:4px 0;font-weight:600;font-family:monospace;">#${opts.ticketId.slice(-6).toUpperCase()}</td>
              </tr>
              <tr>
                <td style="padding:4px 0;color:#71717a;">Asunto</td>
                <td style="padding:4px 0;font-weight:600;">${opts.titulo}</td>
              </tr>
              <tr>
                <td style="padding:4px 0;color:#71717a;">Email</td>
                <td style="padding:4px 0;">${opts.emailCliente}</td>
              </tr>
              ${opts.nombreCliente ? `
              <tr>
                <td style="padding:4px 0;color:#71717a;">Nombre</td>
                <td style="padding:4px 0;">${opts.nombreCliente}</td>
              </tr>` : ""}
              ${opts.descripcion ? `
              <tr>
                <td style="padding:4px 0;color:#71717a;vertical-align:top;">Descripción</td>
                <td style="padding:4px 0;color:#3f3f46;">${opts.descripcion.replace(/\n/g, "<br>")}</td>
              </tr>` : ""}
              <tr>
                <td style="padding:4px 0;color:#71717a;">Urgencia</td>
                <td style="padding:4px 0;">
                  <span style="background:${prioColor}1a;color:${prioColor};font-weight:600;font-size:12px;padding:2px 10px;border-radius:20px;">
                    ${prioLabel}
                  </span>
                </td>
              </tr>
            </table>
          </div>

          <a href="${baseUrl}/incidencias"
            style="display:inline-block;background:#2563eb;color:white;font-size:14px;font-weight:600;padding:10px 20px;border-radius:8px;text-decoration:none;">
            Ver en el panel →
          </a>
        </div>
      </div>
    `,
  });
}
