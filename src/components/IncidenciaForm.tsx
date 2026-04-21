"use client";

import { useState } from "react";

interface IncidenciaFormProps {
  initial?: any;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  submitLabel: string;
}

export default function IncidenciaForm({ initial = {}, onSubmit, submitLabel }: IncidenciaFormProps) {
  const [form, setForm] = useState({
    nombre: initial.nombre ?? "",
    apellido: initial.apellido ?? "",
    email: initial.email ?? "",
    telefono: initial.telefono ?? "",
    servicio: initial.servicio ?? "",
    asunto: initial.asunto ?? "",
    descripcion: initial.descripcion ?? "",
    estado: initial.estado ?? "abierta",
    prioridad: initial.prioridad ?? "media",
    horasConsumidas: initial.horasConsumidas ?? 0,
    comentarios: initial.comentarios ?? [],
  });
  const [comentario, setComentario] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e: any) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function addComentario() {
    if (!comentario) return;
    setForm((f) => ({ ...f, comentarios: [...(f.comentarios || []), { autor: 'Proveedor', mensaje: comentario, fecha: new Date().toISOString() }] }));
    setComentario("");
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await onSubmit(form);
    } catch (err: any) {
      setError(err.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" className="input" required />
        <input name="apellido" value={form.apellido} onChange={handleChange} placeholder="Apellido" className="input" />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="input" required />
        <input name="telefono" value={form.telefono} onChange={handleChange} placeholder="Teléfono" className="input" />
      </div>
      <input name="servicio" value={form.servicio} onChange={handleChange} placeholder="Servicio" className="input" />
      <input name="asunto" value={form.asunto} onChange={handleChange} placeholder="Asunto" className="input" />
      <textarea name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Descripción" className="input" rows={4} />

      <div className="flex gap-2 flex-wrap">
        <select name="estado" value={form.estado} onChange={handleChange} className="input w-48">
          <option value="abierta">Abierta</option>
          <option value="en-progreso">En progreso</option>
          <option value="resuelta">Resuelta</option>
          <option value="cerrada">Cerrada</option>
        </select>
        <select name="prioridad" value={form.prioridad} onChange={handleChange} className="input w-48">
          <option value="baja">Baja</option>
          <option value="media">Media</option>
          <option value="alta">Alta</option>
          <option value="critica">Crítica</option>
        </select>
        <div className="flex items-center gap-2">
          <label className="text-sm text-zinc-600 whitespace-nowrap">Horas consumidas</label>
          <input
            name="horasConsumidas"
            type="number"
            min={0}
            step={0.5}
            value={form.horasConsumidas}
            onChange={handleChange}
            className="input w-24"
          />
        </div>
      </div>

      <div>
        <div className="flex gap-2 items-center mb-2">
          <input value={comentario} onChange={(e) => setComentario(e.target.value)} placeholder="Añadir comentario (visible para proveedor)" className="input flex-1" />
          <button type="button" onClick={addComentario} className="px-3 py-2 bg-zinc-100 rounded">Añadir</button>
        </div>
        <ul className="space-y-2">
          {(form.comentarios || []).map((c: any, i: number) => (
            <li key={i} className="text-sm text-zinc-700 border rounded p-2">{c.autor}: {c.mensaje} <div className="text-xs text-zinc-400">{new Date(c.fecha).toLocaleString()}</div></li>
          ))}
        </ul>
      </div>

      {error && <div className="text-sm text-red-600">{error}</div>}

      <div className="flex justify-end gap-2">
        <button type="submit" className="btn btn-primary" disabled={loading}>{loading? 'Guardando...': submitLabel}</button>
      </div>
    </form>
  );
}
