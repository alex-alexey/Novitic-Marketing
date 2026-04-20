import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Campaign from "@/models/Campaign";
import { requireAuth } from "@/lib/auth-guard";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const authError = await requireAuth();
  if (authError) return authError;
  try {
    await connectToDatabase();
    const { id } = await params;
    const campaign = await Campaign.findById(id).lean();
    if (!campaign) return NextResponse.json({ error: "No encontrado." }, { status: 404 });
    return NextResponse.json(campaign);
  } catch (error) {
    console.error("[GET /api/campaigns/id]", error);
    return NextResponse.json({ error: "Error interno." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  const authError = await requireAuth();
  if (authError) return authError;
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await req.json();
    const campaign = await Campaign.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!campaign) return NextResponse.json({ error: "No encontrado." }, { status: 404 });
    return NextResponse.json(campaign);
  } catch (error) {
    console.error("[PUT /api/campaigns/id]", error);
    return NextResponse.json({ error: "Error interno." }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const authError = await requireAuth();
  if (authError) return authError;
  try {
    await connectToDatabase();
    const { id } = await params;
    await Campaign.findByIdAndDelete(id);
    return NextResponse.json({ message: "Eliminado." });
  } catch (error) {
    console.error("[DELETE /api/campaigns/id]", error);
    return NextResponse.json({ error: "Error interno." }, { status: 500 });
  }
}
