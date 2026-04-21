"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Receipt,
  Plus,
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  Trash2,
  Pencil,
} from "lucide-react";

interface Cliente {
  _id: string;
  nombre: string;
  empresa?: string;
}

interface Factura {
  _id: string;
  numero: string;
  importe: number;
  estado: "pendiente" | "pagada" | "vencida" | "cancelada";
  fechaEmision: string;
  fechaVencimiento: string;
  notas?: string;
  clienteId?: Cliente;
}

interface Resumen {
  importePendiente: number;
  importeVencido: number;
}

const ESTADOS = ["", "pendiente", "pagada", "vencida", "cancelada"];

const estadoConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pendiente: { label: "Pendiente", color: "bg-amber-100 text-amber-700", icon: <Clock size={12} /> },
  pagada: { label: "Pagada", color: "bg-green-100 text-green-700", icon: <CheckCircle2 size={12} /> },
  vencida: { label: "Vencida", color: "bg-red-100 text-red-700", icon: <AlertTriangle size={12} /> },
  cancelada: { label: "Cancelada", color: "bg-zinc-100 text-zinc-500", icon: <XCircle size={12} /> },
};

function fmt(n: number) {
  return n.toLocaleString("es-ES", { style: "currency", currency: "EUR" });
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
}

export default function FacturacionPage() {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [resumen, setResumen] = useState<Resumen>({ importePendiente: 0, importeVencido: 0 });
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [estado, setEstado] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchFacturas = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "15" });
    if (search) params.set("q", search);
    if (estado) params.set("estado", estado);
    const res = await fetch(`/api/facturas?${params}`);
    const data = await res.json();
    setFacturas(data.facturas ?? []);
    setTotal(data.total ?? 0);
    setPages(data.pages ?? 1);
    setResumen(data.resumen ?? { importePendiente: 0, importeVencido: 0 });
    setLoading(false);
  }, [page, search, estado]);

  useEffect(() => { fetchFacturas(); }, [fetchFacturas]);

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [search, estado]);

  async function handleDelete(id: string, numero: string) {
    if (!confirm(`¿Eliminar factura ${numero}? Esta acción no se puede deshacer.`)) return;
    setDeleting(id);
    await fetch(`/api/facturas?id=${id}`, { method: "DELETE" });
    setDeleting(null);
    fetchFacturas();
  }

  async function handleEstadoChange(id: string, nuevoEstado: string) {
    await fetch(`/api/facturas?id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado: nuevoEstado }),
    });
    fetchFacturas();
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">Facturación</h2>
          <p className="text-zinc-500 mt-1">{total} factura{total !== 1 ? "s" : ""} en total</p>
        </div>
        <Link
          href="/facturacion/nueva"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus size={16} />
          Nueva factura
        </Link>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 border border-zinc-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
            <Clock size={20} className="text-amber-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-zinc-900">{fmt(resumen.importePendiente)}</p>
            <p className="text-sm text-zinc-500 mt-0.5">Pendiente de cobro</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-zinc-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={20} className="text-red-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-zinc-900">{fmt(resumen.importeVencido)}</p>
            <p className="text-sm text-zinc-500 mt-0.5">Importe vencido</p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-100 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Buscar por número o notas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            className="text-sm border border-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            {ESTADOS.map((e) => (
              <option key={e} value={e}>{e ? estadoConfig[e]?.label : "Todos los estados"}</option>
            ))}
          </select>
          {(search || estado) && (
            <button
              onClick={() => { setSearch(""); setEstado(""); }}
              className="text-sm text-zinc-500 hover:text-zinc-800 px-3 py-2 rounded-lg hover:bg-zinc-100 transition-colors"
            >
              Limpiar
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 size={24} className="animate-spin text-zinc-400" />
          </div>
        ) : facturas.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center">
            <Receipt size={32} className="text-zinc-200 mb-3" />
            <p className="text-zinc-500 text-sm">No hay facturas que coincidan.</p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-zinc-100">
              {facturas.map((f) => {
                const cfg = estadoConfig[f.estado];
                const vencida = f.estado === "vencida";
                return (
                  <div key={f._id} className="flex items-center gap-4 px-5 py-4 hover:bg-zinc-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-zinc-900">{f.numero}</span>
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${cfg?.color}`}>
                          {cfg?.icon}
                          {cfg?.label}
                        </span>
                        {vencida && (
                          <span className="text-xs text-red-500 font-medium">Venció {fmtDate(f.fechaVencimiento)}</span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {f.clienteId?.empresa ?? f.clienteId?.nombre ?? "—"}
                        {!vencida && <span> · vence {fmtDate(f.fechaVencimiento)}</span>}
                        <span> · emitida {fmtDate(f.fechaEmision)}</span>
                      </p>
                    </div>

                    <p className="text-sm font-bold text-zinc-900 shrink-0">{fmt(f.importe)}</p>

                    {/* Cambio rápido de estado */}
                    <select
                      value={f.estado}
                      onChange={(e) => handleEstadoChange(f._id, e.target.value)}
                      className="text-xs border border-zinc-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shrink-0"
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="pagada">Pagada</option>
                      <option value="vencida">Vencida</option>
                      <option value="cancelada">Cancelada</option>
                    </select>

                    <div className="flex items-center gap-1 shrink-0">
                      <Link
                        href={`/facturacion/${f._id}/editar`}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        <Pencil size={15} />
                      </Link>
                      <button
                        onClick={() => handleDelete(f._id, f.numero)}
                        disabled={deleting === f._id}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        {deleting === f._id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Paginación */}
            {pages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-zinc-100 bg-zinc-50">
                <p className="text-xs text-zinc-500">Página {page} de {pages}</p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage(1)}
                    disabled={page === 1}
                    className="p-1.5 rounded text-zinc-500 hover:bg-zinc-200 disabled:opacity-40 text-xs font-medium"
                  >
                    «
                  </button>
                  <button
                    onClick={() => setPage((p) => p - 1)}
                    disabled={page === 1}
                    className="p-1.5 rounded text-zinc-500 hover:bg-zinc-200 disabled:opacity-40"
                  >
                    <ChevronLeft size={15} />
                  </button>
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page === pages}
                    className="p-1.5 rounded text-zinc-500 hover:bg-zinc-200 disabled:opacity-40"
                  >
                    <ChevronRight size={15} />
                  </button>
                  <button
                    onClick={() => setPage(pages)}
                    disabled={page === pages}
                    className="p-1.5 rounded text-zinc-500 hover:bg-zinc-200 disabled:opacity-40 text-xs font-medium"
                  >
                    »
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
