"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  Receipt,
  AlertCircle,
  Users,
  TrendingUp,
  Clock,
  CheckCircle2,
  Loader2,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

interface Stats {
  totalClientes: number;
  clientesActivos: number;
  facturacionMes: number;
  facturasPendientes: number;
  importePendiente: number;
  incidenciasAbiertas: number;
  incidenciasCriticas: number;
}

interface Incidencia {
  _id: string;
  titulo: string;
  estado: string;
  prioridad: string;
  fechaApertura: string;
  clienteId?: { nombre: string; empresa?: string };
}

interface Factura {
  _id: string;
  numero: string;
  importe: number;
  estado: string;
  fechaVencimiento: string;
  clienteId?: { nombre: string; empresa?: string };
}

const prioridadColors: Record<string, string> = {
  baja: "bg-zinc-700 text-zinc-300",
  media: "bg-blue-900/60 text-blue-300",
  alta: "bg-amber-900/60 text-amber-300",
  critica: "bg-red-900/60 text-red-300",
};

const estadoIncidenciaColors: Record<string, string> = {
  abierta: "bg-red-900/50 text-red-300",
  "en-progreso": "bg-amber-900/50 text-amber-300",
  resuelta: "bg-green-900/50 text-green-300",
  cerrada: "bg-zinc-700 text-zinc-400",
};

const estadoFacturaColors: Record<string, string> = {
  pendiente: "bg-amber-900/50 text-amber-300",
  pagada: "bg-green-900/50 text-green-300",
  vencida: "bg-red-900/50 text-red-300",
  cancelada: "bg-zinc-700 text-zinc-400",
};

function fmt(n: number) {
  return n.toLocaleString("es-ES", { style: "currency", currency: "EUR" });
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function ClientesDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [incidencias, setIncidencias] = useState<Incidencia[]>([]);
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/gestion/stats")
      .then((r) => r.json())
      .then((data) => {
        setStats(data.stats);
        setIncidencias(data.ultimasIncidencias ?? []);
        setFacturas(data.ultimasFacturas ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-zinc-500" size={32} />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900">Dashboard</h2>
        <p className="text-zinc-500 mt-1">Resumen de gestión de clientes</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <StatCard
          icon={<Users size={20} />}
          label="Clientes activos"
          value={String(stats?.clientesActivos ?? 0)}
          sub={`${stats?.totalClientes ?? 0} total`}
          color="bg-blue-50 text-blue-600"
        />
        <StatCard
          icon={<TrendingUp size={20} />}
          label="Facturación este mes"
          value={fmt(stats?.facturacionMes ?? 0)}
          sub="facturas emitidas"
          color="bg-green-50 text-green-600"
        />
        <StatCard
          icon={<Receipt size={20} />}
          label="Pendiente de cobro"
          value={fmt(stats?.importePendiente ?? 0)}
          sub={`${stats?.facturasPendientes ?? 0} facturas`}
          color="bg-amber-50 text-amber-600"
        />
        <StatCard
          icon={<AlertCircle size={20} />}
          label="Incidencias abiertas"
          value={String(stats?.incidenciasAbiertas ?? 0)}
          sub={
            (stats?.incidenciasCriticas ?? 0) > 0
              ? `${stats!.incidenciasCriticas} críticas`
              : "Sin incidencias críticas"
          }
          color={(stats?.incidenciasCriticas ?? 0) > 0 ? "bg-red-50 text-red-600" : "bg-zinc-50 text-zinc-500"}
        />
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {/* Incidencias recientes */}
        <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
            <div className="flex items-center gap-2 text-zinc-900 font-semibold">
              <AlertCircle size={16} className="text-amber-500" />
              Incidencias abiertas
            </div>
            <Link
              href="/incidencias"
              className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              Ver todas <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-zinc-100">
            {incidencias.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <CheckCircle2 size={28} className="text-green-500 mx-auto mb-2" />
                <p className="text-zinc-400 text-sm">Sin incidencias abiertas</p>
              </div>
            ) : (
              incidencias.map((inc) => (
                <div key={inc._id} className="px-5 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm text-zinc-900 font-medium truncate">{inc.titulo}</p>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {inc.clienteId?.empresa ?? inc.clienteId?.nombre ?? "—"} · {fmtDate(inc.fechaApertura)}
                      </p>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${prioridadColors[inc.prioridad]}`}>
                        {inc.prioridad}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${estadoIncidenciaColors[inc.estado]}`}>
                        {inc.estado}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Facturas pendientes */}
        <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
            <div className="flex items-center gap-2 text-zinc-900 font-semibold">
              <Receipt size={16} className="text-blue-500" />
              Facturas pendientes
            </div>
            <Link
              href="/facturacion"
              className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              Ver todas <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-zinc-100">
            {facturas.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <CheckCircle2 size={28} className="text-green-500 mx-auto mb-2" />
                <p className="text-zinc-400 text-sm">Sin facturas pendientes</p>
              </div>
            ) : (
              facturas.map((fac) => (
                <div key={fac._id} className="px-5 py-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-zinc-900 font-medium">{fac.numero}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${estadoFacturaColors[fac.estado]}`}>
                          {fac.estado}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {fac.clienteId?.empresa ?? fac.clienteId?.nombre ?? "—"} · vence {fmtDate(fac.fechaVencimiento)}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-zinc-900 shrink-0">{fmt(fac.importe)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100">
        <h3 className="text-base font-semibold text-zinc-900 mb-4">Acciones rápidas</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            href="/clientes"
            className="flex items-center gap-3 p-4 rounded-xl border border-zinc-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
          >
            <Building2 size={18} className="text-blue-600" />
            <span className="text-sm font-medium text-zinc-700 group-hover:text-blue-700">
              Ver clientes
            </span>
          </Link>
          <Link
            href="/facturacion"
            className="flex items-center gap-3 p-4 rounded-xl border border-green-200 hover:border-green-300 hover:bg-green-50 transition-colors group"
          >
            <Receipt size={18} className="text-green-600" />
            <span className="text-sm font-medium text-zinc-700 group-hover:text-green-700">
              Nueva factura
            </span>
          </Link>
          <Link
            href="/incidencias"
            className="flex items-center gap-3 p-4 rounded-xl border border-amber-200 hover:border-amber-300 hover:bg-amber-50 transition-colors group"
          >
            <Clock size={18} className="text-amber-600" />
            <span className="text-sm font-medium text-zinc-700 group-hover:text-amber-700">
              Nueva incidencia
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, sub, color }: { icon: React.ReactNode; label: string; value: string; sub: string; color: string }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${color}`}>{icon}</div>
      <p className="text-3xl font-bold text-zinc-900">{value}</p>
      <p className="text-sm text-zinc-500 mt-1">{label}</p>
      {sub && <p className="text-xs text-zinc-400 mt-1">{sub}</p>}
    </div>
  );
}
