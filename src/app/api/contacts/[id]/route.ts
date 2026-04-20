import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Contact from "@/models/Contact";

type Params = { params: Promise<{ id: string }> };

// GET /api/contacts/[id]
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const contact = await Contact.findById(id).lean();
    if (!contact) return NextResponse.json({ error: "No encontrado." }, { status: 404 });
    return NextResponse.json(contact);
  } catch (error) {
    console.error("[GET /api/contacts/id]", error);
    return NextResponse.json({ error: "Error interno." }, { status: 500 });
  }
}

// PUT /api/contacts/[id]
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await req.json();
    const contact = await Contact.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!contact) return NextResponse.json({ error: "No encontrado." }, { status: 404 });
    return NextResponse.json(contact);
  } catch (error) {
    console.error("[PUT /api/contacts/id]", error);
    return NextResponse.json({ error: "Error interno." }, { status: 500 });
  }
}

// DELETE /api/contacts/[id]
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    await connectToDatabase();
    const { id } = await params;
    await Contact.findByIdAndDelete(id);
    return NextResponse.json({ message: "Eliminado." });
  } catch (error) {
    console.error("[DELETE /api/contacts/id]", error);
    return NextResponse.json({ error: "Error interno." }, { status: 500 });
  }
}
