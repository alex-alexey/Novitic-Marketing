"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef, Suspense } from "react";
import { ArrowLeft, Search, X } from "lucide-react";

function NuevaIncidenciaForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preClienteId = searchParams.get("clienteId") ?? "";

  const [clienteSeleccionado, setClienteSeleccionado] = useState<{ _id: string; nombre: string; empresa?: string } | null>(null);
  const [clienteQuery, setClienteQuery] = useState("");
  const [clienteResultados, setClienteResultados] = useState<any[]>([]);
  const [clienteDropdown, setClienteDropdown] = useState(false);
  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    estado: "abierta",
    prioridad: "media",
    horasConsumidas: 0,
    notas: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Pre-cargar cliente si viene por query param
  useEffect(() => {
    if (!preClienteId) return;
    fetch(`/api/clientes?id=${preClienteId}`)
      .then((r) => r.json())
      .then((d) => { if (d.cliente) setClienteSeleccionado(d.cliente); });
  }, [preClienteId]);

  // Búsqueda de clientes con debounce
  useEffect(() => {
    if (!clienteQuery.trim()) { setClienteResultados([]); return; }
    const t = setTimeout(async () => {
      const res = await fetch(`/api/clientes?q=${encodeURIComponent(clienteQuery)}&limit=6`);
      const data = await res.json();
      setClienteResultados(data.clientes ?? []);
      setClienteDropdown(true);
    }, 250);
    return () => clearTimeout(t);
  }, [clienteQuery]);

  // Cerrar dropdown al click fuera
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setClienteDropdown(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function seleccionarCliente(c: any) {
    setClienteSeleccionado(c);
    setClienteQuery("");
    setClienteResultados([]);
    setClienteDropdown(false);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: name === "horasConsumidas" ? parseFloat(value) || 0 : value }));
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!clienteSeleccionado) { setError("Selecciona un cliente para esta incidencia"); return; }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/incidencias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, clienteId: clienteSeleccionado._id }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error ?? "Error al crear incidencia");
      }
      router.push(`/clientes/${clienteSeleccionado._id}`);
    } catch (err: any) {
      setError(err.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => router.back()}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <h2 className="text-2xl font-bold text-zinc-900">Nueva incidencia</h2>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-8">
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Selector de cliente */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Cliente *</label>
            {clienteSeleccionado ? (
              <div className="flex items-center justify-between px-4 py-2.5 rounded-lg border border-blue-300 bg-blue-50">
                <div>
                  <span className="text-sm font-medium text-zinc-900">{clienteSeleccionado.nombre}</span>
                  {clienteSeleccionado.empresa && (
                    <span className="text-sm text-zinc-500 ml-2">· {clienteSeleccionado.empresa}</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setClienteSeleccionado(null)}
                  className="p-1 rounded text-zinc-400 hover:text-zinc-700 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  value={clienteQuery}
                  onChange={(e) => setClienteQuery(e.target.value)}
                  onFocus={() => clienteResultados.length > 0 && setClienteDropdown(true)}
                  placeholder="Buscar cliente por nombre o email..."
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {clienteDropdown && clienteResultados.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-zinc-200 rounded-xl shadow-lg overflow-hidden">
                    {clienteResultados.map((c) => (
                      <button
                        key={c._id}
                        type="button"
                        onClick={() => seleccionarCliente(c)}
                        className="w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-zinc-50 transition-colors text-left"
                      >
                        <span className="font-medium text-zinc-900">{c.nombre}</span>
                        <span className="text-zinc-400 text-xs">{c.empresa || c.email}</span>
                      </button>
                    ))}
                  </div>
                )}
                {clienteDropdown && clienteQuery && clienteResultados.length === 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-zinc-200 rounded-xl shadow-lg px-4 py-3 text-sm text-zinc-400">
                    Sin resultados para "{clienteQuery}"
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Título *</label>
            <input
              name="titulo"
              value={form.titulo}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descripción breve del problema"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Descripción</label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Detalla el problema, pasos para reproducirlo..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Estado</label>
              <select name="estado" value={form.estado} onChange={handleChange}
                className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="abierta">Abierta</option>
                <option value="en-progreso">En progreso</option>
                <option value="resuelta">Resuelta</option>
                <option value="cerrada">Cerrada</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Prioridad</label>
              <select name="prioridad" value={form.prioridad} onChange={handleChange}
                className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
                <option value="critica">Crítica</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Horas consumidas</label>
            <input
              name="horasConsumidas"
              type="number"
              min={0}
              step={0.5}
              value={form.horasConsumidas}
              onChange={handleChange}
              className="w-32 rounded-lg border border-zinc-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Notas internas</label>
            <textarea
              name="notas"
              value={form.notas}
              onChange={handleChange}
              rows={2}
              className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Notas internas (no visibles al cliente)"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50">
              {loading ? "Creando..." : "Crear incidencia"}
            </button>
            <button type="button" onClick={() => router.back()}
              className="text-zinc-600 hover:text-zinc-900 text-sm font-medium px-5 py-2.5 rounded-lg border border-zinc-300 hover:bg-zinc-50 transition-colors">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function NuevaIncidenciaPage() {
  return (
    <Suspense fallback={<div className="p-8">Cargando...</div>}>
      <NuevaIncidenciaForm />
    </Suspense>
  );
}
