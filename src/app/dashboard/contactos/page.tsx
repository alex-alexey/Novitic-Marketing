"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { Plus, Search, Trash2, Pencil, Loader2, Download, Upload, CheckCircle2, AlertCircle, Archive, ArchiveRestore } from "lucide-react";

interface Contact {
  _id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  website?: string;
  profesion?: string;
  localidad?: string;
  objetivo?: string;
  status: "activo" | "inactivo" | "no-contactar";
  unsubscribed?: boolean;
  archived?: boolean;
  tags: string[];
  createdAt: string;
}

const statusStyles = {
  activo: "bg-green-100 text-green-700",
  inactivo: "bg-zinc-100 text-zinc-600",
  "no-contactar": "bg-red-100 text-red-600",
};

export default function ContactosPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [profesionFilter, setProfesionFilter] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ imported: number; skipped: number } | null>(null);
  const [importError, setImportError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchContacts = useCallback(async (q: string, p: number, prof: string, archived: boolean) => {
    setLoading(true);
    const params = new URLSearchParams({ q, page: String(p), limit: "10" });
    if (prof) params.set("profesion", prof);
    if (archived) params.set("archived", "true");
    const res = await fetch(`/api/contacts?${params.toString()}`);
    const data = await res.json();
    setContacts(data.contacts ?? []);
    setTotal(data.total ?? 0);
    setPages(data.pages ?? 1);
    setLoading(false);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [query, profesionFilter, showArchived]);

  useEffect(() => {
    const t = setTimeout(() => fetchContacts(query, page, profesionFilter, showArchived), 300);
    return () => clearTimeout(t);
  }, [query, page, profesionFilter, showArchived, fetchContacts]);

  async function handleArchive(id: string, archive: boolean) {
    await fetch(`/api/contacts/${id}/archive`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ archived: archive }),
    });
    fetchContacts(query, page, profesionFilter, showArchived);
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`¿Eliminar a ${name}?`)) return;
    setDeleting(id);
    await fetch(`/api/contacts/${id}`, { method: "DELETE" });
    setDeleting(null);
    fetchContacts(query, page, profesionFilter, showArchived);
  }

  function handleExport() {
    window.open("/api/contacts/export", "_blank");
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setImportResult(null);
    setImportError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/contacts/import", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al importar.");
      setImportResult({ imported: data.imported, skipped: data.skipped });
      fetchContacts(query, page, profesionFilter, showArchived);
    } catch (err) {
      setImportError(err instanceof Error ? err.message : "Error al importar.");
    }
    setImporting(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">Contactos</h2>
          <p className="text-zinc-500 mt-1">
            {total} contacto{total !== 1 ? "s" : ""} en total
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Input oculto para importar */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleImport}
          />
          <button
            onClick={() => setShowArchived((v) => !v)}
            className={`flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-lg border transition-colors ${
              showArchived
                ? "bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100"
                : "text-zinc-700 border-zinc-300 hover:bg-zinc-50"
            }`}
          >
            {showArchived ? <ArchiveRestore size={15} /> : <Archive size={15} />}
            {showArchived ? "Ver activos" : "Ver archivados"}
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={importing}
            className="flex items-center gap-2 text-zinc-700 hover:text-zinc-900 text-sm font-medium px-4 py-2.5 rounded-lg border border-zinc-300 hover:bg-zinc-50 transition-colors disabled:opacity-50"
          >
            {importing ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
            Importar CSV
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 text-zinc-700 hover:text-zinc-900 text-sm font-medium px-4 py-2.5 rounded-lg border border-zinc-300 hover:bg-zinc-50 transition-colors"
          >
            <Download size={15} />
            Exportar CSV
          </button>
          <Link
            href="/dashboard/contactos/nuevo"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
          >
            <Plus size={16} />
            Añadir contacto
          </Link>
        </div>
      </div>

      {/* Notificaciones de importación */}
      {importResult && (
        <div className="flex items-center gap-2 mb-4 text-sm bg-green-50 text-green-700 border border-green-200 rounded-lg px-4 py-3">
          <CheckCircle2 size={16} />
          <span><strong>{importResult.imported}</strong> contactos importados correctamente.{importResult.skipped > 0 ? ` ${importResult.skipped} omitidos (sin nombre o email).` : ""}</span>
          <button onClick={() => setImportResult(null)} className="ml-auto text-green-500 hover:text-green-700">✕</button>
        </div>
      )}
      {importError && (
        <div className="flex items-center gap-2 mb-4 text-sm bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-3">
          <AlertCircle size={16} />
          <span>{importError}</span>
          <button onClick={() => setImportError("")} className="ml-auto text-red-400 hover:text-red-700">✕</button>
        </div>
      )}

      {/* Search + Filtros */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, email o empresa..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-80 pl-10 pr-4 py-2.5 text-sm border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
        <select
          value={profesionFilter}
          onChange={(e) => setProfesionFilter(e.target.value)}
          className="py-2.5 px-3 text-sm border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-zinc-700"
        >
          <option value="">Todas las profesiones</option>
          <option value="Autónomo">Autónomo</option>
          <option value="Empresario">Empresario</option>
          <option value="Directivo">Directivo</option>
          <option value="Freelance">Freelance</option>
          <option value="Otro">Otro</option>
        </select>
        {profesionFilter && (
          <button
            onClick={() => setProfesionFilter("")}
            className="text-xs text-zinc-500 hover:text-zinc-800 px-2 py-1 rounded-lg border border-zinc-200 hover:bg-zinc-50 transition-colors"
          >
            ✕ Limpiar filtro
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-zinc-100 text-xs font-semibold text-zinc-500 uppercase tracking-wide">
          <span className="col-span-2">Nombre</span>
          <span className="col-span-2">Email</span>
          <span className="col-span-1">Empresa</span>
          <span className="col-span-1">Profesión</span>
          <span className="col-span-1">Localidad</span>
          <span className="col-span-1">Objetivo</span>
          <span className="col-span-1">Estado</span>
          <span className="col-span-2">Web</span>
          <span className="col-span-1 text-right">Acciones</span>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 size={24} className="animate-spin text-zinc-400" />
          </div>
        ) : contacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-sm font-medium text-zinc-700">Sin contactos</p>
            <p className="text-sm text-zinc-400 mt-1">
              {query ? "No hay resultados para tu búsqueda." : "Añade tu primer contacto."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {contacts.map((c) => (
              <div key={c._id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-zinc-50 transition-colors">
                <span className="col-span-2 text-sm font-medium text-zinc-900 truncate">{c.name}</span>
                <span className="col-span-2 text-sm text-zinc-500 truncate">{c.email}</span>
                <span className="col-span-1 text-sm text-zinc-500 truncate">{c.company ?? "—"}</span>
                <span className="col-span-1 text-sm text-zinc-500 truncate">{c.profesion ?? "—"}</span>
                <span className="col-span-1 text-sm text-zinc-500 truncate">{c.localidad ?? "—"}</span>
                <span className="col-span-1">
                  {c.objetivo ? (
                    <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${
                      c.objetivo === "pagina-web" ? "bg-purple-100 text-purple-700" :
                      c.objetivo === "servicios-informaticos" ? "bg-blue-100 text-blue-700" :
                      "bg-zinc-100 text-zinc-600"
                    }`}>
                      {c.objetivo === "pagina-web" ? "🌐 Web" : c.objetivo === "servicios-informaticos" ? "💻 IT" : "📋 Otro"}
                    </span>
                  ) : <span className="text-zinc-300 text-xs">—</span>}
                </span>
                <span className="col-span-1">
                  <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${statusStyles[c.status]}`}>
                    {c.status}
                  </span>
                  {c.unsubscribed && (
                    <span className="inline-block ml-1 text-xs font-medium px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
                      Baja
                    </span>
                  )}
                </span>
                <span className="col-span-2 text-sm text-zinc-500 truncate">
                  {c.website ? (
                    <a href={c.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline truncate block">
                      {c.website.replace(/^https?:\/\//, "")}
                    </a>
                  ) : "—"}
                </span>
                <span className="col-span-1 flex justify-end gap-2">
                  <Link
                    href={`/dashboard/contactos/${c._id}/editar`}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    <Pencil size={15} />
                  </Link>
                  <button
                    onClick={() => handleArchive(c._id, !c.archived)}
                    title={c.archived ? "Desarchivar" : "Archivar"}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                  >
                    {c.archived ? <ArchiveRestore size={15} /> : <Archive size={15} />}
                  </button>
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

      {/* Paginación */}
      {pages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-zinc-500">
            Página {page} de {pages} · {total} contacto{total !== 1 ? "s" : ""}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(1)}
              disabled={page === 1}
              className="px-2.5 py-1.5 text-xs rounded-lg border border-zinc-300 text-zinc-600 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              «
            </button>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 text-xs rounded-lg border border-zinc-300 text-zinc-600 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Anterior
            </button>
            {Array.from({ length: Math.min(5, pages) }, (_, i) => {
              const start = Math.max(1, Math.min(page - 2, pages - 4));
              const p = start + i;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                    p === page
                      ? "bg-blue-600 text-white border-blue-600 font-semibold"
                      : "border-zinc-300 text-zinc-600 hover:bg-zinc-50"
                  }`}
                >
                  {p}
                </button>
              );
            })}
            <button
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              disabled={page === pages}
              className="px-3 py-1.5 text-xs rounded-lg border border-zinc-300 text-zinc-600 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Siguiente
            </button>
            <button
              onClick={() => setPage(pages)}
              disabled={page === pages}
              className="px-2.5 py-1.5 text-xs rounded-lg border border-zinc-300 text-zinc-600 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              »
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
