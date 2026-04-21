import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-guard";
import { connectToDatabase } from "@/lib/mongodb";
import Cliente from "@/models/Cliente";
import Incidencia from "@/models/Incidencia";
import { sendResumenFacturacion } from "@/lib/mailer";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (auth) return auth;
  await connectToDatabase();

  const { clienteId, mes } = await req.json().catch(() => ({}));

  if (!clienteId || !mongoose.Types.ObjectId.isValid(clienteId)) {
    return NextResponse.json({ error: "clienteId inválido" }, { status: 400 });
  }
  if (!mes || !/^\d{4}-\d{2}$/.test(mes)) {
    return NextResponse.json({ error: "Parámetro mes requerido (YYYY-MM)" }, { status: 400 });
  }

  const cliente = await Cliente.findById(clienteId).lean();
  if (!cliente) return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });

  const c = cliente as any;
  if (!c.email) {
    return NextResponse.json({ error: "El cliente no tiene email registrado" }, { status: 400 });
  }

  const [year, month] = mes.split("-").map(Number);
  const desde = new Date(year, month - 1, 1);
  const hasta = new Date(year, month, 1);

  const incidencias = await Incidencia.find({
    clienteId: new mongoose.Types.ObjectId(clienteId),
    fechaApertura: { $gte: desde, $lt: hasta },
  })
    .select("titulo horasConsumidas estado")
    .lean();

  const horasTrabajadas = incidencias.reduce((sum: number, inc: any) => sum + (inc.horasConsumidas ?? 0), 0);
  const horasIncluidas = (c.serviciosContratados ?? []).reduce((sum: number, s: any) => sum + (s.horasIncluidas ?? 0), 0);
  const horasExtra = Math.max(0, horasTrabajadas - horasIncluidas);
  const tarifaHoraExtra = c.tarifaHoraExtra ?? 0;
  const importeServicios = (c.serviciosContratados ?? []).reduce((sum: number, s: any) => sum + (s.precio ?? 0), 0);
  const importeExtra = horasExtra * tarifaHoraExtra;
  const importeTotal = importeServicios + importeExtra;

  await sendResumenFacturacion({
    emailCliente: c.email,
    nombreCliente: c.nombre,
    empresa: c.empresa,
    mes,
    serviciosContratados: (c.serviciosContratados ?? []).map((s: any) => ({
      nombre: s.nombre,
      precio: s.precio,
      horasIncluidas: s.horasIncluidas ?? 0,
    })),
    horasTrabajadas,
    horasIncluidas,
    horasExtra,
    tarifaHoraExtra,
    importeServicios,
    importeExtra,
    importeTotal,
    incidencias: incidencias.map((inc: any) => ({
      titulo: inc.titulo,
      horas: inc.horasConsumidas ?? 0,
      estado: inc.estado,
    })),
  });

  return NextResponse.json({ ok: true });
}
