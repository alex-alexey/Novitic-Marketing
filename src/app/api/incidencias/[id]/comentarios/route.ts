import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Incidencia from "@/models/Incidencia";
import { requireAuth } from "@/lib/auth-guard";

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
  ).populate("clienteId", "nombre empresa");

  if (!incidencia) return NextResponse.json({ error: "No encontrada" }, { status: 404 });
  return NextResponse.json({ incidencia });
}
