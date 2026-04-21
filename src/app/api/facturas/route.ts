import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-guard";
import { connectToDatabase } from "@/lib/mongodb";
import Factura from "@/models/Factura";
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
    const factura = await Factura.findById(id).populate("clienteId", "nombre empresa");
    if (!factura) return NextResponse.json({ error: "Factura no encontrada" }, { status: 404 });
    return NextResponse.json({ factura });
  }

  const estado = searchParams.get("estado") || "";
  const clienteId = searchParams.get("clienteId") || "";
  const q = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = {};
  if (estado) filter.estado = estado;
  if (clienteId) {
    if (!mongoose.Types.ObjectId.isValid(clienteId)) {
      return NextResponse.json({ error: "clienteId inválido" }, { status: 400 });
    }
    filter.clienteId = clienteId;
  }
  if (q) {
    filter.$or = [
      { numero: { $regex: q, $options: "i" } },
      { notas: { $regex: q, $options: "i" } },
    ];
  }

  const total = await Factura.countDocuments(filter);
  const facturas = await Factura.find(filter)
    .populate("clienteId", "nombre empresa")
    .sort({ fechaEmision: -1 })
    .skip(skip)
    .limit(limit);
  const pages = Math.max(1, Math.ceil(total / limit));

  // Totales por estado
  const [pendiente, vencida] = await Promise.all([
    Factura.aggregate([{ $match: { estado: "pendiente" } }, { $group: { _id: null, total: { $sum: "$importe" } } }]),
    Factura.aggregate([{ $match: { estado: "vencida" } }, { $group: { _id: null, total: { $sum: "$importe" } } }]),
  ]);

  return NextResponse.json({
    facturas,
    total,
    page,
    pages,
    resumen: {
      importePendiente: pendiente[0]?.total ?? 0,
      importeVencido: vencida[0]?.total ?? 0,
    },
  });
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (auth) return auth;
  await connectToDatabase();
  const data = await req.json();
  if (!data?.clienteId || !data?.numero || !data?.fechaVencimiento) {
    return NextResponse.json({ error: "clienteId, numero y fechaVencimiento son obligatorios" }, { status: 400 });
  }
  const factura = await Factura.create(data);
  return NextResponse.json({ factura }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const auth = await requireAuth();
  if (auth) return auth;
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }
  const data = await req.json();
  const factura = await Factura.findByIdAndUpdate(id, { $set: data }, { new: true }).populate("clienteId", "nombre empresa");
  if (!factura) return NextResponse.json({ error: "Factura no encontrada" }, { status: 404 });
  return NextResponse.json({ factura });
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAuth();
  if (auth) return auth;
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }
  const factura = await Factura.findByIdAndDelete(id);
  if (!factura) return NextResponse.json({ error: "Factura no encontrada" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
