import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-guard";
import { connectToDatabase } from "@/lib/mongodb";
import Cliente from "@/models/Cliente";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  const auth = await requireAuth();
  if (auth) return auth;
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  // Si se pasa id, devolver el cliente individual
  if (id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }
    const cliente = await Cliente.findById(id);
    if (!cliente) return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });
    return NextResponse.json({ cliente });
  }

  // Si no hay id, devolver listado paginado
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const skip = (page - 1) * limit;
  const q = searchParams.get("q")?.trim() || "";
  const estado = searchParams.get("estado") || "";
  const filter: any = {};
  if (q) {
    filter.$or = [
      { nombre: { $regex: q, $options: "i" } },
      { email: { $regex: q, $options: "i" } },
    ];
  }
  if (estado) {
    filter.estado = estado;
  }
  const total = await Cliente.countDocuments(filter);
  const clientes = await Cliente.find(filter)
    .sort({ nombre: 1 })
    .skip(skip)
    .limit(limit);
  const pages = Math.max(1, Math.ceil(total / limit));
  return NextResponse.json({ clientes, total, page, pages });
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (auth) return auth;
  await connectToDatabase();
  const data = await req.json();
  const cliente = await Cliente.create(data);
  return NextResponse.json({ cliente });
}

export async function PUT(req: NextRequest) {
  const auth = await requireAuth();
  if (auth) return auth;
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  try {
  const data = await req.json();
  console.log("PUT /api/clientes payload:", JSON.stringify(data).slice(0, 2000));
    const cliente = await Cliente.findById(id);
    if (!cliente) return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });

    // Asignar solo campos permitidos para evitar sobreescritura accidental
    const updatable = [
      "nombre",
      "empresa",
      "email",
      "telefono",
      "web",
      "localidad",
      "estado",
      "fechaAlta",
      "notas",
      "serviciosContratados",
      "datosFiscales",
    ];
    updatable.forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        (cliente as unknown as Record<string, unknown>)[key] = (data as Record<string, unknown>)[key];
      }
    });
    cliente.markModified("datosFiscales");
    cliente.markModified("serviciosContratados");

    // Validar antes de guardar para capturar errores de esquema
    try {
      await cliente.validate();
    } catch (validationErr: any) {
      console.error("Validation error updating cliente:", validationErr);
      const errors = validationErr.errors ? Object.keys(validationErr.errors).map(k => ({ field: k, message: validationErr.errors[k].message })) : [{ message: validationErr.message }];
      return NextResponse.json({ error: "Validation failed", details: errors }, { status: 400 });
    }

    await cliente.save();
    return NextResponse.json({ cliente });
  } catch (err: any) {
    console.error("PUT /api/clientes error:", err);
    return NextResponse.json({ error: err?.message || "Error al actualizar cliente" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAuth();
  if (auth) return auth;
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const cliente = await Cliente.findByIdAndDelete(id);
  if (!cliente) return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
