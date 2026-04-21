"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NuevaIncidenciaPublica() {
  const router = useRouter();
  const [form, setForm] = useState({ nombre: "", apellido: "", email: "", telefono: "", servicio: "", asunto: "", descripcion: "" });
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");

  function handleChange(e: any) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    setMensaje("");
    try {
      const res = await fetch('/api/incidencias', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Error creando incidencia');
      }
      setMensaje('Incidencia creada. Le enviaremos respuesta por correo.');
      setForm({ nombre: "", apellido: "", email: "", telefono: "", servicio: "", asunto: "", descripcion: "" });
    } catch (err: any) {
      setMensaje(err.message || 'Error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-2">Crear incidencia</h2>
      <p className="text-zinc-500 mb-6">Rellena el formulario y nos pondremos en contacto por correo.</p>
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-zinc-100 p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} className="input" required />
          <input name="apellido" placeholder="Apellido" value={form.apellido} onChange={handleChange} className="input" />
          <input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="input" required />
          <input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} className="input" />
        </div>
        <input name="servicio" placeholder="Servicio (opcional)" value={form.servicio} onChange={handleChange} className="input" />
        <input name="asunto" placeholder="Asunto" value={form.asunto} onChange={handleChange} className="input" />
        <textarea name="descripcion" placeholder="Describe tu incidencia" value={form.descripcion} onChange={handleChange} className="input" rows={4} />
        {mensaje && <div className="text-sm text-zinc-700">{mensaje}</div>}
        <div className="flex gap-2 justify-end">
          <button type="submit" className="btn btn-primary" disabled={loading}>{loading? 'Creando...':'Crear incidencia'}</button>
        </div>
      </form>
    </div>
  );
}
