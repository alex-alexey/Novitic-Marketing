import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Incidencia from "@/models/Incidencia";
import Cliente from "@/models/Cliente";
import { requireAuth } from "@/lib/auth-guard";
import { sendComentarioCliente } from "@/lib/mailer";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth();
  if (auth) return auth;
  await connectToDatabase();

  const { id } = await params;
  const { texto, autor } = await req.json();
  if (!texto?.trim()) return NextResponse.json({ error: "El comentario no puede estar vacío" }, { status: 400 });

  const incidencia = await Incidencia.findByIdAndUpdate(
    id,
    { $push: { comentarios: { texto: texto.trim(), autor: autor ?? "Admin", fecha: new Date() } } },
    { new: true }
  ).populate("clienteId", "nombre empresa email");

  if (!incidencia) return NextResponse.json({ error: "No encontrada" }, { status: 404 });

  // Determinar email y nombre del cliente
  let emailCliente: string | undefined;
  let nombreCliente: string | undefined;

  if (incidencia.clienteId && typeof incidencia.clienteId === "object") {
    const c = incidencia.clienteId as any;
    emailCliente = c.email;
    nombreCliente = c.nombre;
  } else if (incidencia.emailContacto) {
    emailCliente = incidencia.emailContacto;
    if (!emailCliente && incidencia.clienteId) {
      const c = await Cliente.findById(incidencia.clienteId).select("email nombre").lean();
      if (c) { emailCliente = (c as any).email; nombreCliente = (c as any).nombre; }
    }
  }

  if (emailCliente) {
    sendComentarioCliente({
      ticketId: String(incidencia._id),
      titulo: incidencia.titulo,
      textoComentario: texto.trim(),
      emailCliente,
      nombreCliente,
    }).catch(() => {});
  }

  return NextResponse.json({ incidencia });
}
