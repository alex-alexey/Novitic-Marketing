"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

interface ContactFormProps {
  initial?: {
    name?: string;
    email?: string;
    company?: string;
    phone?: string;
    website?: string;
    profesion?: string;
    localidad?: string;
    objetivo?: string;
    status?: string;
    tags?: string[];
    notes?: string;
  };
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  submitLabel: string;
}

export default function ContactForm({ initial = {}, onSubmit, submitLabel }: ContactFormProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: initial.name ?? "",
    email: initial.email ?? "",
    company: initial.company ?? "",
    phone: initial.phone ?? "",
    website: initial.website ?? "",
    profesion: initial.profesion ?? "",
    localidad: initial.localidad ?? "",
    objetivo: initial.objetivo ?? "",
    status: initial.status ?? "activo",
    notes: initial.notes ?? "",
  });
  const [tags, setTags] = useState<string[]>(initial.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function addTag() {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t)) setTags((prev) => [...prev, t]);
    setTagInput("");
  }

  function removeTag(tag: string) {
    setTags((prev) => prev.filter((t) => t !== tag));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Normalizar URL: añadir https:// si falta
    const website = form.website.trim()
      ? form.website.trim().startsWith("http")
        ? form.website.trim()
        : `https://${form.website.trim()}`
      : "";

    try {
      await onSubmit({ ...form, website, tags });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al guardar.");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
      <div className="grid grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">Nombre *</label>
          <input
            name="name" required value={form.name} onChange={handleChange}
            className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nombre completo"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">Email *</label>
          <input
            name="email" type="email" required value={form.email} onChange={handleChange}
            className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="correo@empresa.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">Empresa</label>
          <input
            name="company" value={form.company} onChange={handleChange}
            className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nombre de la empresa"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">Teléfono</label>
          <input
            name="phone" value={form.phone} onChange={handleChange}
            className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="+34 600 000 000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">Página web</label>
          <input
            name="website" type="text" value={form.website} onChange={handleChange}
            className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://empresa.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">Profesión / Cargo</label>
          <input
            name="profesion" value={form.profesion} onChange={handleChange}
            className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: Gerente, Autónomo, Director TI..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">Localidad</label>
          <input
            name="localidad" value={form.localidad} onChange={handleChange}
            className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: Madrid, Barcelona, Valencia..."
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-2">Objetivo de campaña</label>
        <div className="flex flex-wrap gap-3">
          {[
            { value: "", label: "Sin definir" },
            { value: "pagina-web", label: "🌐 Página Web" },
            { value: "servicios-informaticos", label: "💻 Servicios IT" },
            { value: "otro", label: "📋 Otro" },
          ].map((opt) => (
            <label
              key={opt.value}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 cursor-pointer text-sm font-medium transition-colors ${
                form.objetivo === opt.value
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-zinc-200 text-zinc-600 hover:border-zinc-300"
              }`}
            >
              <input
                type="radio" name="objetivo" value={opt.value}
                checked={form.objetivo === opt.value}
                onChange={handleChange} className="sr-only"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">Estado</label>
        <select
          name="status" value={form.status} onChange={handleChange}
          className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
          <option value="no-contactar">No contactar</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">Tags</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag) => (
            <span key={tag} className="flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full">
              {tag}
              <button type="button" onClick={() => removeTag(tag)}>
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Añadir tag y pulsar Enter"
          />
          <button type="button" onClick={addTag} className="px-3 py-2 text-sm bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors">
            Añadir
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">Notas</label>
        <textarea
          name="notes" value={form.notes} onChange={handleChange} rows={3}
          className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Notas internas sobre este contacto..."
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">{error}</p>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit" disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? "Guardando..." : submitLabel}
        </button>
        <button
          type="button" onClick={() => router.back()}
          className="text-zinc-600 hover:text-zinc-900 text-sm font-medium px-5 py-2.5 rounded-lg border border-zinc-300 hover:bg-zinc-50 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
