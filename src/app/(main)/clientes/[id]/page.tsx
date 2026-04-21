"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Pencil, Clock, Ticket, AlertCircle, Loader2, Plus, Mail, CheckCircle2 } from "lucide-react";

const MESES_ES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

const PRIORIDAD_STYLES: Record<string, string> = {
  baja: "bg-zinc-100 text-zinc-600",
  media: "bg-blue-100 text-blue-700",
  alta: "bg-amber-100 text-amber-700",
  critica: "bg-red-100 text-red-700",
};

const ESTADO_STYLES: Record<string, string> = {
  abierta: "bg-red-100 text-red-700",
  "en-progreso": "bg-amber-100 text-amber-700",
  resuelta: "bg-green-100 text-green-700",
  cerrada: "bg-zinc-100 text-zinc-600",
};

export default function ClienteDetallePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [cliente, setCliente] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [todosTickets, setTodosTickets] = useState<any[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [tabTickets, setTabTickets] = useState<"activos" | "todos">("activos");
  const [loading, setLoading] = useState(true);
  const [modalExtracto, setModalExtracto] = useState(false);
  const [mesSeleccionado, setMesSeleccionado] = useState<string>("");
  const [enviandoExtracto, setEnviandoExtracto] = useState(false);
  const [extractoEnviado, setExtractoEnviado] = useState(false);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      fetch(`/api/clientes?id=${id}`).then((r) => r.json()),
      fetch(`/api/clientes/${id}/stats`).then((r) => r.json()),
    ]).then(([clienteData, statsData]) => {
      setCliente(clienteData.cliente);
      setStats(statsData);
      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
    if (tabTickets !== "todos" || !id) return;
    setLoadingTickets(true);
    fetch(`/api/incidencias?clienteId=${id}&limit=50`)
      .then((r) => r.json())
      .then((d) => { setTodosTickets(d.incidencias ?? []); setLoadingTickets(false); });
  }, [tabTickets, id]);

  if (loading) return (
    <div className="flex justify-center items-center py-32">
      <Loader2 size={24} className="animate-spin text-zinc-400" />
    </div>
  );
  if (!cliente) return <div className="p-8 text-red-600">Cliente no encontrado</div>;

  const mesesEntries = stats?.meses ? Object.entries(stats.meses) : [];
  const totalHoras = mesesEntries.reduce((sum, [, m]: any) => sum + m.horas, 0);
  const ticketsActivos: any[] = stats?.ticketsActivos ?? [];

  function abrirModalExtracto() {
    const now = new Date();
    const defaultKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const firstKey = mesesEntries[0]?.[0] as string | undefined;
    setMesSeleccionado(firstKey ?? defaultKey);
    setExtractoEnviado(false);
    setModalExtracto(true);
  }

  async function handleEnviarExtracto() {
    if (!mesSeleccionado) return;
    setEnviandoExtracto(true);
    try {
      const res = await fetch(`/api/clientes/${id}/extracto`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mes: mesSeleccionado }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        alert(d.error ?? "Error al enviar el extracto");
      } else {
        setExtractoEnviado(true);
        setTimeout(() => { setExtractoEnviado(false); setModalExtracto(false); }, 2500);
      }
    } finally {
      setEnviandoExtracto(false);
    }
  }

  const MESES_ES_FULL = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

  function labelMes(key: string) {
    const [year, month] = key.split("-");
    return `${MESES_ES_FULL[parseInt(month) - 1]} ${year}`;
  }

  return (
    <div className="p-8 max-w-5xl">
      {/* Cabecera */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-start gap-4">
          <button
            onClick={() => router.push("/clientes")}
            className="mt-1 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-zinc-900">{cliente.nombre}</h2>
            <p className="text-zinc-500 mt-0.5">
              {cliente.empresa && <span>{cliente.empresa} · </span>}
              {cliente.email}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={abrirModalExtracto}
            disabled={!cliente.email}
            title={!cliente.email ? "El cliente no tiene email registrado" : "Enviar extracto mensual por email"}
            className="flex items-center gap-2 text-zinc-700 hover:text-zinc-900 text-sm font-medium px-4 py-2.5 rounded-lg border border-zinc-300 hover:bg-zinc-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Mail size={15} />
            Enviar extracto
          </button>
          <Link
            href={`/incidencias/nueva?clienteId=${id}`}
            className="flex items-center gap-2 text-zinc-700 hover:text-zinc-900 text-sm font-medium px-4 py-2.5 rounded-lg border border-zinc-300 hover:bg-zinc-50 transition-colors"
          >
            <Plus size={15} />
            Nueva incidencia
          </Link>
          <Link
            href={`/clientes/${id}/editar`}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
          >
            <Pencil size={15} />
            Editar cliente
          </Link>
        </div>
      </div>

      {/* KPIs rápidos */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm px-6 py-5">
          <div className="flex items-center gap-2 text-zinc-500 text-sm mb-1">
            <Ticket size={15} />
            Tickets activos
          </div>
          <p className="text-3xl font-bold text-zinc-900">{ticketsActivos.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm px-6 py-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-zinc-500 text-sm">
              <Clock size={15} />
              Horas por mes
            </div>
            <span className="text-xs font-semibold text-zinc-700">{totalHoras}h total</span>
          </div>
          <div className="space-y-1.5">
            {mesesEntries.map(([key, m]: any) => {
              const [year, month] = key.split("-");
              const label = `${MESES_ES[parseInt(month) - 1]} ${year.slice(2)}`;
              const maxH = Math.max(...mesesEntries.map(([, x]: any) => x.horas), 1);
              const pct = Math.round((m.horas / maxH) * 100);
              return (
                <div key={key} className="flex items-center gap-2">
                  <span className="text-xs text-zinc-400 w-10 shrink-0">{label}</span>
                  <div className="flex-1 h-2 bg-zinc-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-zinc-700 w-8 text-right shrink-0">
                    {m.horas > 0 ? `${m.horas}h` : "—"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm px-6 py-5">
          <div className="flex items-center gap-2 text-zinc-500 text-sm mb-1">
            <AlertCircle size={15} />
            Estado
          </div>
          <span className={`inline-block text-sm font-semibold px-3 py-1 rounded-full mt-1 ${
            cliente.estado === "activo" ? "bg-green-100 text-green-700" :
            cliente.estado === "potencial" ? "bg-amber-100 text-amber-700" :
            "bg-zinc-100 text-zinc-600"
          }`}>
            {cliente.estado}
          </span>
        </div>
      </div>

      {/* Tabla mensual */}
      <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm mb-8">
        <div className="px-6 py-4 border-b border-zinc-100">
          <h3 className="font-semibold text-zinc-800">Actividad mensual</h3>
          <p className="text-sm text-zinc-400 mt-0.5">Últimos 6 meses</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                <th className="px-6 py-3 text-left">Mes</th>
                <th className="px-4 py-3 text-center">Abiertas</th>
                <th className="px-4 py-3 text-center">En progreso</th>
                <th className="px-4 py-3 text-center">Resueltas</th>
                <th className="px-4 py-3 text-center">Cerradas</th>
                <th className="px-6 py-3 text-right">Horas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {mesesEntries.map(([key, m]: any) => {
                const [year, month] = key.split("-");
                const label = `${MESES_ES[parseInt(month) - 1]} ${year}`;
                const total = m.abiertas + m.enProgreso + m.resueltas + m.cerradas;
                return (
                  <tr key={key} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-6 py-3 font-medium text-zinc-800">{label}</td>
                    <td className="px-4 py-3 text-center">
                      {m.abiertas > 0 ? (
                        <span className="inline-block bg-red-100 text-red-700 text-xs font-medium px-2 py-0.5 rounded-full">{m.abiertas}</span>
                      ) : <span className="text-zinc-300">—</span>}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {m.enProgreso > 0 ? (
                        <span className="inline-block bg-amber-100 text-amber-700 text-xs font-medium px-2 py-0.5 rounded-full">{m.enProgreso}</span>
                      ) : <span className="text-zinc-300">—</span>}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {m.resueltas > 0 ? (
                        <span className="inline-block bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full">{m.resueltas}</span>
                      ) : <span className="text-zinc-300">—</span>}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {m.cerradas > 0 ? (
                        <span className="inline-block bg-zinc-100 text-zinc-600 text-xs font-medium px-2 py-0.5 rounded-full">{m.cerradas}</span>
                      ) : <span className="text-zinc-300">—</span>}
                    </td>
                    <td className="px-6 py-3 text-right font-semibold text-zinc-700">
                      {m.horas > 0 ? `${m.horas}h` : <span className="text-zinc-300 font-normal">—</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tickets */}
      <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm">
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-zinc-800">Tickets</h3>
            <p className="text-sm text-zinc-400 mt-0.5">
              {tabTickets === "activos"
                ? `${ticketsActivos.length} activo${ticketsActivos.length !== 1 ? "s" : ""}`
                : `${todosTickets.length} en total`}
            </p>
          </div>
          <div className="flex items-center gap-1 bg-zinc-100 rounded-lg p-1">
            <button
              onClick={() => setTabTickets("activos")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                tabTickets === "activos" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
              }`}
            >
              <Ticket size={13} />
              Activos
            </button>
            <button
              onClick={() => setTabTickets("todos")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                tabTickets === "todos" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
              }`}
            >
              <Clock size={13} />
              Historial
            </button>
          </div>
        </div>

        {tabTickets === "activos" ? (
          ticketsActivos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-sm font-medium text-zinc-700">Sin tickets activos</p>
              <p className="text-sm text-zinc-400 mt-1">Este cliente no tiene incidencias abiertas.</p>
            </div>
          ) : (
            <TicketList tickets={ticketsActivos} />
          )
        ) : loadingTickets ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 size={20} className="animate-spin text-zinc-400" />
          </div>
        ) : todosTickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-sm font-medium text-zinc-700">Sin tickets</p>
            <p className="text-sm text-zinc-400 mt-1">Este cliente no tiene incidencias registradas.</p>
          </div>
        ) : (
          <TicketList tickets={todosTickets} />
        )}
      </div>

      {/* Modal extracto mensual */}
      {modalExtracto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => !enviandoExtracto && setModalExtracto(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
            <h3 className="text-base font-semibold text-zinc-900 mb-1">Enviar extracto de actividad</h3>
            <p className="text-sm text-zinc-500 mb-5">
              Selecciona el mes que quieres enviar a <strong>{cliente.email}</strong>.
            </p>

            <div className="space-y-2 mb-6">
              {mesesEntries.map(([key, m]: any) => {
                const totalTickets = m.abiertas + m.enProgreso + m.resueltas + m.cerradas;
                const selected = mesSeleccionado === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setMesSeleccionado(key)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 text-left transition-colors ${
                      selected
                        ? "border-blue-500 bg-blue-50"
                        : "border-zinc-200 hover:border-zinc-300 bg-white"
                    }`}
                  >
                    <span className={`text-sm font-medium ${selected ? "text-blue-700" : "text-zinc-800"}`}>
                      {labelMes(key)}
                    </span>
                    <span className="text-xs text-zinc-500 flex items-center gap-3">
                      <span>{totalTickets} ticket{totalTickets !== 1 ? "s" : ""}</span>
                      <span className="font-semibold text-zinc-700">{m.horas > 0 ? `${m.horas}h` : "0h"}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            {extractoEnviado ? (
              <div className="flex items-center justify-center gap-2 py-2 text-green-600 font-medium text-sm">
                <CheckCircle2 size={18} />
                Extracto enviado correctamente
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleEnviarExtracto}
                  disabled={enviandoExtracto || !mesSeleccionado}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
                >
                  {enviandoExtracto ? <Loader2 size={15} className="animate-spin" /> : <Mail size={15} />}
                  {enviandoExtracto ? "Enviando..." : "Enviar"}
                </button>
                <button
                  type="button"
                  onClick={() => setModalExtracto(false)}
                  disabled={enviandoExtracto}
                  className="px-4 py-2.5 text-sm text-zinc-600 hover:text-zinc-900 border border-zinc-300 rounded-lg hover:bg-zinc-50 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function TicketList({ tickets }: { tickets: any[] }) {
  return (
    <div className="divide-y divide-zinc-100">
      {tickets.map((t: any) => (
        <div key={t._id} className="flex items-center justify-between px-6 py-4 hover:bg-zinc-50 transition-colors">
          <div className="min-w-0">
            <p className="text-sm font-medium text-zinc-900 truncate">{t.titulo}</p>
            {t.descripcion && (
              <p className="text-xs text-zinc-400 truncate mt-0.5">{t.descripcion}</p>
            )}
            <p className="text-xs text-zinc-400 mt-1">
              {new Date(t.fechaApertura).toLocaleDateString("es-ES")}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-4">
            {t.horasConsumidas > 0 && (
              <span className="flex items-center gap-1 text-xs text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full">
                <Clock size={11} />
                {t.horasConsumidas}h
              </span>
            )}
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${PRIORIDAD_STYLES[t.prioridad]}`}>
              {t.prioridad}
            </span>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${ESTADO_STYLES[t.estado]}`}>
              {t.estado}
            </span>
            <Link
              href={`/incidencias/${t._id}/editar`}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <Pencil size={14} />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
