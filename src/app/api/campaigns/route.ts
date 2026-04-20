import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Campaign from "@/models/Campaign";
import { requireAuth } from "@/lib/auth-guard";

export async function GET(req: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") ?? "";
    const categoria = searchParams.get("categoria") ?? "";

    const filter: Record<string, unknown> = {};
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { subject: { $regex: q, $options: "i" } },
      ];
    }
    if (categoria) filter.categoria = categoria;

    const campaigns = await Campaign.find(filter).sort({ createdAt: -1 }).lean();
    const total = await Campaign.countDocuments(filter);

    return NextResponse.json({ campaigns, total });
  } catch (error) {
    console.error("[GET /api/campaigns]", error);
    return NextResponse.json({ error: "Error interno." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;
  try {
    await connectToDatabase();
    const body = await req.json();
    const { name, subject, body: emailBody, tags, status, categoria, startDate, endDate } = body;

    if (!name || !subject || !emailBody) {
      return NextResponse.json({ error: "Nombre, asunto y cuerpo son obligatorios." }, { status: 400 });
    }

    const campaign = await Campaign.create({ name, subject, body: emailBody, tags, status, categoria, startDate: startDate || undefined, endDate: endDate || undefined });
    return NextResponse.json(campaign, { status: 201 });
  } catch (error) {
    console.error("[POST /api/campaigns]", error);
    return NextResponse.json({ error: "Error interno." }, { status: 500 });
  }
}
