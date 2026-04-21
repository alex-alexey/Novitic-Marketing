"use client";

import { useRouter } from "next/navigation";
import ClienteForm from "@/components/ClienteForm";

export default function NuevoClientePage() {
  const router = useRouter();

  async function handleSubmit(data: Record<string, unknown>) {
    const res = await fetch("/api/clientes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const text = await res.text();
    let json: any = {};
    try {
      json = text ? JSON.parse(text) : {};
    } catch (err) {
      throw new Error("Respuesta inválida del servidor");
    }
    if (!res.ok) throw new Error(json.error ?? "Error al crear cliente.");
    router.push("/clientes");
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900">Nuevo cliente</h2>
        <p className="text-zinc-500 mt-1">Añade un nuevo cliente actual</p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 p-8">
        <ClienteForm onSubmit={handleSubmit} submitLabel="Crear cliente" />
      </div>
    </div>
  );
}
