"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ClienteForm from "@/components/ClienteForm";

export default function EditarClientePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [cliente, setCliente] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCliente() {
      setLoading(true);
      const res = await fetch(`/api/clientes?id=${id}`);
      if (res.ok) {
        const data = await res.json();
        setCliente(data.cliente);
      } else {
        setError("No se pudo cargar el cliente");
      }
      setLoading(false);
    }
    if (id) fetchCliente();
  }, [id]);

  async function handleSubmit(data: Record<string, unknown>) {
    const res = await fetch(`/api/clientes?id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const text = await res.text();
    let json: any = {};
    try {
      json = text ? JSON.parse(text) : {};
    } catch (err) {
      // respuesta no-JSON
      throw new Error("Respuesta inválida del servidor");
    }
    if (!res.ok) {
      console.error("PUT /api/clientes failed", res.status, json);
      throw new Error(json.error ?? `Error al guardar cambios (status ${res.status}).`);
    }
    router.push("/clientes");
  }

  if (loading) return <div className="p-8">Cargando cliente...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!cliente) return <div className="p-8">Cliente no encontrado</div>;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900">Editar cliente</h2>
        <p className="text-zinc-500 mt-1">Modifica los datos del cliente actual</p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 p-8">
        <ClienteForm initial={cliente} onSubmit={handleSubmit} submitLabel="Guardar cambios" />
      </div>
    </div>
  );
}
