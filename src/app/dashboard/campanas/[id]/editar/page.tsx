"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import CampaignForm from "@/components/CampaignForm";
import { Loader2 } from "lucide-react";

export default function EditarCampanaPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [campaign, setCampaign] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    fetch(`/api/campaigns/${id}`)
      .then((r) => r.json())
      .then(setCampaign);
  }, [id]);

  async function handleSubmit(data: Record<string, unknown>) {
    const res = await fetch(`/api/campaigns/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error ?? "Error al actualizar.");
    router.push("/dashboard/campanas");
  }

  if (!campaign) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 size={24} className="animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900">Editar campaña</h2>
        <p className="text-zinc-500 mt-1">{campaign.name as string}</p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 p-8">
        <CampaignForm
          initial={campaign as Parameters<typeof CampaignForm>[0]["initial"]}
          onSubmit={handleSubmit}
          submitLabel="Guardar cambios"
        />
      </div>
    </div>
  );
}
