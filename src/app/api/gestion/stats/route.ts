import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-guard";
import { connectToDatabase } from "@/lib/mongodb";
import Cliente from "@/models/Cliente";
import Factura from "@/models/Factura";
import Incidencia from "@/models/Incidencia";

export async function GET(req: NextRequest) {
  const auth = await requireAuth();
  if (auth) return auth;

  await connectToDatabase();

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const [
    totalClientes,
    clientesActivos,
    facturacionMes,
    facturasPendientes,
    importePendiente,
    incidenciasAbiertas,
    incidenciasCriticas,
    ultimasIncidencias,
    ultimasFacturas,
  ] = await Promise.all([
    Cliente.countDocuments({}),
    Cliente.countDocuments({ estado: "activo" }),
    Factura.aggregate([
      {
        $match: {
          fechaEmision: { $gte: startOfMonth, $lte: endOfMonth },
          estado: { $ne: "cancelada" },
        },
      },
      { $group: { _id: null, total: { $sum: "$importe" } } },
    ]),
    Factura.countDocuments({ estado: "pendiente" }),
    Factura.aggregate([
      { $match: { estado: "pendiente" } },
      { $group: { _id: null, total: { $sum: "$importe" } } },
    ]),
    Incidencia.countDocuments({ estado: { $in: ["abierta", "en-progreso"] } }),
    Incidencia.countDocuments({ estado: { $in: ["abierta", "en-progreso"] }, prioridad: "critica" }),
    Incidencia.find({ estado: { $in: ["abierta", "en-progreso"] } })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("clienteId", "nombre empresa"),
    Factura.find({ estado: { $in: ["pendiente", "vencida"] } })
      .sort({ fechaVencimiento: 1 })
      .limit(5)
      .populate("clienteId", "nombre empresa"),
  ]);

  return NextResponse.json({
    stats: {
      totalClientes,
      clientesActivos,
      facturacionMes: facturacionMes[0]?.total ?? 0,
      facturasPendientes,
      importePendiente: importePendiente[0]?.total ?? 0,
      incidenciasAbiertas,
      incidenciasCriticas,
    },
    ultimasIncidencias,
    ultimasFacturas,
  });
}
