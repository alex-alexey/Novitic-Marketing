"use client";

import { useRouter } from "next/navigation";
import CampaignForm from "@/components/CampaignForm";

export default function NuevaCampanaPage() {
  const router = useRouter();

  async function handleSubmit(data: Record<string, unknown>) {
    const res = await fetch("/api/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error ?? "Error al crear la campaña.");
    router.push("/dashboard/campanas");
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900">Nueva campaña</h2>
        <p className="text-zinc-500 mt-1">Crea una nueva campaña de email marketing</p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 p-8">
        <CampaignForm onSubmit={handleSubmit} submitLabel="Crear campaña" />
      </div>
    </div>
  );
}
