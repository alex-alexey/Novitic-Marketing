import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Cliente from "@/models/Cliente";
import { requireAuth } from "@/lib/auth-guard";

export async function GET() {
  const auth = await requireAuth();
  if (auth) return auth;
  await connectToDatabase();
  const clientes = await Cliente.find().sort({ nombre: 1 });
  const header = [
    "Nombre",
    "Empresa",
    "Email",
    "Teléfono",
    "Web",
    "Localidad",
    "Estado",
    "Servicios",
    "Notas",
    "Razón social",
    "CIF/NIF",
    "Dirección",
    "CP",
    "Localidad fiscal",
    "Provincia",
    "País"
  ];
  const rows = clientes.map((c) => [
    c.nombre,
    c.empresa || "",
    c.email,
    c.telefono || "",
    c.web || "",
    c.localidad || "",
    c.estado,
    (c.serviciosContratados || []).map((s: any) => `${s.nombre} (${s.precio}€)`).join("; "),
    c.notas || "",
    c.datosFiscales?.razonSocial || "",
    c.datosFiscales?.cif || "",
    c.datosFiscales?.direccion || "",
    c.datosFiscales?.cp || "",
    c.datosFiscales?.localidad || "",
    c.datosFiscales?.provincia || "",
    c.datosFiscales?.pais || ""
  ]);
  const csv = [header, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename=clientes.csv`
    }
  });
}
