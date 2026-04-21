"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Loader2, ChevronLeft } from "lucide-react";
import Link from "next/link";

interface Cliente {
  _id: string;
  nombre: string;
  empresa?: string;
}

interface Concepto {
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
}

function emptyConcepto(): Concepto {
  return { descripcion: "", cantidad: 1, precioUnitario: 0 };
}

function fmt(n: number) {
  return n.toLocaleString("es-ES", { style: "currency", currency: "EUR" });
}

export default function NuevaFacturaPage() {
  const router = useRouter();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const today = new Date().toISOString().slice(0, 10);
  const [clienteId, setClienteId] = useState("");
  const [numero, setNumero] = useState("");
  const [fechaEmision, setFechaEmision] = useState(today);
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [estado, setEstado] = useState("pendiente");
  const [notas, setNotas] = useState("");
  const [conceptos, setConceptos] = useState<Concepto[]>([emptyConcepto()]);

  useEffect(() => {
    fetch("/api/clientes?limit=200&estado=activo")
      .then((r) => r.json())
      .then((d) => setClientes(d.clientes ?? []));
  }, []);

  const importe = conceptos.reduce((sum, c) => sum + c.cantidad * c.precioUnitario, 0);

  function updateConcepto(i: number, field: keyof Concepto, value: string | number) {
    setConceptos((prev) => prev.map((c, idx) => idx === i ? { ...c, [field]: value } : c));
  }

  function addConcepto() {
    setConceptos((prev) => [...prev, emptyConcepto()]);
  }

  function removeConcepto(i: number) {
    setConceptos((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!clienteId) { setError("Selecciona un cliente."); return; }
    if (!numero.trim()) { setError("El número de factura es obligatorio."); return; }
    if (!fechaVencimiento) { setError("La fecha de vencimiento es obligatoria."); return; }
    if (conceptos.length === 0) { setError("Añade al menos un concepto."); return; }

    setSaving(true);
    const res = await fetch("/api/facturas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clienteId, numero: numero.trim(), fechaEmision, fechaVencimiento, estado, notas: notas.trim(), conceptos, importe }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { setError(data.error ?? "Error al crear la factura."); return; }
    router.push("/facturacion");
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/facturacion" className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-500 transition-colors">
          <ChevronLeft size={18} />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">Nueva factura</h2>
          <p className="text-zinc-500 text-sm mt-0.5">Crea una factura para un cliente</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Datos generales */}
        <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6 space-y-4">
          <h3 className="text-sm font-semibold text-zinc-700 uppercase tracking-wide">Datos generales</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-600 mb-1">Cliente *</label>
              <select
                value={clienteId}
                onChange={(e) => setClienteId(e.target.value)}
                className="w-full text-sm border border-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Selecciona un cliente</option>
                {clientes.map((c) => (
                  <option key={c._id} value={c._id}>{c.empresa ?? c.nombre}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-600 mb-1">Número de factura *</label>
              <input
                type="text"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                placeholder="FAC-2024-001"
                className="w-full text-sm border border-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-600 mb-1">Fecha de emisión</label>
              <input
                type="date"
                value={fechaEmision}
                onChange={(e) => setFechaEmision(e.target.value)}
                className="w-full text-sm border border-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-600 mb-1">Fecha de vencimiento *</label>
              <input
                type="date"
                value={fechaVencimiento}
                onChange={(e) => setFechaVencimiento(e.target.value)}
                className="w-full text-sm border border-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-600 mb-1">Estado</label>
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                className="w-full text-sm border border-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="pendiente">Pendiente</option>
                <option value="pagada">Pagada</option>
                <option value="vencida">Vencida</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-600 mb-1">Notas internas</label>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              rows={2}
              placeholder="Observaciones, forma de pago, etc."
              className="w-full text-sm border border-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>

        {/* Conceptos */}
        <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6 space-y-4">
          <h3 className="text-sm font-semibold text-zinc-700 uppercase tracking-wide">Conceptos</h3>

          <div className="space-y-3">
            {conceptos.map((c, i) => (
              <div key={i} className="flex items-center gap-3">
                <input
                  type="text"
                  value={c.descripcion}
                  onChange={(e) => updateConcepto(i, "descripcion", e.target.value)}
                  placeholder="Descripción del servicio"
                  className="flex-1 text-sm border border-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  min="1"
                  value={c.cantidad}
                  onChange={(e) => updateConcepto(i, "cantidad", Number(e.target.value))}
                  className="w-20 text-sm border border-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                  title="Cantidad"
                />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={c.precioUnitario}
                  onChange={(e) => updateConcepto(i, "precioUnitario", Number(e.target.value))}
                  className="w-28 text-sm border border-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                  title="Precio unitario (€)"
                />
                <span className="text-sm text-zinc-500 w-24 text-right">{fmt(c.cantidad * c.precioUnitario)}</span>
                <button
                  type="button"
                  onClick={() => removeConcepto(i)}
                  disabled={conceptos.length === 1}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-30"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addConcepto}
            className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            <Plus size={15} />
            Añadir concepto
          </button>

          <div className="flex justify-end pt-2 border-t border-zinc-100">
            <div className="text-right">
              <p className="text-xs text-zinc-500">Total (sin IVA)</p>
              <p className="text-2xl font-bold text-zinc-900">{fmt(importe)}</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <Link
            href="/facturacion"
            className="px-4 py-2.5 text-sm border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors font-medium text-zinc-700"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : null}
            {saving ? "Guardando..." : "Crear factura"}
          </button>
        </div>
      </form>
    </div>
  );
}
