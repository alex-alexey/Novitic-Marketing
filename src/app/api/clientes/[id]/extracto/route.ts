import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Cliente from "@/models/Cliente";
import Incidencia from "@/models/Incidencia";
import { requireAuth } from "@/lib/auth-guard";
import { sendExtractoMensual } from "@/lib/mailer";
import mongoose from "mongoose";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth();
  if (auth) return auth;
  await connectToDatabase();

  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const cliente = await Cliente.findById(id).lean();
  if (!cliente) return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });

  const emailCliente = (cliente as any).email;
  if (!emailCliente) {
    return NextResponse.json({ error: "El cliente no tiene email registrado" }, { status: 400 });
  }

  const { mes } = await req.json().catch(() => ({}));
  if (!mes || !/^\d{4}-\d{2}$/.test(mes)) {
    return NextResponse.json({ error: "Debes indicar un mes válido (YYYY-MM)" }, { status: 400 });
  }

  const [year, month] = mes.split("-").map(Number);
  const desde = new Date(year, month - 1, 1);
  const hasta = new Date(year, month, 1);

  const clienteId = new mongoose.Types.ObjectId(id);

  const incidencias = await Incidencia.find({
    clienteId,
    fechaApertura: { $gte: desde, $lt: hasta },
  })
    .select("titulo estado prioridad fechaApertura horasConsumidas")
    .sort({ fechaApertura: -1 })
    .lean();

  const mesData = { abiertas: 0, enProgreso: 0, resueltas: 0, cerradas: 0, horas: 0, tickets: [] as any[] };
  for (const inc of incidencias) {
    mesData.horas += (inc as any).horasConsumidas ?? 0;
    mesData.tickets.push(inc);
    const estado = (inc as any).estado;
    if (estado === "abierta") mesData.abiertas++;
    else if (estado === "en-progreso") mesData.enProgreso++;
    else if (estado === "resuelta") mesData.resueltas++;
    else if (estado === "cerrada") mesData.cerradas++;
  }

  const meses = { [mes]: mesData };

  await sendExtractoMensual({
    emailCliente,
    nombreCliente: (cliente as any).nombre,
    empresa: (cliente as any).empresa,
    meses,
  });

  return NextResponse.json({ ok: true });
}
