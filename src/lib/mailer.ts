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

export async function sendComentarioCliente(opts: {
  ticketId: string;
  titulo: string;
  textoComentario: string;
  emailCliente: string;
  nombreCliente?: string;
}) {
  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"Novitic Soporte" <${process.env.EMAIL_FROM}>`,
    to: opts.emailCliente,
    subject: `[Ticket #${opts.ticketId.slice(-6).toUpperCase()}] Nuevo comentario de tu solicitud`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#18181b;">
        <div style="background:#2563eb;padding:24px 32px;border-radius:12px 12px 0 0;">
          <h1 style="color:white;font-size:20px;margin:0;">Novitic · Soporte técnico</h1>
        </div>
        <div style="background:#ffffff;padding:32px;border:1px solid #e4e4e7;border-top:none;border-radius:0 0 12px 12px;">
          <p style="margin:0 0 8px;font-size:15px;">Hola${opts.nombreCliente ? ` <strong>${opts.nombreCliente}</strong>` : ""},</p>
          <p style="margin:0 0 20px;font-size:15px;color:#52525b;">
            Hemos añadido una actualización a tu solicitud de soporte.
          </p>
          <div style="background:#f4f4f5;border-radius:10px;padding:16px 20px;margin-bottom:20px;">
            <p style="margin:0 0 6px;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:#71717a;">Ticket</p>
            <p style="margin:0;font-size:13px;font-weight:600;font-family:monospace;">#${opts.ticketId.slice(-6).toUpperCase()} — ${opts.titulo}</p>
          </div>
          <div style="border-left:4px solid #2563eb;padding:12px 16px;background:#eff6ff;border-radius:0 8px 8px 0;margin-bottom:24px;">
            <p style="margin:0 0 4px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:#2563eb;">Comentario de Novitic</p>
            <p style="margin:0;font-size:14px;color:#1e3a5f;white-space:pre-wrap;">${opts.textoComentario.replace(/\n/g, "<br>")}</p>
          </div>
          <p style="font-size:13px;color:#71717a;margin:0;">
            Si necesitas responder o añadir más información, contesta a este correo indicando tu número de ticket.
          </p>
        </div>
        <p style="text-align:center;font-size:12px;color:#a1a1aa;margin-top:16px;">Novitic · info@novitic.com</p>
      </div>
    `,
  });
}

const ESTADO_LABEL: Record<string, string> = {
  "en-progreso": "En progreso",
  resuelta: "Resuelta",
  cerrada: "Cerrada",
  abierta: "Abierta",
};

const ESTADO_COLOR: Record<string, string> = {
  "en-progreso": "#f59e0b",
  resuelta: "#16a34a",
  cerrada: "#6b7280",
  abierta: "#ef4444",
};

export async function sendEstadoCambioCliente(opts: {
  ticketId: string;
  titulo: string;
  nuevoEstado: string;
  emailCliente: string;
  nombreCliente?: string;
}) {
  const transporter = createTransporter();
  const estadoLabel = ESTADO_LABEL[opts.nuevoEstado] ?? opts.nuevoEstado;
  const estadoColor = ESTADO_COLOR[opts.nuevoEstado] ?? "#6b7280";

  const mensajeEstado: Record<string, string> = {
    "en-progreso": "Nuestro equipo ya está trabajando en tu solicitud.",
    resuelta: "Hemos resuelto tu solicitud. Si el problema persiste, no dudes en contactarnos.",
    cerrada: "Tu solicitud ha sido cerrada. Gracias por confiar en Novitic.",
  };

  await transporter.sendMail({
    from: `"Novitic Soporte" <${process.env.EMAIL_FROM}>`,
    to: opts.emailCliente,
    subject: `[Ticket #${opts.ticketId.slice(-6).toUpperCase()}] Tu solicitud está ${estadoLabel.toLowerCase()}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#18181b;">
        <div style="background:#2563eb;padding:24px 32px;border-radius:12px 12px 0 0;">
          <h1 style="color:white;font-size:20px;margin:0;">Novitic · Soporte técnico</h1>
        </div>
        <div style="background:#ffffff;padding:32px;border:1px solid #e4e4e7;border-top:none;border-radius:0 0 12px 12px;">
          <p style="margin:0 0 8px;font-size:15px;">Hola${opts.nombreCliente ? ` <strong>${opts.nombreCliente}</strong>` : ""},</p>
          <p style="margin:0 0 20px;font-size:15px;color:#52525b;">
            ${mensajeEstado[opts.nuevoEstado] ?? "El estado de tu solicitud ha sido actualizado."}
          </p>
          <div style="background:#f4f4f5;border-radius:10px;padding:20px 24px;margin-bottom:24px;">
            <table style="width:100%;border-collapse:collapse;font-size:14px;">
              <tr>
                <td style="padding:4px 0;color:#71717a;width:110px;">Ticket</td>
                <td style="padding:4px 0;font-weight:600;font-family:monospace;">#${opts.ticketId.slice(-6).toUpperCase()}</td>
              </tr>
              <tr>
                <td style="padding:4px 0;color:#71717a;">Asunto</td>
                <td style="padding:4px 0;font-weight:500;">${opts.titulo}</td>
              </tr>
              <tr>
                <td style="padding:4px 0;color:#71717a;">Estado</td>
                <td style="padding:4px 0;">
                  <span style="background:${estadoColor}1a;color:${estadoColor};font-weight:600;font-size:12px;padding:2px 10px;border-radius:20px;">
                    ${estadoLabel}
                  </span>
                </td>
              </tr>
            </table>
          </div>
          <p style="font-size:13px;color:#71717a;margin:0;">
            Si tienes alguna duda, responde a este correo con el número de ticket.
          </p>
        </div>
        <p style="text-align:center;font-size:12px;color:#a1a1aa;margin-top:16px;">Novitic · info@novitic.com</p>
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

const MESES_ES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

const PRIORIDAD_EMAIL_LABEL: Record<string, string> = {
  baja: "Baja", media: "Media", alta: "Alta", critica: "Crítica",
};

const PRIORIDAD_EMAIL_COLOR: Record<string, string> = {
  baja: "#6b7280", media: "#3b82f6", alta: "#f59e0b", critica: "#ef4444",
};

const ESTADO_EMAIL_LABEL: Record<string, string> = {
  abierta: "Abierta", "en-progreso": "En progreso", resuelta: "Resuelta", cerrada: "Cerrada",
};

const ESTADO_EMAIL_COLOR: Record<string, string> = {
  abierta: "#ef4444", "en-progreso": "#f59e0b", resuelta: "#16a34a", cerrada: "#6b7280",
};

type MesData = {
  abiertas: number;
  enProgreso: number;
  resueltas: number;
  cerradas: number;
  horas: number;
  tickets: Array<{ titulo: string; estado: string; prioridad: string; horasConsumidas: number }>;
};

const MESES_COMPLETOS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

export async function sendResumenFacturacion(opts: {
  emailCliente: string;
  nombreCliente?: string;
  empresa?: string;
  mes: string; // YYYY-MM
  serviciosContratados: { nombre: string; precio: number; horasIncluidas: number }[];
  horasTrabajadas: number;
  horasIncluidas: number;
  horasExtra: number;
  tarifaHoraExtra: number;
  importeServicios: number;
  importeExtra: number;
  importeTotal: number;
  incidencias: { titulo: string; horas: number; estado: string }[];
}) {
  const transporter = createTransporter();
  const [year, month] = opts.mes.split("-");
  const labelMes = `${MESES_COMPLETOS[parseInt(month) - 1]} ${year}`;

  const fmtEur = (n: number) => n.toLocaleString("es-ES", { style: "currency", currency: "EUR" });

  const serviciosHtml = opts.serviciosContratados.length === 0 ? "" : `
    <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:4px;">
      <thead>
        <tr style="border-bottom:1px solid #e4e4e7;">
          <th style="text-align:left;padding:5px 0;color:#71717a;font-weight:600;">Servicio</th>
          ${opts.horasIncluidas > 0 ? `<th style="text-align:center;padding:5px 8px;color:#71717a;font-weight:600;">Horas incl.</th>` : ""}
          <th style="text-align:right;padding:5px 0;color:#71717a;font-weight:600;">Importe</th>
        </tr>
      </thead>
      <tbody>
        ${opts.serviciosContratados.map((s) => `
          <tr style="border-bottom:1px solid #f4f4f5;">
            <td style="padding:6px 0;color:#3f3f46;">${s.nombre}</td>
            ${opts.horasIncluidas > 0 ? `<td style="padding:6px 8px;text-align:center;color:#71717a;">${s.horasIncluidas > 0 ? s.horasIncluidas + "h" : "—"}</td>` : ""}
            <td style="padding:6px 0;text-align:right;font-weight:600;color:#18181b;">${fmtEur(s.precio)}</td>
          </tr>
        `).join("")}
        ${opts.horasExtra > 0 ? `
          <tr style="border-bottom:1px solid #f4f4f5;">
            <td style="padding:6px 0;color:#92400e;">Horas adicionales (${opts.horasExtra}h × ${fmtEur(opts.tarifaHoraExtra)}/h)</td>
            ${opts.horasIncluidas > 0 ? `<td style="padding:6px 8px;text-align:center;color:#a1a1aa;">—</td>` : ""}
            <td style="padding:6px 0;text-align:right;font-weight:600;color:#92400e;">${fmtEur(opts.importeExtra)}</td>
          </tr>
        ` : ""}
        <tr>
          <td style="padding:10px 0 0;font-weight:700;color:#18181b;font-size:14px;">Total a facturar</td>
          ${opts.horasIncluidas > 0 ? `<td></td>` : ""}
          <td style="padding:10px 0 0;text-align:right;font-weight:800;font-size:16px;color:#2563eb;">${fmtEur(opts.importeTotal)}</td>
        </tr>
      </tbody>
    </table>
  `;

  const horasHtml = `
    <div style="background:#f4f4f5;border-radius:10px;padding:14px 18px;margin-bottom:20px;">
      <p style="margin:0 0 8px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#71717a;">Horas de soporte — ${labelMes}</p>
      <div style="display:flex;gap:16px;font-size:13px;">
        <div><span style="color:#71717a;">Trabajadas:</span> <strong style="color:#18181b;">${opts.horasTrabajadas}h</strong></div>
        <div><span style="color:#71717a;">Incluidas:</span> <strong style="color:#18181b;">${opts.horasIncluidas}h</strong></div>
        ${opts.horasExtra > 0 ? `<div><span style="color:#92400e;">Adicionales:</span> <strong style="color:#92400e;">+${opts.horasExtra}h</strong></div>` : ""}
      </div>
    </div>
  `;

  const incidenciasHtml = opts.incidencias.length === 0 ? "" : `
    <p style="margin:20px 0 8px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#71717a;">
      Incidencias del mes (${opts.incidencias.length})
    </p>
    <table style="width:100%;border-collapse:collapse;font-size:12px;margin-bottom:20px;">
      <tbody>
        ${opts.incidencias.map((inc) => `
          <tr style="border-bottom:1px solid #f4f4f5;">
            <td style="padding:5px 0;color:#3f3f46;flex:1;">${inc.titulo}</td>
            <td style="padding:5px 8px;text-align:right;color:#71717a;white-space:nowrap;">${inc.estado}</td>
            <td style="padding:5px 0;text-align:right;font-weight:600;color:#18181b;white-space:nowrap;">${inc.horas > 0 ? inc.horas + "h" : "—"}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;

  await transporter.sendMail({
    from: `"Novitic" <${process.env.EMAIL_FROM}>`,
    to: opts.emailCliente,
    subject: `Resumen de servicios ${labelMes} — ${opts.empresa ?? opts.nombreCliente ?? "tu cuenta"}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#18181b;">
        <div style="background:#2563eb;padding:24px 32px;border-radius:12px 12px 0 0;">
          <h1 style="color:white;font-size:20px;margin:0;">Novitic · Resumen de servicios</h1>
          <p style="color:#bfdbfe;font-size:13px;margin:6px 0 0;">${labelMes}</p>
        </div>
        <div style="background:#ffffff;padding:32px;border:1px solid #e4e4e7;border-top:none;border-radius:0 0 12px 12px;">
          <p style="margin:0 0 6px;font-size:15px;">Hola${opts.nombreCliente ? ` <strong>${opts.nombreCliente}</strong>` : ""},</p>
          <p style="margin:0 0 24px;font-size:14px;color:#52525b;">
            Te enviamos el resumen de servicios prestados durante ${labelMes}${opts.empresa ? ` para <strong>${opts.empresa}</strong>` : ""}.
            En breve recibirás la factura correspondiente.
          </p>

          <!-- Horas -->
          ${horasHtml}

          <!-- Servicios y total -->
          <p style="margin:0 0 10px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#71717a;">Desglose de facturación</p>
          <div style="background:#f9f9f9;border-radius:10px;padding:16px 18px;margin-bottom:20px;">
            ${serviciosHtml}
          </div>

          <!-- Incidencias -->
          ${incidenciasHtml}

          <p style="font-size:13px;color:#71717a;margin:16px 0 0;">
            Si tienes alguna pregunta sobre este resumen, no dudes en contactarnos en
            <a href="mailto:info@novitic.com" style="color:#2563eb;">info@novitic.com</a>.
          </p>
        </div>
        <p style="text-align:center;font-size:12px;color:#a1a1aa;margin-top:16px;">Novitic · info@novitic.com</p>
      </div>
    `,
  });
}

export async function sendExtractoMensual(opts: {
  emailCliente: string;
  nombreCliente?: string;
  empresa?: string;
  meses: Record<string, MesData>;
}) {
  const transporter = createTransporter();

  const mesesEntries = Object.entries(opts.meses);
  const totalHoras = mesesEntries.reduce((sum, [, m]) => sum + m.horas, 0);
  const totalTickets = mesesEntries.reduce((sum, [, m]) => sum + m.tickets.length, 0);

  const ahora = new Date();
  const mesActual = `${MESES_ES[ahora.getMonth()]} ${ahora.getFullYear()}`;

  const mesesHtml = mesesEntries.map(([key, m]) => {
    const [year, month] = key.split("-");
    const label = `${MESES_ES[parseInt(month) - 1]} ${year}`;
    const totalMes = m.abiertas + m.enProgreso + m.resueltas + m.cerradas;

    const ticketsHtml = m.tickets.length === 0 ? "" : `
      <table style="width:100%;border-collapse:collapse;font-size:12px;margin-top:8px;">
        <thead>
          <tr style="border-bottom:1px solid #e4e4e7;">
            <th style="text-align:left;padding:4px 8px 4px 0;color:#71717a;font-weight:600;">Incidencia</th>
            <th style="text-align:center;padding:4px 6px;color:#71717a;font-weight:600;">Estado</th>
            <th style="text-align:center;padding:4px 6px;color:#71717a;font-weight:600;">Prioridad</th>
            <th style="text-align:right;padding:4px 0 4px 6px;color:#71717a;font-weight:600;">Horas</th>
          </tr>
        </thead>
        <tbody>
          ${m.tickets.map((t) => `
            <tr style="border-bottom:1px solid #f4f4f5;">
              <td style="padding:5px 8px 5px 0;color:#3f3f46;max-width:220px;">${t.titulo}</td>
              <td style="padding:5px 6px;text-align:center;">
                <span style="background:${ESTADO_EMAIL_COLOR[t.estado] ?? "#6b7280"}1a;color:${ESTADO_EMAIL_COLOR[t.estado] ?? "#6b7280"};font-size:11px;font-weight:600;padding:1px 8px;border-radius:20px;white-space:nowrap;">
                  ${ESTADO_EMAIL_LABEL[t.estado] ?? t.estado}
                </span>
              </td>
              <td style="padding:5px 6px;text-align:center;">
                <span style="background:${PRIORIDAD_EMAIL_COLOR[t.prioridad] ?? "#6b7280"}1a;color:${PRIORIDAD_EMAIL_COLOR[t.prioridad] ?? "#6b7280"};font-size:11px;font-weight:600;padding:1px 8px;border-radius:20px;white-space:nowrap;">
                  ${PRIORIDAD_EMAIL_LABEL[t.prioridad] ?? t.prioridad}
                </span>
              </td>
              <td style="padding:5px 0 5px 6px;text-align:right;font-weight:600;color:#18181b;">
                ${t.horasConsumidas > 0 ? `${t.horasConsumidas}h` : "—"}
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;

    return `
      <div style="margin-bottom:20px;background:#f9f9f9;border-radius:10px;overflow:hidden;">
        <div style="background:#f4f4f5;padding:10px 16px;display:flex;justify-content:space-between;align-items:center;">
          <span style="font-size:13px;font-weight:700;color:#18181b;">${label}</span>
          <span style="font-size:12px;color:#71717a;">${totalMes} ticket${totalMes !== 1 ? "s" : ""} · <strong style="color:#18181b;">${m.horas > 0 ? m.horas + "h" : "0h"}</strong></span>
        </div>
        ${totalMes === 0 ? `<p style="margin:0;padding:10px 16px;font-size:12px;color:#a1a1aa;">Sin actividad este mes.</p>` : `<div style="padding:8px 16px 12px;">${ticketsHtml}</div>`}
      </div>
    `;
  }).join("");

  await transporter.sendMail({
    from: `"Novitic Soporte" <${process.env.EMAIL_FROM}>`,
    to: opts.emailCliente,
    subject: `Extracto de actividad — ${opts.empresa ?? opts.nombreCliente ?? "tu cuenta"} · ${mesActual}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#18181b;">
        <div style="background:#2563eb;padding:24px 32px;border-radius:12px 12px 0 0;">
          <h1 style="color:white;font-size:20px;margin:0;">Novitic · Extracto de actividad</h1>
          <p style="color:#bfdbfe;font-size:13px;margin:6px 0 0;">Últimos 6 meses</p>
        </div>
        <div style="background:#ffffff;padding:32px;border:1px solid #e4e4e7;border-top:none;border-radius:0 0 12px 12px;">
          <p style="margin:0 0 6px;font-size:15px;">Hola${opts.nombreCliente ? ` <strong>${opts.nombreCliente}</strong>` : ""},</p>
          <p style="margin:0 0 24px;font-size:14px;color:#52525b;">
            Te enviamos el resumen de incidencias y horas de soporte de los últimos 6 meses${opts.empresa ? ` para <strong>${opts.empresa}</strong>` : ""}.
          </p>

          <!-- Resumen global -->
          <div style="display:flex;gap:12px;margin-bottom:28px;">
            <div style="flex:1;background:#eff6ff;border-radius:10px;padding:16px;text-align:center;">
              <p style="margin:0;font-size:28px;font-weight:800;color:#2563eb;">${totalTickets}</p>
              <p style="margin:4px 0 0;font-size:12px;color:#3b82f6;font-weight:600;">TICKETS</p>
            </div>
            <div style="flex:1;background:#f0fdf4;border-radius:10px;padding:16px;text-align:center;">
              <p style="margin:0;font-size:28px;font-weight:800;color:#16a34a;">${totalHoras}h</p>
              <p style="margin:4px 0 0;font-size:12px;color:#16a34a;font-weight:600;">HORAS TOTALES</p>
            </div>
          </div>

          <!-- Detalle por mes -->
          <p style="margin:0 0 12px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#71717a;">Detalle mensual</p>
          ${mesesHtml}

          <p style="font-size:13px;color:#71717a;margin:16px 0 0;">
            Si tienes alguna pregunta sobre este extracto, responde a este correo o contacta con nosotros en <a href="mailto:info@novitic.com" style="color:#2563eb;">info@novitic.com</a>.
          </p>
        </div>
        <p style="text-align:center;font-size:12px;color:#a1a1aa;margin-top:16px;">Novitic · info@novitic.com</p>
      </div>
    `,
  });
}
