import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Incidencia from "@/models/Incidencia";
import Cliente from "@/models/Cliente";
import { requireAuth } from "@/lib/auth-guard";
import { sendEstadoCambioCliente, sendTicketNotificacionInterna, sendTicketConfirmacion } from "@/lib/mailer";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  const auth = await requireAuth();
  if (auth) return auth;
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }
    const incidencia = await Incidencia.findById(id).populate("clienteId", "nombre empresa");
    if (!incidencia) return NextResponse.json({ error: "No encontrada" }, { status: 404 });
    return NextResponse.json({ incidencia });
  }

  const estado = searchParams.get("estado") || "";
  const prioridad = searchParams.get("prioridad") || "";
  const clienteId = searchParams.get("clienteId") || "";
  const q = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = {};
  if (estado) filter.estado = estado;
  if (prioridad) filter.prioridad = prioridad;
  if (clienteId) {
    if (!mongoose.Types.ObjectId.isValid(clienteId)) {
      return NextResponse.json({ error: "clienteId inválido" }, { status: 400 });
    }
    filter.clienteId = clienteId;
  }
  if (q) {
    filter.$or = [
      { titulo: { $regex: q, $options: "i" } },
      { descripcion: { $regex: q, $options: "i" } },
    ];
  }

  const total = await Incidencia.countDocuments(filter);
  const incidencias = await Incidencia.find(filter)
    .populate("clienteId", "nombre empresa")
    .sort({ fechaApertura: -1 })
    .skip(skip)
    .limit(limit);
  const pages = Math.max(1, Math.ceil(total / limit));
  return NextResponse.json({ incidencias, total, page, pages });
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (auth) return auth;
  await connectToDatabase();
  const data = await req.json();
  if (!data?.titulo?.trim()) {
    return NextResponse.json({ error: "El título es obligatorio" }, { status: 400 });
  }

  // Si falta emailContacto pero hay clienteId, buscar el email del cliente
  let emailContacto = data.emailContacto;
  let nombreCliente = data.nombre || data.nombreContacto;
  if ((!emailContacto || !emailContacto.trim()) && data.clienteId) {
    const cliente = await Cliente.findById(data.clienteId).select("email nombre").lean();
    if (cliente) {
      emailContacto = cliente.email;
      if (!nombreCliente) nombreCliente = cliente.nombre;
    }
  }
  // Si sigue faltando emailContacto, error
  if (!emailContacto || !emailContacto.trim()) {
    return NextResponse.json({ error: "No se ha podido determinar el email del cliente" }, { status: 400 });
  }

  // Crear incidencia con emailContacto correcto
  const incidencia = await Incidencia.create({ ...data, emailContacto });

  // Construir objeto ticketOpts igual que en /soporte
  const ticketOpts = {
    ticketId: String(incidencia._id),
    titulo: incidencia.titulo,
    descripcion: incidencia.descripcion,
    prioridad: incidencia.prioridad || "media",
    emailCliente: emailContacto,
    nombreCliente: nombreCliente || undefined,
  };

  // Enviar emails en paralelo (confirmación cliente y notificación interna)
  await Promise.allSettled([
    sendTicketConfirmacion(ticketOpts),
    sendTicketNotificacionInterna(ticketOpts),
  ]);

  return NextResponse.json({ incidencia });
}

export async function PUT(req: NextRequest) {
  const auth = await requireAuth();
  if (auth) return auth;
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const data = await req.json();

  const anterior = await Incidencia.findById(id).select("estado emailContacto clienteId titulo").lean();
  const incidencia = await Incidencia.findByIdAndUpdate(id, { $set: data }, { new: true }).populate("clienteId", "nombre empresa email");
  if (!incidencia) return NextResponse.json({ error: "No encontrada" }, { status: 404 });

  // Enviar email si el estado cambió a algo relevante para el cliente
  const estadosNotificables = ["en-progreso", "resuelta", "cerrada"];
  const estadoCambio = data.estado && data.estado !== (anterior as any)?.estado;
  if (estadoCambio && estadosNotificables.includes(data.estado)) {
    let emailCliente: string | undefined;
    let nombreCliente: string | undefined;

    if (incidencia.clienteId && typeof incidencia.clienteId === "object") {
      const c = incidencia.clienteId as any;
      emailCliente = c.email;
      nombreCliente = c.nombre;
    }
    if (!emailCliente) emailCliente = incidencia.emailContacto;
    if (!emailCliente && incidencia.clienteId) {
      const c = await Cliente.findById(incidencia.clienteId).select("email nombre").lean();
      if (c) { emailCliente = (c as any).email; nombreCliente = (c as any).nombre; }
    }

    if (emailCliente) {
      sendEstadoCambioCliente({
        ticketId: String(incidencia._id),
        titulo: incidencia.titulo,
        nuevoEstado: data.estado,
        emailCliente,
        nombreCliente,
      }).catch(() => {});
    }
  }

  return NextResponse.json({ incidencia });
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAuth();
  if (auth) return auth;
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const incidencia = await Incidencia.findByIdAndDelete(id);
  if (!incidencia) return NextResponse.json({ error: "No encontrada" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
