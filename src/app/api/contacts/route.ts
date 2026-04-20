import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Contact from "@/models/Contact";
import { requireAuth } from "@/lib/auth-guard";

// GET /api/contacts — listar con búsqueda y paginación
export async function GET(req: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") ?? "";
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = 20;

    const filter = q
      ? {
          $or: [
            { name: { $regex: q, $options: "i" } },
            { email: { $regex: q, $options: "i" } },
            { company: { $regex: q, $options: "i" } },
          ],
        }
      : {};

    const [contacts, total] = await Promise.all([
      Contact.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Contact.countDocuments(filter),
    ]);

    return NextResponse.json({ contacts, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("[GET /api/contacts]", error);
    return NextResponse.json({ error: "Error interno." }, { status: 500 });
  }
}

// POST /api/contacts — crear contacto
export async function POST(req: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;
  try {
    await connectToDatabase();
    const body = await req.json();
    const { name, email, company, phone, website, profesion, localidad, objetivo, tags, status, notes } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Nombre y email son obligatorios." }, { status: 400 });
    }

    const existing = await Contact.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: "Ya existe un contacto con ese email." }, { status: 409 });
    }

    const contact = await Contact.create({ name, email, company, phone, website, profesion, localidad, objetivo, tags, status, notes });
    return NextResponse.json(contact, { status: 201 });
  } catch (error) {
    console.error("[POST /api/contacts]", error);
    return NextResponse.json({ error: "Error interno." }, { status: 500 });
  }
}
