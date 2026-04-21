"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Loader2,
  Clock,
  CheckCircle2,
  Calculator,
  ChevronDown,
  ChevronUp,
  Send,
} from "lucide-react";

// ─── Helpers ───────────────────────────────────────────────────────────────────

const MESES_ES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

function fmt(n: number) {
  return n.toLocaleString("es-ES", { style: "currency", currency: "EUR" });
}

function mesActualKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function labelMes(key: string) {
  const [year, month] = key.split("-");
  return `${MESES_ES[parseInt(month) - 1]} ${year}`;
}

function opcionesMeses() {
  const opts = [];
  const now = new Date();
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    opts.push(key);
  }
  return opts;
}

// ─── Types ─────────────────────────────────────────────────────────────────────

interface ResultadoCalculo {
  clienteId: string;
  nombre: string;
  empresa?: string;
  email?: string;
  serviciosContratados: { nombre: string; precio: number; horasIncluidas: number }[];
  tarifaHoraExtra: number;
  horasTrabajadas: number;
  horasIncluidas: number;
  horasExtra: number;
  importeServicios: number;
  importeExtra: number;
  importeTotal: number;
  conceptos: { descripcion: string; cantidad: number; precioUnitario: number }[];
  incidencias: { titulo: string; horas: number; estado: string }[];
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function FacturacionPage() {
  const [mes, setMes] = useState(mesActualKey());
  const [resultados, setResultados] = useState<ResultadoCalculo[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandido, setExpandido] = useState<string | null>(null);
  const [enviando, setEnviando] = useState<string | null>(null);
  const [enviados, setEnviados] = useState<Record<string, boolean>>({});

  const fetchCalculo = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/facturacion/calcular?mes=${mes}`);
    const data = await res.json();
    setResultados(data.resultados ?? []);
    setLoading(false);
  }, [mes]);

  useEffect(() => { fetchCalculo(); }, [fetchCalculo]);

  async function enviarResumen(r: ResultadoCalculo) {
    setEnviando(r.clienteId);
    const res = await fetch("/api/facturacion/enviar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clienteId: r.clienteId, mes }),
    });
    setEnviando(null);
    if (res.ok) {
      setEnviados((prev) => ({ ...prev, [r.clienteId]: true }));
    } else {
      const data = await res.json();
      alert(data.error ?? "Error al enviar el resumen");
    }
  }

  const totalGeneral = resultados.reduce((sum, r) => sum + r.importeTotal, 0);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-zinc-900">Facturación</h2>
        <div className="flex items-center gap-3">
          <select
            value={mes}
            onChange={(e) => { setMes(e.target.value); setEnviados({}); }}
            className="text-sm border border-zinc-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          >
            {opcionesMeses().map((key) => (
              <option key={key} value={key}>{labelMes(key)}</option>
            ))}
          </select>
          {!loading && resultados.length > 0 && (
            <div className="text-right">
              <p className="text-xs text-zinc-400">Total a facturar</p>
              <p className="text-lg font-bold text-zinc-900">{fmt(totalGeneral)}</p>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-24">
          <Loader2 size={24} className="animate-spin text-zinc-400" />
        </div>
      ) : resultados.length === 0 ? (
        <div className="flex flex-col items-center py-24 text-center bg-white rounded-2xl border border-zinc-100 shadow-sm">
          <Calculator size={32} className="text-zinc-200 mb-3" />
          <p className="text-zinc-500 text-sm">No hay clientes activos.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {resultados.map((r) => {
            const isOpen = expandido === r.clienteId;
            const yaEnviado = enviados[r.clienteId];

            return (
              <div key={r.clienteId} className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
                <div className="flex items-center gap-4 px-5 py-4">
                  <button
                    onClick={() => setExpandido(isOpen ? null : r.clienteId)}
                    className="flex items-center gap-3 flex-1 min-w-0 text-left"
                  >
                    {isOpen ? <ChevronUp size={16} className="text-zinc-400 shrink-0" /> : <ChevronDown size={16} className="text-zinc-400 shrink-0" />}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-zinc-900 truncate">{r.empresa ?? r.nombre}</p>
                      <p className="text-xs text-zinc-400 truncate">{r.empresa ? r.nombre : r.email}</p>
                    </div>
                  </button>

                  <div className="text-center shrink-0 w-36">
                    <p className="text-xs text-zinc-400 mb-0.5">Horas</p>
                    <p className="text-sm font-medium text-zinc-800">
                      {r.horasTrabajadas}h <span className="text-zinc-400 font-normal">/ {r.horasIncluidas}h inc.</span>
                    </p>
                    {r.horasExtra > 0 && <p className="text-xs text-amber-600 font-medium">+{r.horasExtra}h extra</p>}
                  </div>

                  <div className="text-right shrink-0 w-24">
                    <p className="text-xs text-zinc-400 mb-0.5">Servicios</p>
                    <p className="text-sm font-medium text-zinc-700">{fmt(r.importeServicios)}</p>
                  </div>

                  <div className="text-right shrink-0 w-24">
                    <p className="text-xs text-zinc-400 mb-0.5">Extra</p>
                    <p className={`text-sm font-medium ${r.importeExtra > 0 ? "text-amber-600" : "text-zinc-300"}`}>
                      {r.importeExtra > 0 ? fmt(r.importeExtra) : "—"}
                    </p>
                  </div>

                  <div className="text-right shrink-0 w-28">
                    <p className="text-xs text-zinc-400 mb-0.5">Total</p>
                    <p className="text-base font-bold text-zinc-900">{fmt(r.importeTotal)}</p>
                  </div>

                  <div className="shrink-0">
                    {yaEnviado ? (
                      <span className="flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 px-3 py-2 rounded-lg">
                        <CheckCircle2 size={13} />
                        Enviado
                      </span>
                    ) : (
                      <button
                        onClick={() => enviarResumen(r)}
                        disabled={enviando === r.clienteId}
                        title={`Enviar resumen a ${r.email ?? r.nombre}`}
                        className="flex items-center gap-1.5 text-xs font-medium text-zinc-600 bg-zinc-100 hover:bg-blue-50 hover:text-blue-700 px-3 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {enviando === r.clienteId ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
                        Enviar al cliente
                      </button>
                    )}
                  </div>
                </div>

                {isOpen && (
                  <div className="border-t border-zinc-100 px-5 py-4 bg-zinc-50 space-y-4">
                    {r.serviciosContratados.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2">Servicios contratados</p>
                        <div className="space-y-1">
                          {r.serviciosContratados.map((s, i) => (
                            <div key={i} className="flex items-center justify-between text-sm">
                              <span className="text-zinc-700">{s.nombre}</span>
                              <div className="flex items-center gap-4 text-xs text-zinc-500">
                                {s.horasIncluidas > 0 && <span>{s.horasIncluidas}h incluidas</span>}
                                <span className="font-semibold text-zinc-800">{fmt(s.precio)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {r.incidencias.length > 0 ? (
                      <div>
                        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2">
                          Incidencias del mes ({r.incidencias.length})
                        </p>
                        <div className="space-y-1">
                          {r.incidencias.map((inc, i) => (
                            <div key={i} className="flex items-center justify-between text-sm">
                              <span className="text-zinc-700 truncate flex-1 mr-4">{inc.titulo}</span>
                              <div className="flex items-center gap-3 text-xs shrink-0">
                                <span className="text-zinc-400">{inc.estado}</span>
                                <span className={`font-semibold flex items-center gap-1 ${inc.horas > 0 ? "text-zinc-800" : "text-zinc-300"}`}>
                                  <Clock size={11} />{inc.horas > 0 ? `${inc.horas}h` : "—"}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-zinc-400">Sin incidencias registradas este mes</p>
                    )}

                    {r.horasExtra > 0 && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm">
                        <p className="font-medium text-amber-800">
                          {r.horasExtra}h extra × {fmt(r.tarifaHoraExtra)}/h = <strong>{fmt(r.importeExtra)}</strong>
                        </p>
                        <p className="text-xs text-amber-600 mt-0.5">
                          Se han trabajado {r.horasTrabajadas}h y el contrato incluye {r.horasIncluidas}h
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
