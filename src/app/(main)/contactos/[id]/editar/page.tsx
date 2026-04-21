"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import ContactForm from "@/components/ContactForm";
import { Loader2 } from "lucide-react";

export default function EditarContactoPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [contact, setContact] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    fetch(`/api/contacts/${id}`)
      .then((r) => r.json())
      .then(setContact);
  }, [id]);

  async function handleSubmit(data: Record<string, unknown>) {
    const res = await fetch(`/api/contacts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error ?? "Error al actualizar.");
    router.push("/contactos");
  }

  if (!contact) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 size={24} className="animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900">Editar contacto</h2>
        <p className="text-zinc-500 mt-1">{contact.email as string}</p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 p-8">
        <ContactForm initial={contact as Parameters<typeof ContactForm>[0]["initial"]} onSubmit={handleSubmit} submitLabel="Guardar cambios" />
      </div>
    </div>
  );
}
