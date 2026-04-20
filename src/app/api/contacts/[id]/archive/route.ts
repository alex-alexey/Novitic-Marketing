import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Contact from "@/models/Contact";
import { requireAuth } from "@/lib/auth-guard";

type Params = { params: Promise<{ id: string }> };

// POST /api/contacts/[id]/archive — archivar / desarchivar contacto
export async function POST(req: NextRequest, { params }: Params) {
  const authError = await requireAuth();
  if (authError) return authError;
  try {
    await connectToDatabase();
    const { id } = await params;
    const { archived } = await req.json();
    const contact = await Contact.findByIdAndUpdate(
      id,
      { archived: !!archived },
      { new: true }
    );
    if (!contact) return NextResponse.json({ error: "Contacto no encontrado." }, { status: 404 });
    return NextResponse.json({ contact });
  } catch (error) {
    console.error("[POST /api/contacts/id/archive]", error);
    return NextResponse.json({ error: "Error interno." }, { status: 500 });
  }
}
