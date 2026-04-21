import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Incidencia from "@/models/Incidencia";
import { requireAuth } from "@/lib/auth-guard";
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
  const incidencia = await Incidencia.create(data);
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
  const incidencia = await Incidencia.findByIdAndUpdate(id, { $set: data }, { new: true }).populate("clienteId", "nombre empresa");
  if (!incidencia) return NextResponse.json({ error: "No encontrada" }, { status: 404 });
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
