"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Send, Loader2 } from "lucide-react";

export default function EditarIncidenciaPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [incidencia, setIncidencia] = useState<any>(null);
  const [cliente, setCliente] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<any>(null);

  // Comentarios
  const [comentarios, setComentarios] = useState<any[]>([]);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [enviandoComentario, setEnviandoComentario] = useState(false);
  const comentariosEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/incidencias?id=${id}`)
      .then((r) => r.json())
      .then((d) => {
        const inc = d.incidencia;
        setIncidencia(inc);
        setComentarios(inc.comentarios ?? []);
        setForm({
          titulo: inc.titulo ?? inc.asunto ?? "",
          descripcion: inc.descripcion ?? "",
          estado: inc.estado ?? "abierta",
          prioridad: inc.prioridad ?? "media",
          horasConsumidas: inc.horasConsumidas ?? 0,
          notas: inc.notas ?? "",
          fechaCierre: inc.fechaCierre ? new Date(inc.fechaCierre).toISOString().split("T")[0] : "",
        });
        const clienteObj = inc.clienteId;
        if (clienteObj && typeof clienteObj === "object") setCliente(clienteObj);
        setLoading(false);
      })
      .catch(() => { setError("No se pudo cargar la incidencia"); setLoading(false); });
  }, [id]);

  useEffect(() => {
    comentariosEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comentarios]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((f: any) => ({ ...f, [name]: name === "horasConsumidas" ? parseFloat(value) || 0 : value }));
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload: any = { ...form };
      if (!payload.fechaCierre) delete payload.fechaCierre;
      const res = await fetch(`/api/incidencias?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error ?? "Error al guardar");
      }
      const clienteId = typeof incidencia?.clienteId === "object"
        ? incidencia.clienteId._id
        : incidencia?.clienteId;
      router.push(clienteId ? `/clientes/${clienteId}` : "/incidencias");
    } catch (err: any) {
      setError(err.message || "Error");
    } finally {
      setSaving(false);
    }
  }

  async function handleEnviarComentario() {
    if (!nuevoComentario.trim()) return;
    setEnviandoComentario(true);
    try {
      const res = await fetch(`/api/incidencias/${id}/comentarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto: nuevoComentario }),
      });
      if (!res.ok) throw new Error("Error al añadir comentario");
      const data = await res.json();
      setComentarios(data.incidencia.comentarios ?? []);
      setNuevoComentario("");
    } catch {
      // silenciar — el comentario no se enviará pero el formulario sigue funcional
    } finally {
      setEnviandoComentario(false);
    }
  }

  function handleComentarioKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleEnviarComentario();
    }
  }

  if (loading) return <div className="flex justify-center items-center py-32"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-zinc-400" /></div>;
  if (error && !form) return <div className="p-8 text-red-600">{error}</div>;
  if (!form) return null;

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => router.back()}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">{form.titulo || "Editar incidencia"}</h2>
          {cliente && (
            <p className="text-zinc-500 mt-0.5">Cliente: {cliente.nombre}{cliente.empresa ? ` · ${cliente.empresa}` : ""}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-5 gap-6">
        {/* Formulario — columna izquierda */}
        <div className="col-span-3">
          <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Título *</label>
                <input
                  name="titulo"
                  value={form.titulo}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Horas consumidas</label>
                  <input
                    name="horasConsumidas"
                    type="number"
                    min={0}
                    step={0.5}
                    value={form.horasConsumidas}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Fecha de cierre</label>
                  <input
                    name="fechaCierre"
                    type="date"
                    value={form.fechaCierre}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
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
                <button type="submit" disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50">
                  {saving ? "Guardando..." : "Guardar cambios"}
                </button>
                <button type="button" onClick={() => router.back()}
                  className="text-zinc-600 hover:text-zinc-900 text-sm font-medium px-5 py-2.5 rounded-lg border border-zinc-300 hover:bg-zinc-50 transition-colors">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Comentarios — columna derecha */}
        <div className="col-span-2 flex flex-col">
          <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm flex flex-col flex-1">
            <div className="px-5 py-4 border-b border-zinc-100">
              <h3 className="font-semibold text-zinc-800 text-sm">Comentarios</h3>
              <p className="text-xs text-zinc-400 mt-0.5">{comentarios.length} entrada{comentarios.length !== 1 ? "s" : ""}</p>
            </div>

            {/* Hilo de comentarios */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 max-h-[420px]">
              {comentarios.length === 0 ? (
                <p className="text-sm text-zinc-400 text-center py-8">Sin comentarios todavía.</p>
              ) : (
                comentarios.map((c, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-zinc-700">{c.autor ?? "Admin"}</span>
                      <span className="text-xs text-zinc-400">
                        {new Date(c.fecha).toLocaleString("es-ES", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <div className="bg-zinc-50 rounded-xl px-4 py-3 text-sm text-zinc-800 whitespace-pre-wrap">
                      {c.texto}
                    </div>
                  </div>
                ))
              )}
              <div ref={comentariosEndRef} />
            </div>

            {/* Input nuevo comentario */}
            <div className="px-5 py-4 border-t border-zinc-100">
              <textarea
                value={nuevoComentario}
                onChange={(e) => setNuevoComentario(e.target.value)}
                onKeyDown={handleComentarioKeyDown}
                placeholder="Escribe un comentario... (Ctrl+Enter para enviar)"
                rows={3}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  onClick={handleEnviarComentario}
                  disabled={!nuevoComentario.trim() || enviandoComentario}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-40"
                >
                  {enviandoComentario ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                  Enviar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
