"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export default function NuevaIncidenciaPublica() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    titulo: "",
    descripcion: "",
    prioridad: "media",
  });
  const [loading, setLoading] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/soporte", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al enviar");
      setTicketId(data.ticketId);
    } catch (err: any) {
      setError(err.message || "Error al enviar la solicitud");
    } finally {
      setLoading(false);
    }
  }

  if (ticketId) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-10 max-w-md w-full text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 size={48} className="text-green-500" />
          </div>
          <h2 className="text-xl font-bold text-zinc-900 mb-2">Incidencia registrada</h2>
          <p className="text-zinc-500 text-sm mb-5">
            Hemos recibido tu solicitud. Nos pondremos en contacto contigo lo antes posible.
          </p>
          <div className="bg-zinc-50 rounded-xl px-5 py-3 mb-6">
            <p className="text-xs text-zinc-400 mb-1">Número de ticket</p>
            <p className="font-mono text-sm font-semibold text-zinc-700 break-all">{ticketId}</p>
          </div>
          <button
            onClick={() => { setTicketId(null); setForm({ nombre: "", email: "", titulo: "", descripcion: "", prioridad: "media" }); }}
            className="text-sm text-blue-600 hover:underline"
          >
            Abrir otra incidencia
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-zinc-900">Crear incidencia</h1>
          <p className="text-zinc-500 mt-2 text-sm">
            Describe tu problema y te responderemos en el menor tiempo posible.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Email *</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="tucorreo@ejemplo.com"
                  className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Nombre</label>
                <input
                  name="nombre"
                  type="text"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Tu nombre"
                  className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Asunto *</label>
              <input
                name="titulo"
                type="text"
                value={form.titulo}
                onChange={handleChange}
                required
                placeholder="Describe brevemente el problema"
                className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Descripción</label>
              <textarea
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                rows={5}
                placeholder="Explica el problema con detalle: qué ocurre, cuándo empezó, pasos para reproducirlo..."
                className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Urgencia</label>
              <select
                name="prioridad"
                value={form.prioridad}
                onChange={handleChange}
                className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="baja">Baja — no es urgente</option>
                <option value="media">Media — necesito solución pronto</option>
                <option value="alta">Alta — afecta a mi trabajo</option>
                <option value="critica">Crítica — sistema parado</option>
              </select>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">
                <AlertCircle size={15} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <><Loader2 size={16} className="animate-spin" /> Enviando...</> : "Enviar incidencia"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
