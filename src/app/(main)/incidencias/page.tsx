"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Search, Loader2, Trash2, Pencil, Clock } from "lucide-react";

const ESTADO_STYLES: Record<string, string> = {
  abierta: "bg-red-100 text-red-700",
  "en-progreso": "bg-amber-100 text-amber-700",
  resuelta: "bg-green-100 text-green-700",
  cerrada: "bg-zinc-100 text-zinc-600",
};

const PRIORIDAD_STYLES: Record<string, string> = {
  baja: "bg-zinc-100 text-zinc-600",
  media: "bg-blue-100 text-blue-700",
  alta: "bg-amber-100 text-amber-700",
  critica: "bg-red-100 text-red-700",
};

export default function IncidenciasPage() {
  const router = useRouter();
  const [incidencias, setIncidencias] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [estado, setEstado] = useState("");
  const [prioridad, setPrioridad] = useState("");
  const [loading, setLoading] = useState(true);
  const [eliminando, setEliminando] = useState<string | null>(null);

  const fetchIncidencias = useCallback(async (q: string, p: number, est: string, pri: string) => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(p), limit: "20" });
    if (q) params.set("q", q);
    if (est) params.set("estado", est);
    if (pri) params.set("prioridad", pri);
    const res = await fetch(`/api/incidencias?${params.toString()}`);
    const data = await res.json();
    setIncidencias(data.incidencias ?? []);
    setTotal(data.total ?? 0);
    setPages(data.pages ?? 1);
    setLoading(false);
  }, []);

  useEffect(() => { setPage(1); }, [q, estado, prioridad]);

  useEffect(() => {
    const t = setTimeout(() => fetchIncidencias(q, page, estado, prioridad), 300);
    return () => clearTimeout(t);
  }, [q, page, estado, prioridad, fetchIncidencias]);

  async function handleEstadoRapido(id: string, nuevoEstado: string) {
    await fetch(`/api/incidencias?id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado: nuevoEstado }),
    });
    fetchIncidencias(q, page, estado, prioridad);
  }

  async function handleDelete(id: string, titulo: string) {
    if (!confirm(`¿Eliminar "${titulo}"?`)) return;
    setEliminando(id);
    await fetch(`/api/incidencias?id=${id}`, { method: "DELETE" });
    setEliminando(null);
    fetchIncidencias(q, page, estado, prioridad);
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">Incidencias</h2>
          <p className="text-zinc-500 mt-1">{total} incidencia{total !== 1 ? "s" : ""} en total</p>
        </div>
        <Link
          href="/incidencias/nueva"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus size={16} />
          Nueva incidencia
        </Link>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Buscar por título o descripción..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-72 pl-10 pr-4 py-2.5 text-sm border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
        <select
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
          className="py-2.5 px-3 text-sm border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-zinc-700"
        >
          <option value="">Todos los estados</option>
          <option value="abierta">Abierta</option>
          <option value="en-progreso">En progreso</option>
          <option value="resuelta">Resuelta</option>
          <option value="cerrada">Cerrada</option>
        </select>
        <select
          value={prioridad}
          onChange={(e) => setPrioridad(e.target.value)}
          className="py-2.5 px-3 text-sm border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-zinc-700"
        >
          <option value="">Todas las prioridades</option>
          <option value="baja">Baja</option>
          <option value="media">Media</option>
          <option value="alta">Alta</option>
          <option value="critica">Crítica</option>
        </select>
        {(estado || prioridad) && (
          <button
            onClick={() => { setEstado(""); setPrioridad(""); }}
            className="text-xs text-zinc-500 hover:text-zinc-800 px-2 py-1 rounded-lg border border-zinc-200 hover:bg-zinc-50 transition-colors"
          >
            ✕ Limpiar filtros
          </button>
        )}
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-zinc-100 text-xs font-semibold text-zinc-500 uppercase tracking-wide">
          <span className="col-span-4">Título</span>
          <span className="col-span-2">Cliente</span>
          <span className="col-span-1">Estado</span>
          <span className="col-span-1">Prioridad</span>
          <span className="col-span-1 text-center">Horas</span>
          <span className="col-span-2">Fecha</span>
          <span className="col-span-1 text-right">Acciones</span>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 size={24} className="animate-spin text-zinc-400" />
          </div>
        ) : incidencias.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-sm font-medium text-zinc-700">Sin incidencias</p>
            <p className="text-sm text-zinc-400 mt-1">
              {q || estado || prioridad ? "No hay resultados para los filtros aplicados." : "No hay incidencias registradas."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {incidencias.map((inc) => {
              const id = String(inc._id);
              const titulo = inc.titulo || inc.asunto || "Sin título";
              const cliente = inc.clienteId;
              return (
                <div key={id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-zinc-50 transition-colors">
                  <div className="col-span-4 min-w-0">
                    <p className="text-sm font-medium text-zinc-900 truncate">{titulo}</p>
                    {inc.descripcion && (
                      <p className="text-xs text-zinc-400 truncate mt-0.5">{inc.descripcion}</p>
                    )}
                  </div>
                  <div className="col-span-2 min-w-0">
                    {cliente ? (
                      <button
                        onClick={() => router.push(`/clientes/${typeof cliente === "object" ? cliente._id : cliente}`)}
                        className="text-sm text-blue-600 hover:underline truncate block text-left"
                      >
                        {typeof cliente === "object" ? (cliente.nombre ?? cliente.empresa) : "—"}
                      </button>
                    ) : inc.emailContacto ? (
                      <span className="text-sm text-zinc-500 truncate block">{inc.emailContacto}</span>
                    ) : (
                      <span className="text-sm text-zinc-300">—</span>
                    )}
                  </div>
                  <div className="col-span-1">
                    <select
                      value={inc.estado}
                      onChange={(e) => handleEstadoRapido(id, e.target.value)}
                      className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${ESTADO_STYLES[inc.estado] ?? "bg-zinc-100 text-zinc-600"}`}
                    >
                      <option value="abierta">Abierta</option>
                      <option value="en-progreso">En progreso</option>
                      <option value="resuelta">Resuelta</option>
                      <option value="cerrada">Cerrada</option>
                    </select>
                  </div>
                  <div className="col-span-1">
                    <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${PRIORIDAD_STYLES[inc.prioridad] ?? "bg-zinc-100 text-zinc-600"}`}>
                      {inc.prioridad ?? "—"}
                    </span>
                  </div>
                  <div className="col-span-1 text-center">
                    {(inc.horasConsumidas ?? 0) > 0 ? (
                      <span className="flex items-center justify-center gap-1 text-xs text-zinc-600">
                        <Clock size={11} />
                        {inc.horasConsumidas}h
                      </span>
                    ) : (
                      <span className="text-zinc-300 text-xs">—</span>
                    )}
                  </div>
                  <div className="col-span-2">
                    <span className="text-sm text-zinc-500">
                      {new Date(inc.fechaApertura ?? inc.createdAt).toLocaleDateString("es-ES")}
                    </span>
                  </div>
                  <div className="col-span-1 flex justify-end gap-1">
                    <button
                      onClick={() => router.push(`/incidencias/${id}/editar`)}
                      title="Editar"
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(id, titulo)}
                      disabled={eliminando === id}
                      title="Eliminar"
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      {eliminando === id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Paginación */}
      {pages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-zinc-500">
            Página {page} de {pages} · {total} incidencia{total !== 1 ? "s" : ""}
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(1)} disabled={page === 1}
              className="px-2.5 py-1.5 text-xs rounded-lg border border-zinc-300 text-zinc-600 hover:bg-zinc-50 disabled:opacity-40 transition-colors">«</button>
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              className="px-3 py-1.5 text-xs rounded-lg border border-zinc-300 text-zinc-600 hover:bg-zinc-50 disabled:opacity-40 transition-colors">Anterior</button>
            {Array.from({ length: Math.min(5, pages) }, (_, i) => {
              const start = Math.max(1, Math.min(page - 2, pages - 4));
              const p = start + i;
              return (
                <button key={p} onClick={() => setPage(p)}
                  className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${p === page ? "bg-blue-600 text-white border-blue-600 font-semibold" : "border-zinc-300 text-zinc-600 hover:bg-zinc-50"}`}>
                  {p}
                </button>
              );
            })}
            <button onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages}
              className="px-3 py-1.5 text-xs rounded-lg border border-zinc-300 text-zinc-600 hover:bg-zinc-50 disabled:opacity-40 transition-colors">Siguiente</button>
            <button onClick={() => setPage(pages)} disabled={page === pages}
              className="px-2.5 py-1.5 text-xs rounded-lg border border-zinc-300 text-zinc-600 hover:bg-zinc-50 disabled:opacity-40 transition-colors">»</button>
          </div>
        </div>
      )}
    </div>
  );
}
