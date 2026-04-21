"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Plus, Loader2, Pencil, Trash2, Download, Eye } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ClientesPage() {
  const [clientes, setClientes] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [estado, setEstado] = useState("");
  const [loading, setLoading] = useState(true);
  const [eliminando, setEliminando] = useState<string | null>(null);
  const router = useRouter();

  const fetchClientes = useCallback(async (q: string, p: number, est: string) => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(p), limit: "10" });
    if (q) params.set("q", q);
    if (est) params.set("estado", est);
    const res = await fetch(`/api/clientes?${params.toString()}`);
    const data = await res.json();
    setClientes(data.clientes ?? []);
    setTotal(data.total ?? 0);
    setPages(data.pages ?? 1);
    setLoading(false);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [query, estado]);

  useEffect(() => {
    const t = setTimeout(() => fetchClientes(query, page, estado), 300);
    return () => clearTimeout(t);
  }, [query, page, estado, fetchClientes]);

  async function handleDelete(id: string, nombre: string) {
    if (!confirm(`¿Eliminar cliente ${nombre}?`)) return;
    setEliminando(id);
    await fetch(`/api/clientes?id=${id}`, { method: "DELETE" });
    setEliminando(null);
    fetchClientes(query, page, estado);
  }

  function handleExport() {
    window.open("/api/clientes/export", "_blank");
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">Clientes</h2>
          <p className="text-zinc-500 mt-1">
            {total} cliente{total !== 1 ? "s" : ""} en total
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 text-zinc-700 hover:text-zinc-900 text-sm font-medium px-4 py-2.5 rounded-lg border border-zinc-300 hover:bg-zinc-50 transition-colors"
          >
            <Download size={15} />
            Exportar CSV
          </button>
          <Link
            href="/clientes/nuevo"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
          >
            <Plus size={16} />
            Nuevo cliente
          </Link>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre o email..."
            className="w-80 pl-10 pr-4 py-2.5 text-sm border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
        <select
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
          className="py-2.5 px-3 text-sm border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-zinc-700"
        >
          <option value="">Todos los estados</option>
          <option value="activo">Activo</option>
          <option value="potencial">Potencial</option>
          <option value="inactivo">Inactivo</option>
        </select>
        {estado && (
          <button
            onClick={() => setEstado("")}
            className="text-xs text-zinc-500 hover:text-zinc-800 px-2 py-1 rounded-lg border border-zinc-200 hover:bg-zinc-50 transition-colors"
          >
            ✕ Limpiar filtro
          </button>
        )}
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-zinc-100 text-xs font-semibold text-zinc-500 uppercase tracking-wide">
          <span className="col-span-3">Nombre</span>
          <span className="col-span-3">Email</span>
          <span className="col-span-2">Empresa</span>
          <span className="col-span-2">Estado</span>
          <span className="col-span-1">Servicios</span>
          <span className="col-span-1 text-right">Acciones</span>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 size={24} className="animate-spin text-zinc-400" />
          </div>
        ) : clientes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-sm font-medium text-zinc-700">Sin clientes</p>
            <p className="text-sm text-zinc-400 mt-1">
              {query ? "No hay resultados para tu búsqueda." : "Añade tu primer cliente."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {clientes.map((c) => (
              <div key={c._id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-zinc-50 transition-colors">
                <span className="col-span-3 text-sm font-medium text-zinc-900 truncate">{c.nombre}</span>
                <span className="col-span-3 text-sm text-zinc-500 truncate">{c.email}</span>
                <span className="col-span-2 text-sm text-zinc-500 truncate">{c.empresa || "—"}</span>
                <span className="col-span-2">
                  <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${
                    c.estado === "activo"
                      ? "bg-green-100 text-green-700"
                      : c.estado === "potencial"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-zinc-100 text-zinc-600"
                  }`}>
                    {c.estado}
                  </span>
                </span>
                <span className="col-span-1 text-sm text-zinc-500">
                  {c.serviciosContratados?.length > 0
                    ? `${c.serviciosContratados.length} servicio${c.serviciosContratados.length !== 1 ? "s" : ""}`
                    : <span className="text-zinc-300">—</span>}
                </span>
                <span className="col-span-1 flex justify-end gap-1">
                  <button
                    onClick={() => router.push(`/clientes/${c._id}`)}
                    title="Ver detalle"
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
                  >
                    <Eye size={15} />
                  </button>
                  <button
                    onClick={() => router.push(`/clientes/${c._id}/editar`)}
                    title="Editar"
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(c._id, c.nombre)}
                    disabled={eliminando === c._id}
                    title="Eliminar"
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    {eliminando === c._id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
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
            Página {page} de {pages} · {total} cliente{total !== 1 ? "s" : ""}
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
