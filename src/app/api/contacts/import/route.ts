import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Contact from "@/models/Contact";

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.replace(/\r/g, "").split("\n").filter((l) => l.trim());
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.replace(/^"|"$/g, "").trim().toLowerCase());

  return lines.slice(1).map((line) => {
    const values: string[] = [];
    let inQuotes = false;
    let current = "";

    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
        else inQuotes = !inQuotes;
      } else if (ch === "," && !inQuotes) {
        values.push(current); current = "";
      } else {
        current += ch;
      }
    }
    values.push(current);

    const row: Record<string, string> = {};
    headers.forEach((h, i) => { row[h] = (values[i] ?? "").trim(); });
    return row;
  });
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) return NextResponse.json({ error: "No se recibió archivo." }, { status: 400 });

    const text = await file.text();
    const rows = parseCSV(text);

    if (!rows.length) return NextResponse.json({ error: "El archivo está vacío o mal formateado." }, { status: 400 });

    let imported = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const row of rows) {
      const email = (row.email ?? "").toLowerCase().trim();
      const name = (row.nombre ?? row.name ?? "").trim();

      if (!email || !name) { skipped++; continue; }

      try {
        await Contact.findOneAndUpdate(
          { email },
          {
            $set: {
              name,
              email,
              company: row.empresa ?? row.company ?? "",
              phone: row.telefono ?? row.phone ?? "",
              website: row.web ?? row.website ?? "",
              profesion: row.profesion ?? "",
              localidad: row.localidad ?? "",
              objetivo: row.objetivo ?? "",
              status: (row.estado ?? row.status ?? "activo") as "activo" | "inactivo" | "no-contactar",
              tags: row.tags ? row.tags.split(";").map((t: string) => t.trim()).filter(Boolean) : [],
              notes: row.notas ?? row.notes ?? "",
            },
          },
          { upsert: true, new: true }
        );
        imported++;
      } catch {
        errors.push(email);
        skipped++;
      }
    }

    return NextResponse.json({ imported, skipped, errors });
  } catch (error) {
    console.error("[POST /api/contacts/import]", error);
    return NextResponse.json({ error: "Error interno." }, { status: 500 });
  }
}
