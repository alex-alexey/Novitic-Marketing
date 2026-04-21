"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Plus } from "lucide-react";
import { SERVICIOS_CATEGORIZADOS } from "@/data/servicios";

interface ClienteFormProps {
  initial?: {
    nombre?: string;
    empresa?: string;
    email?: string;
    telefono?: string;
    web?: string;
    localidad?: string;
    estado?: "activo" | "inactivo" | "potencial";
    datosFiscales?: {
      razonSocial?: string;
      cif?: string;
      direccion?: string;
      cp?: string;
      localidad?: string;
      provincia?: string;
      pais?: string;
    };
    serviciosContratados?: { nombre: string; precio: number; notas?: string }[];
    notas?: string;
  };
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  submitLabel: string;
}

export default function ClienteForm({ initial = {}, onSubmit, submitLabel }: ClienteFormProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    nombre: initial.nombre ?? "",
    empresa: initial.empresa ?? "",
    email: initial.email ?? "",
    telefono: initial.telefono ?? "",
    web: initial.web ?? "",
    localidad: initial.localidad ?? "",
    estado: initial.estado ?? "activo",
    datosFiscales: {
      razonSocial: initial.datosFiscales?.razonSocial ?? "",
      cif: initial.datosFiscales?.cif ?? "",
      direccion: initial.datosFiscales?.direccion ?? "",
      cp: initial.datosFiscales?.cp ?? "",
      localidad: initial.datosFiscales?.localidad ?? "",
      provincia: initial.datosFiscales?.provincia ?? "",
      pais: initial.datosFiscales?.pais ?? "",
    },
    serviciosContratados: initial.serviciosContratados ?? [],
    notas: initial.notas ?? "",
  });
  const [servicio, setServicio] = useState({ nombre: "", precio: "", notas: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    if (name.startsWith("datosFiscales.")) {
      const key = name.replace("datosFiscales.", "");
      setForm((prev) => ({ ...prev, datosFiscales: { ...prev.datosFiscales, [key]: value } }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  }

  function handleServicioChange(e: React.ChangeEvent<HTMLInputElement>) {
    setServicio((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleServicioCatalogo(e: React.ChangeEvent<HTMLSelectElement>) {
    const [catIdx, srvIdx] = e.target.value.split(":");
    if (!catIdx || !srvIdx) return;
    const srv = SERVICIOS_CATEGORIZADOS[Number(catIdx)].servicios[Number(srvIdx)];
    setForm((prev) => ({
      ...prev,
      serviciosContratados: [
        ...prev.serviciosContratados,
        { nombre: srv.nombre, precio: srv.precio, notas: "" },
      ],
    }));
    e.target.value = "";
  }

  function addServicio() {
    if (!servicio.nombre || !servicio.precio) return;
    setForm((prev) => ({
      ...prev,
      serviciosContratados: [
        ...prev.serviciosContratados,
        { nombre: servicio.nombre, precio: Number(servicio.precio), notas: servicio.notas },
      ],
    }));
    setServicio({ nombre: "", precio: "", notas: "" });
  }

  function removeServicio(idx: number) {
    setForm((prev) => ({
      ...prev,
      serviciosContratados: prev.serviciosContratados.filter((_, i) => i !== idx),
    }));
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Normalizar payload: asegurarnos de que serviciosContratados es array y datosFiscales es objeto plano
      const payload = {
        ...form,
        serviciosContratados: Array.isArray(form.serviciosContratados) ? form.serviciosContratados : [],
        datosFiscales: form.datosFiscales || {},
      } as Record<string, unknown>;
      await onSubmit(payload);
    } catch (err: any) {
      setError(err.message || "Error al guardar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-5 max-w-2xl" onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">Nombre *</label>
          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nombre completo"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">Email *</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="correo@empresa.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">Empresa</label>
          <input
            name="empresa"
            value={form.empresa}
            onChange={handleChange}
            className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nombre de la empresa"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">Teléfono</label>
          <input
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
            className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="+34 600 000 000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">Web</label>
          <input
            name="web"
            value={form.web}
            onChange={handleChange}
            className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://empresa.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">Localidad</label>
          <input
            name="localidad"
            value={form.localidad}
            onChange={handleChange}
            className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: Madrid, Barcelona..."
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">Estado</label>
        <select
          name="estado"
          value={form.estado}
          onChange={handleChange}
          className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="activo">Activo</option>
          <option value="potencial">Potencial</option>
          <option value="inactivo">Inactivo</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">Notas</label>
        <textarea
          name="notas"
          value={form.notas}
          onChange={handleChange}
          rows={3}
          className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Notas internas sobre este cliente..."
        />
      </div>
      <div className="border-t pt-4 mt-4">
        <h3 className="font-semibold mb-2 text-zinc-700">Datos fiscales</h3>
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Razón social *</label>
            <input
              name="datosFiscales.razonSocial"
              value={form.datosFiscales.razonSocial}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nombre fiscal"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">CIF *</label>
            <input
              name="datosFiscales.cif"
              value={form.datosFiscales.cif}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="B12345678"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Dirección *</label>
            <input
              name="datosFiscales.direccion"
              value={form.datosFiscales.direccion}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Calle, número, piso..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">CP *</label>
            <input
              name="datosFiscales.cp"
              value={form.datosFiscales.cp}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="28001"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Localidad *</label>
            <input
              name="datosFiscales.localidad"
              value={form.datosFiscales.localidad}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Madrid"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Provincia *</label>
            <input
              name="datosFiscales.provincia"
              value={form.datosFiscales.provincia}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Madrid"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">País *</label>
            <input
              name="datosFiscales.pais"
              value={form.datosFiscales.pais}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="España"
            />
          </div>
        </div>
      </div>
      <div className="border-t pt-4 mt-4">
        <h3 className="font-semibold mb-3 text-zinc-700">Servicios contratados</h3>

        {/* Selector del catálogo — añade directamente al seleccionar */}
        <select
          onChange={handleServicioCatalogo}
          defaultValue=""
          className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
        >
          <option value="" disabled>Añadir desde catálogo...</option>
          {SERVICIOS_CATEGORIZADOS.map((cat, i) => (
            <optgroup key={cat.categoria} label={cat.categoria}>
              {cat.servicios.map((srv, j) => (
                <option key={srv.id} value={`${i}:${j}`}>{srv.nombre} — {srv.precio}€/mes</option>
              ))}
            </optgroup>
          ))}
        </select>

        {/* Fila para servicio personalizado */}
        <div className="flex gap-2 mb-4">
          <input
            name="nombre"
            placeholder="Servicio personalizado"
            value={servicio.nombre}
            onChange={handleServicioChange}
            className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="precio"
            placeholder="Precio €"
            type="number"
            value={servicio.precio}
            onChange={handleServicioChange}
            className="w-28 rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="notas"
            placeholder="Notas (opcional)"
            value={servicio.notas}
            onChange={handleServicioChange}
            className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={addServicio}
            disabled={!servicio.nombre || !servicio.precio}
            className="flex items-center gap-1.5 px-3 py-2 text-sm bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors disabled:opacity-40"
          >
            <Plus size={14} />
            Añadir
          </button>
        </div>

        {/* Tarjetas de servicios añadidos */}
        {form.serviciosContratados.length === 0 ? (
          <p className="text-sm text-zinc-400 text-center py-4 bg-zinc-50 rounded-lg border border-dashed border-zinc-200">
            Sin servicios contratados
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {form.serviciosContratados.map((s, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-3 bg-zinc-50 rounded-xl border border-zinc-200">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-sm font-medium text-zinc-900 truncate">{s.nombre}</span>
                  {s.notas && <span className="text-xs text-zinc-400 truncate">· {s.notas}</span>}
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <div className="flex items-center gap-1 bg-blue-50 border border-blue-200 rounded-full px-2.5 py-0.5">
                    <input
                      type="number"
                      value={s.precio}
                      min={0}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        setForm((prev) => ({
                          ...prev,
                          serviciosContratados: prev.serviciosContratados.map((srv, idx) =>
                            idx === i ? { ...srv, precio: val } : srv
                          ),
                        }));
                      }}
                      className="w-16 text-sm font-semibold text-blue-600 bg-transparent text-right focus:outline-none"
                    />
                    <span className="text-sm font-semibold text-blue-600">€</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeServicio(i)}
                    className="p-1 rounded-md text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
            <div className="flex justify-end pt-1">
              <span className="text-xs text-zinc-500">
                Total: <span className="font-semibold text-zinc-800">
                  {form.serviciosContratados.reduce((sum, s) => sum + s.precio, 0)}€/mes
                </span>
              </span>
            </div>
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">{error}</p>
      )}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? "Guardando..." : submitLabel}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-zinc-600 hover:text-zinc-900 text-sm font-medium px-5 py-2.5 rounded-lg border border-zinc-300 hover:bg-zinc-50 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
