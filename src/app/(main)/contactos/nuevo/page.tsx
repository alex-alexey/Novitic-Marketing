"use client";

import { useRouter } from "next/navigation";
import ContactForm from "@/components/ContactForm";

export default function NuevoContactoPage() {
  const router = useRouter();

  async function handleSubmit(data: Record<string, unknown>) {
    const res = await fetch("/api/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error ?? "Error al crear contacto.");
    router.push("/contactos");
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900">Nuevo contacto</h2>
        <p className="text-zinc-500 mt-1">Añade un nuevo lead o cliente potencial</p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 p-8">
        <ContactForm onSubmit={handleSubmit} submitLabel="Crear contacto" />
      </div>
    </div>
  );
}
