"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, Send, Users, CheckCircle2, XCircle, Search, FileText } from "lucide-react";

interface Contact {
  _id: string;
  name: string;
  email: string;
  company?: string;
  localidad?: string;
  objetivo?: string;
  notes?: string;
  status: string;
}

interface Campaign {
  _id: string;
  name: string;
  subject: string;
  body: string;
  categoria: string;
  status: string;
}

export default function EnviarCampanaPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filtered, setFiltered] = useState<Contact[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loadingData, setLoadingData] = useState(true);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ sent: number; errors: string[] } | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`/api/campaigns/${id}`).then((r) => r.json()),
      fetch("/api/contacts?limit=500").then((r) => r.json()),
    ]).then(([camp, cont]) => {
      setCampaign(camp);
      const activos = (cont.contacts ?? []).filter((c: Contact) => c.status === "activo");
      setContacts(activos);
      setFiltered(activos);
      setLoadingData(false);
    });
  }, [id]);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      contacts.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          (c.company ?? "").toLowerCase().includes(q) ||
          (c.notes ?? "").toLowerCase().includes(q)
      )
    );
  }, [search, contacts]);

  function toggleAll() {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((c) => c._id)));
    }
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function handleSend() {
    if (!selected.size) return;
    if (!confirm(`¿Enviar a ${selected.size} contacto${selected.size !== 1 ? "s" : ""}?`)) return;

    setSending(true);
    const res = await fetch(`/api/campaigns/${id}/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contactIds: Array.from(selected) }),
    });
    const data = await res.json();
    setSending(false);
    setResult(data);
  }

  if (loadingData) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 size={24} className="animate-spin text-zinc-400" />
      </div>
    );
  }

  if (!campaign) return null;

  if (result) {
    return (
      <div className="p-8 max-w-lg">
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 p-8 text-center">
          <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={28} className="text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-zinc-900 mb-1">¡Campaña enviada!</h2>
          <p className="text-zinc-500 mb-6">
            Se enviaron <strong>{result.sent}</strong> emails correctamente.
            {result.errors.length > 0 && (
              <span className="block mt-1 text-red-500 text-sm">
                Fallos: {result.errors.join(", ")}
              </span>
            )}
          </p>
          <button
            onClick={() => router.push("/dashboard/campanas")}
            className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            Volver a campañas
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">Enviar campaña</h2>
          <p className="text-zinc-500 mt-1">{campaign.name} · {campaign.subject}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setPreviewOpen(!previewOpen)}
            className="px-4 py-2.5 text-sm border border-zinc-300 rounded-lg hover:bg-zinc-50 transition-colors font-medium"
          >
            {previewOpen ? "Ocultar preview" : "Ver preview"}
          </button>
          <button
            onClick={handleSend}
            disabled={selected.size === 0 || sending}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            {sending ? "Enviando..." : `Enviar a ${selected.size} contacto${selected.size !== 1 ? "s" : ""}`}
          </button>
        </div>
      </div>

      {/* Preview */}
      {previewOpen && (
        <div className="mb-6 bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
          <div className="px-6 py-3 border-b border-zinc-100 bg-zinc-50">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Preview del email</p>
            <p className="text-sm text-zinc-700 mt-0.5"><span className="font-medium">Asunto:</span> {campaign.subject}</p>
          </div>
          <div
            className="p-6 prose max-w-none text-sm"
            dangerouslySetInnerHTML={{
              __html: campaign.body.replace(/\{\{nombre\}\}/g, "Nombre Ejemplo"),
            }}
          />
        </div>
      )}

      {/* Selección de contactos */}
      <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <div className="flex items-center gap-3">
            <Users size={18} className="text-zinc-400" />
            <span className="text-sm font-semibold text-zinc-700">
              Contactos activos ({contacts.length})
              {search && filtered.length !== contacts.length && (
                <span className="ml-1.5 text-xs text-zinc-400 font-normal">· {filtered.length} filtrados</span>
              )}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Buscar contacto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white w-48"
              />
            </div>
            <button
              onClick={toggleAll}
              className="text-sm text-purple-600 hover:underline font-medium whitespace-nowrap"
            >
              {selected.size === filtered.length && filtered.length > 0 ? "Deseleccionar todos" : "Seleccionar todos"}
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <XCircle size={24} className="text-zinc-300 mb-3" />
            <p className="text-sm text-zinc-500">No hay contactos activos disponibles.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100 max-h-[520px] overflow-y-auto">
            {filtered.map((c) => (
              <label
                key={c._id}
                className="flex items-start gap-4 px-6 py-3.5 hover:bg-zinc-50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selected.has(c._id)}
                  onChange={() => toggleOne(c._id)}
                  className="w-4 h-4 mt-0.5 rounded accent-purple-600 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-zinc-900">{c.name}</p>
                    {c.objetivo === "pagina-web" && (
                      <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full">🌐 Web</span>
                    )}
                    {c.objetivo === "servicios-informaticos" && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">💻 IT</span>
                    )}
                    {c.localidad && (
                      <span className="text-xs text-zinc-400">📍 {c.localidad}</span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5">{c.email}{c.company ? ` · ${c.company}` : ""}</p>
                  {c.notes && (
                    <div className="flex items-start gap-1.5 mt-1.5 bg-amber-50 border border-amber-100 rounded-lg px-2.5 py-1.5">
                      <FileText size={12} className="text-amber-500 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-amber-800 leading-relaxed">{c.notes}</p>
                    </div>
                  )}
                </div>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
