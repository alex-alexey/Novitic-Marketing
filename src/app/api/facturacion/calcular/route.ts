import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-guard";
import { connectToDatabase } from "@/lib/mongodb";
import Cliente from "@/models/Cliente";
import Incidencia from "@/models/Incidencia";
import mongoose from "mongoose";

// GET /api/facturacion/calcular?mes=YYYY-MM
// Devuelve el cálculo de facturación para todos los clientes activos en el mes indicado
export async function GET(req: NextRequest) {
  const auth = await requireAuth();
  if (auth) return auth;
  await connectToDatabase();

  const { searchParams } = new URL(req.url);
  const mes = searchParams.get("mes");
  if (!mes || !/^\d{4}-\d{2}$/.test(mes)) {
    return NextResponse.json({ error: "Parámetro mes requerido (YYYY-MM)" }, { status: 400 });
  }

  const [year, month] = mes.split("-").map(Number);
  const desde = new Date(year, month - 1, 1);
  const hasta = new Date(year, month, 1);

  const clientes = await Cliente.find({ estado: "activo" })
    .select("nombre empresa email serviciosContratados tarifaHoraExtra")
    .lean();

  const resultados = await Promise.all(
    clientes.map(async (cliente) => {
      const c = cliente as any;
      const clienteId = new mongoose.Types.ObjectId(String(c._id));

      const incidencias = await Incidencia.find({
        clienteId,
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

      // Construir conceptos listos para la factura
      const conceptos = [
        ...(c.serviciosContratados ?? []).map((s: any) => ({
          descripcion: s.nombre,
          cantidad: 1,
          precioUnitario: s.precio,
        })),
        ...(horasExtra > 0
          ? [{
              descripcion: `Horas de soporte adicionales (${horasExtra}h × ${tarifaHoraExtra}€/h)`,
              cantidad: horasExtra,
              precioUnitario: tarifaHoraExtra,
            }]
          : []),
      ];

      return {
        clienteId: String(c._id),
        nombre: c.nombre,
        empresa: c.empresa,
        email: c.email,
        serviciosContratados: c.serviciosContratados ?? [],
        tarifaHoraExtra,
        horasTrabajadas,
        horasIncluidas,
        horasExtra,
        importeServicios,
        importeExtra,
        importeTotal,
        conceptos,
        incidencias: incidencias.map((inc: any) => ({
          titulo: inc.titulo,
          horas: inc.horasConsumidas ?? 0,
          estado: inc.estado,
        })),
      };
    })
  );

  // Ordenar: primero los que tienen importeTotal > 0
  resultados.sort((a, b) => b.importeTotal - a.importeTotal);

  return NextResponse.json({ mes, resultados });
}
