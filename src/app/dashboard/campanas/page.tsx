"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Plus, Search, Trash2, Pencil, Loader2, Send } from "lucide-react";

interface Campaign {
  _id: string;
  name: string;
  subject: string;
  status: "borrador" | "enviada" | "programada";
  categoria: "pagina-web" | "servicios-informaticos" | "otro";
  recipientCount: number;
  tags: string[];
  createdAt: string;
  sentAt?: string;
}

const statusStyles = {
  borrador: "bg-zinc-100 text-zinc-600",
  programada: "bg-amber-100 text-amber-700",
  enviada: "bg-green-100 text-green-700",
};

const categoriaLabels = {
  "pagina-web": "🌐 Página Web",
  "servicios-informaticos": "💻 Servicios IT",
  "clientes": "⭐ Clientes",
  otro: "📋 Otro",
};

export default function CampanasPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState("");
  const [categoriaFilter, setCategoriaFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchCampaigns = useCallback(async (q: string, cat: string) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (cat) params.set("categoria", cat);
    const res = await fetch(`/api/campaigns?${params.toString()}`);
    const data = await res.json();
    setCampaigns(data.campaigns ?? []);
    setTotal(data.total ?? 0);
    setLoading(false);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchCampaigns(query, categoriaFilter), 300);
    return () => clearTimeout(t);
  }, [query, categoriaFilter, fetchCampaigns]);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`¿Eliminar la campaña "${name}"?`)) return;
    setDeleting(id);
    await fetch(`/api/campaigns/${id}`, { method: "DELETE" });
    setDeleting(null);
    fetchCampaigns(query, categoriaFilter);
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">Campañas</h2>
          <p className="text-zinc-500 mt-1">{total} campaña{total !== 1 ? "s" : ""} en total</p>
        </div>
        <Link
          href="/dashboard/campanas/nueva"
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus size={16} />
          Nueva campaña
        </Link>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Buscar campaña..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-4 py-2.5 text-sm border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white w-64"
          />
        </div>
        <div className="flex gap-2">
          {[
            { value: "", label: "Todas" },
            { value: "pagina-web", label: "🌐 Página Web" },
            { value: "servicios-informaticos", label: "💻 Servicios IT" },
            { value: "otro", label: "📋 Otro" },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setCategoriaFilter(f.value)}
              className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                categoriaFilter === f.value
                  ? "border-purple-500 bg-purple-50 text-purple-700 font-medium"
                  : "border-zinc-200 text-zinc-600 hover:border-zinc-300"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-zinc-100 text-xs font-semibold text-zinc-500 uppercase tracking-wide">
          <span className="col-span-3">Nombre</span>
          <span className="col-span-3">Asunto</span>
          <span className="col-span-2">Categoría</span>
          <span className="col-span-1">Estado</span>
          <span className="col-span-1">Enviados</span>
          <span className="col-span-2 text-right">Acciones</span>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 size={24} className="animate-spin text-zinc-400" />
          </div>
        ) : campaigns.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-sm font-medium text-zinc-700">Sin campañas</p>
            <p className="text-sm text-zinc-400 mt-1">
              {query ? "No hay resultados." : "Crea tu primera campaña."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {campaigns.map((c) => (
              <div key={c._id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-zinc-50 transition-colors">
                <span className="col-span-3 text-sm font-medium text-zinc-900 truncate">{c.name}</span>
                <span className="col-span-3 text-sm text-zinc-500 truncate">{c.subject}</span>
                <span className="col-span-2 text-sm text-zinc-500">{categoriaLabels[c.categoria]}</span>
                <span className="col-span-1">
                  <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${statusStyles[c.status]}`}>
                    {c.status}
                  </span>
                </span>
                <span className="col-span-1 text-sm text-zinc-500">{c.recipientCount}</span>
                <span className="col-span-2 flex justify-end gap-2">
                  {c.status !== "enviada" && (
                    <Link
                      href={`/dashboard/campanas/${c._id}/enviar`}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-green-600 hover:bg-green-50 transition-colors"
                      title="Enviar campaña"
                    >
                      <Send size={15} />
                    </Link>
                  )}
                  <Link
                    href={`/dashboard/campanas/${c._id}/editar`}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                  >
                    <Pencil size={15} />
                  </Link>
                  <button
                    onClick={() => handleDelete(c._id, c.name)}
                    disabled={deleting === c._id}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    {deleting === c._id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                  </button>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
