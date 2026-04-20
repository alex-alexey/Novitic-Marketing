import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Contact from "@/models/Contact";
import { requireAuth } from "@/lib/auth-guard";

export async function GET() {
  const authError = await requireAuth();
  if (authError) return authError;
  await connectToDatabase();
  const contacts = await Contact.find({}).sort({ createdAt: -1 }).lean();

  const headers = [
    "nombre", "email", "empresa", "telefono", "web",
    "profesion", "localidad", "objetivo", "estado", "tags", "notas",
  ];

  const rows = contacts.map((c) => {
    const cx = c as unknown as Record<string, unknown>;
    return [
      c.name ?? "",
      c.email ?? "",
      c.company ?? "",
      c.phone ?? "",
      c.website ?? "",
      (cx.profesion as string) ?? "",
      (cx.localidad as string) ?? "",
      (cx.objetivo as string) ?? "",
      c.status ?? "activo",
      (c.tags ?? []).join(";"),
      c.notes ?? "",
    ];
  });

  const escape = (v: string) => `"${String(v).replace(/"/g, '""')}"`;
  const csv = [headers.join(","), ...rows.map((r) => r.map(escape).join(","))].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="contactos-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
