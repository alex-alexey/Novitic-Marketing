import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Incidencia from "@/models/Incidencia";
import { requireAuth } from "@/lib/auth-guard";
import mongoose from "mongoose";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth();
  if (auth) return auth;
  await connectToDatabase();
  const { id } = await params;
  const clienteId = new mongoose.Types.ObjectId(id);

  // Últimos 6 meses
  const now = new Date();
  const desde = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const incidencias = await Incidencia.find({
    clienteId,
    fechaApertura: { $gte: desde },
  }).lean();

  // Agrupar por mes
  const meses: Record<string, { abiertas: number; enProgreso: number; resueltas: number; cerradas: number; horas: number }> = {};

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    meses[key] = { abiertas: 0, enProgreso: 0, resueltas: 0, cerradas: 0, horas: 0 };
  }

  for (const inc of incidencias) {
    const d = new Date(inc.fechaApertura);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (!meses[key]) continue;
    meses[key].horas += inc.horasConsumidas ?? 0;
    if (inc.estado === "abierta") meses[key].abiertas++;
    else if (inc.estado === "en-progreso") meses[key].enProgreso++;
    else if (inc.estado === "resuelta") meses[key].resueltas++;
    else if (inc.estado === "cerrada") meses[key].cerradas++;
  }

  // Tickets actualmente abiertos o en progreso
  const ticketsActivos = await Incidencia.find({
    clienteId,
    estado: { $in: ["abierta", "en-progreso"] },
  }).sort({ prioridad: -1, fechaApertura: 1 }).lean();

  return NextResponse.json({ meses, ticketsActivos });
}
