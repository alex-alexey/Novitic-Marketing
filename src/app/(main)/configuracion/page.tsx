"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Plus, Pencil, Trash2, X, Loader2, Globe, BookOpen, Upload, ImageIcon } from "lucide-react";

/* ══════════════════════════ TYPES ══════════════════════════ */

interface Project {
  _id?: string;
  name: string;
  tagline: string;
  category: "Desarrollo Web" | "Branding" | "Servicios IT";
  year: number;
  bg: string;
  image: string;
  client: string;
  tech: string;
  status: string;
  desc: string;
  link: string;
}

interface Post {
  _id?: string;
  title: string;
  slug: string;
  cat: string;
  excerpt: string;
  content: string;
  date: string;
  read: string;
  featured: boolean;
  published: boolean;
  bg: string;
}

/* ══════════════════════════ DEFAULTS ══════════════════════════ */

const EMPTY_PROJECT: Project = {
  name: "", tagline: "", category: "Desarrollo Web", year: new Date().getFullYear(),
  bg: "linear-gradient(135deg,#0a1628,#112240)", image: "", client: "", tech: "", status: "Completado", desc: "", link: "#",
};

const EMPTY_POST: Post = {
  title: "", slug: "", cat: "Desarrollo Web", excerpt: "", content: "",
  date: new Date().toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" }),
  read: "3 min", featured: false, published: false, bg: "linear-gradient(135deg,#0a2a3a,#0d4a6a)",
};

const PROJECT_CATS = ["Desarrollo Web", "Branding", "Servicios IT"];
const POST_CATS    = ["Servicios IT", "Desarrollo Web", "SEO", "Diseño Web", "Seguridad", "E-commerce"];
const GRADIENTS    = [
  "linear-gradient(135deg,#0a1628,#112240)",
  "linear-gradient(135deg,#0d2b1a,#1a4a2e)",
  "linear-gradient(135deg,#1a0a28,#2d1245)",
  "linear-gradient(135deg,#1a1200,#3a2800)",
  "linear-gradient(135deg,#0a1a1a,#0d3030)",
  "linear-gradient(135deg,#001428,#002244)",
  "linear-gradient(135deg,#0a2a3a,#0d4a6a,#0a2a3a)",
  "linear-gradient(135deg,#150820,#250a3c)",
  "linear-gradient(135deg,#1a0a14,#350a28)",
  "linear-gradient(135deg,#001a24,#003040)",
];

/* ══════════════════════════ INPUT ══════════════════════════ */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "bg-zinc-800 border border-zinc-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 transition-colors";

/* ══════════════════════════ MODAL ══════════════════════════ */

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <h2 className="text-white font-semibold text-base">{title}</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

/* ══════════════════════════ PROJECT FORM ══════════════════════════ */

function ProjectForm({ initial, onSave, onClose }: {
  initial: Project;
  onSave: (data: Project) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm]         = useState<Project>(initial);
  const [saving, setSaving]     = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview]   = useState<string>(initial.image || "");
  const fileRef                 = useRef<HTMLInputElement>(null);

  const set = (k: keyof Project, v: string | number) => setForm((f) => ({ ...f, [k]: v }));

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res  = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (data.url) {
      setPreview(data.url);
      setForm((f) => ({ ...f, image: data.url }));
    }
    setUploading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
    onClose();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Nombre del proyecto">
          <input className={inputCls} value={form.name} onChange={(e) => set("name", e.target.value)} required />
        </Field>
        <Field label="Cliente">
          <input className={inputCls} value={form.client} onChange={(e) => set("client", e.target.value)} required />
        </Field>
      </div>

      <Field label="Tagline (subtítulo corto)">
        <input className={inputCls} value={form.tagline} onChange={(e) => set("tagline", e.target.value)} required />
      </Field>

      <div className="grid grid-cols-3 gap-4">
        <Field label="Categoría">
          <select className={inputCls} value={form.category} onChange={(e) => set("category", e.target.value as Project["category"])}>
            {PROJECT_CATS.map((c) => <option key={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Año">
          <input type="number" className={inputCls} value={form.year} onChange={(e) => set("year", Number(e.target.value))} min={2020} max={2030} required />
        </Field>
        <Field label="Estado">
          <select className={inputCls} value={form.status} onChange={(e) => set("status", e.target.value)}>
            {["Completado", "Activo", "En progreso"].map((s) => <option key={s}>{s}</option>)}
          </select>
        </Field>
      </div>

      <Field label="Tecnologías (separadas por comas)">
        <input className={inputCls} value={form.tech} onChange={(e) => set("tech", e.target.value)} placeholder="WordPress, Elementor, PHP" required />
      </Field>

      <Field label="Descripción completa">
        <textarea className={inputCls + " resize-none"} rows={4} value={form.desc} onChange={(e) => set("desc", e.target.value)} required />
      </Field>

      <Field label="URL del proyecto">
        <input className={inputCls} value={form.link} onChange={(e) => set("link", e.target.value)} placeholder="https://... o # si no hay enlace" />
      </Field>

      {/* ── Imagen ── */}
      <Field label="Imagen del proyecto">
        <div className="flex gap-3 items-start">
          {/* Preview */}
          <div
            className="w-32 h-20 rounded-lg border border-zinc-700 flex-shrink-0 overflow-hidden flex items-center justify-center"
            style={{ background: preview ? undefined : form.bg }}
          >
            {preview ? (
              <img src={preview} alt="preview" className="w-full h-full object-cover" />
            ) : (
              <ImageIcon size={20} className="text-white/20" />
            )}
          </div>

          {/* Controles */}
          <div className="flex-1 space-y-2">
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleFile}
            />
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 text-xs font-medium rounded-lg transition-colors disabled:opacity-50 w-full"
            >
              {uploading ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
              {uploading ? "Subiendo…" : "Subir imagen"}
            </button>
            <input
              className={inputCls + " text-xs"}
              value={form.image}
              onChange={(e) => { set("image", e.target.value); setPreview(e.target.value); }}
              placeholder="o pega una URL externa"
            />
            {preview && (
              <button
                type="button"
                onClick={() => { setPreview(""); setForm((f) => ({ ...f, image: "" })); }}
                className="text-xs text-red-400 hover:text-red-300 transition-colors"
              >
                Eliminar imagen
              </button>
            )}
          </div>
        </div>
      </Field>

      {/* Color de fondo (se usa cuando no hay imagen) */}
      <Field label="Color de fondo — se muestra si no hay imagen">
        <div className="flex gap-2 flex-wrap">
          {GRADIENTS.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => set("bg", g)}
              className={`w-8 h-8 rounded-lg border-2 transition-all ${form.bg === g ? "border-blue-500 scale-110" : "border-transparent"}`}
              style={{ background: g }}
            />
          ))}
        </div>
      </Field>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors">Cancelar</button>
        <button
          type="submit"
          disabled={saving || uploading}
          className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
        >
          {saving && <Loader2 size={14} className="animate-spin" />}
          {form._id ? "Guardar cambios" : "Crear proyecto"}
        </button>
      </div>
    </form>
  );
}

/* ══════════════════════════ POST FORM ══════════════════════════ */

function PostForm({ initial, onSave, onClose }: {
  initial: Post;
  onSave: (data: Post) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Post>(initial);
  const [saving, setSaving] = useState(false);

  const set = (k: keyof Post, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
    onClose();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label="Título">
        <input className={inputCls} value={form.title} onChange={(e) => set("title", e.target.value)} required />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Categoría">
          <select className={inputCls} value={form.cat} onChange={(e) => set("cat", e.target.value)}>
            {POST_CATS.map((c) => <option key={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Tiempo de lectura">
          <input className={inputCls} value={form.read} onChange={(e) => set("read", e.target.value)} placeholder="5 min" />
        </Field>
      </div>

      <Field label="Extracto (resumen visible en el listado)">
        <textarea className={inputCls + " resize-none"} rows={3} value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} required />
      </Field>

      <Field label="Contenido del artículo">
        <textarea className={inputCls + " resize-none"} rows={8} value={form.content} onChange={(e) => set("content", e.target.value)} placeholder="Escribe el contenido completo del artículo..." />
      </Field>

      <Field label="Color de fondo (gradiente)">
        <div className="flex gap-2 flex-wrap">
          {GRADIENTS.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => set("bg", g)}
              className={`w-8 h-8 rounded-lg border-2 transition-all ${form.bg === g ? "border-blue-500 scale-110" : "border-transparent"}`}
              style={{ background: g }}
            />
          ))}
        </div>
      </Field>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="accent-blue-500 w-4 h-4" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} />
          <span className="text-sm text-zinc-300">Artículo destacado</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="accent-green-500 w-4 h-4" checked={form.published} onChange={(e) => set("published", e.target.checked)} />
          <span className="text-sm text-zinc-300">Publicado</span>
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors">Cancelar</button>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
        >
          {saving && <Loader2 size={14} className="animate-spin" />}
          {form._id ? "Guardar cambios" : "Publicar post"}
        </button>
      </div>
    </form>
  );
}

/* ══════════════════════════ PAGE ══════════════════════════ */

export default function ConfiguracionPage() {
  const [tab, setTab] = useState<"portafolio" | "blog">("portafolio");

  /* ── Projects state ── */
  const [projects, setProjects]         = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [projectModal, setProjectModal] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<string | null>(null);

  /* ── Posts state ── */
  const [posts, setPosts]           = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [postModal, setPostModal]   = useState<Post | null>(null);
  const [deletingPost, setDeletingPost] = useState<string | null>(null);

  /* ── Fetch ── */
  const fetchProjects = useCallback(async () => {
    setLoadingProjects(true);
    const res = await fetch("/api/projects");
    setProjects(await res.json());
    setLoadingProjects(false);
  }, []);

  const fetchPosts = useCallback(async () => {
    setLoadingPosts(true);
    const res = await fetch("/api/posts");
    setPosts(await res.json());
    setLoadingPosts(false);
  }, []);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);
  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  /* ── Project CRUD ── */
  async function saveProject(data: Project) {
    if (data._id) {
      await fetch(`/api/projects/${data._id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    } else {
      await fetch("/api/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    }
    await fetchProjects();
  }

  async function deleteProject(id: string) {
    if (!confirm("¿Eliminar este proyecto?")) return;
    setDeletingProject(id);
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    await fetchProjects();
    setDeletingProject(null);
  }

  /* ── Post CRUD ── */
  async function savePost(data: Post) {
    if (data._id) {
      await fetch(`/api/posts/${data._id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    } else {
      await fetch("/api/posts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    }
    await fetchPosts();
  }

  async function deletePost(id: string) {
    if (!confirm("¿Eliminar este post?")) return;
    setDeletingPost(id);
    await fetch(`/api/posts/${id}`, { method: "DELETE" });
    await fetchPosts();
    setDeletingPost(null);
  }

  return (
    <>
      {/* Modales */}
      {projectModal && (
        <Modal title={projectModal._id ? "Editar proyecto" : "Nuevo proyecto"} onClose={() => setProjectModal(null)}>
          <ProjectForm initial={projectModal} onSave={saveProject} onClose={() => setProjectModal(null)} />
        </Modal>
      )}
      {postModal && (
        <Modal title={postModal._id ? "Editar post" : "Nuevo post"} onClose={() => setPostModal(null)}>
          <PostForm initial={postModal} onSave={savePost} onClose={() => setPostModal(null)} />
        </Modal>
      )}

      <div className="p-6 max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">Configuración</h1>
          <p className="text-zinc-500 text-sm">Gestiona el portafolio y el blog de la web pública.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-zinc-800/60 rounded-xl p-1 mb-6 w-fit">
          <button
            onClick={() => setTab("portafolio")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === "portafolio" ? "bg-zinc-700 text-white" : "text-zinc-400 hover:text-white"}`}
          >
            <Globe size={15} /> Portafolio
          </button>
          <button
            onClick={() => setTab("blog")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === "blog" ? "bg-zinc-700 text-white" : "text-zinc-400 hover:text-white"}`}
          >
            <BookOpen size={15} /> Blog
          </button>
        </div>

        {/* ═══ PORTAFOLIO TAB ═══ */}
        {tab === "portafolio" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-zinc-400 text-sm">{projects.length} proyecto{projects.length !== 1 ? "s" : ""}</p>
              <button
                onClick={() => setProjectModal({ ...EMPTY_PROJECT })}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Plus size={15} /> Nuevo proyecto
              </button>
            </div>

            {loadingProjects ? (
              <div className="flex items-center justify-center py-20 text-zinc-500">
                <Loader2 size={22} className="animate-spin" />
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-20 text-zinc-500 text-sm">
                No hay proyectos todavía. Crea el primero.
              </div>
            ) : (
              <div className="rounded-xl border border-zinc-800 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-800 bg-zinc-800/40">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Proyecto</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Categoría</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Año</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Estado</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((p, i) => (
                      <tr key={p._id} className={`border-b border-zinc-800/60 hover:bg-zinc-800/30 transition-colors ${i === projects.length - 1 ? "border-b-0" : ""}`}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-8 rounded-lg flex-shrink-0 overflow-hidden" style={{ background: p.bg }}>
                              {p.image && <img src={p.image} alt={p.name} className="w-full h-full object-cover" />}
                            </div>
                            <div>
                              <p className="text-white font-medium leading-tight">{p.name}</p>
                              <p className="text-zinc-500 text-xs">{p.client}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded text-xs font-medium bg-zinc-700 text-zinc-300">{p.category}</span>
                        </td>
                        <td className="px-4 py-3 text-zinc-400">{p.year}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${p.status === "Activo" ? "bg-green-900/50 text-green-400" : p.status === "En progreso" ? "bg-amber-900/50 text-amber-400" : "bg-zinc-700 text-zinc-300"}`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setProjectModal({ ...p })}
                              className="p-1.5 text-zinc-500 hover:text-blue-400 hover:bg-blue-900/20 rounded-lg transition-colors"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => deleteProject(p._id!)}
                              disabled={deletingProject === p._id}
                              className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-40"
                            >
                              {deletingProject === p._id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ═══ BLOG TAB ═══ */}
        {tab === "blog" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-zinc-400 text-sm">{posts.length} post{posts.length !== 1 ? "s" : ""}</p>
              <button
                onClick={() => setPostModal({ ...EMPTY_POST })}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Plus size={15} /> Nuevo post
              </button>
            </div>

            {loadingPosts ? (
              <div className="flex items-center justify-center py-20 text-zinc-500">
                <Loader2 size={22} className="animate-spin" />
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-20 text-zinc-500 text-sm">
                No hay posts todavía. Crea el primero.
              </div>
            ) : (
              <div className="rounded-xl border border-zinc-800 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-800 bg-zinc-800/40">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Título</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Categoría</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Fecha</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Estado</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {posts.map((p, i) => (
                      <tr key={p._id} className={`border-b border-zinc-800/60 hover:bg-zinc-800/30 transition-colors ${i === posts.length - 1 ? "border-b-0" : ""}`}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg flex-shrink-0" style={{ background: p.bg }} />
                            <div>
                              <p className="text-white font-medium leading-tight line-clamp-1">{p.title}</p>
                              <p className="text-zinc-500 text-xs">{p.read} lectura</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded text-xs font-medium bg-zinc-700 text-zinc-300">{p.cat}</span>
                        </td>
                        <td className="px-4 py-3 text-zinc-400 text-xs">{p.date}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            {p.published
                              ? <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-900/50 text-green-400">Publicado</span>
                              : <span className="px-2 py-0.5 rounded text-xs font-medium bg-zinc-700 text-zinc-400">Borrador</span>
                            }
                            {p.featured && (
                              <span className="px-2 py-0.5 rounded text-xs font-medium bg-amber-900/40 text-amber-400">Destacado</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setPostModal({ ...p })}
                              className="p-1.5 text-zinc-500 hover:text-blue-400 hover:bg-blue-900/20 rounded-lg transition-colors"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => deletePost(p._id!)}
                              disabled={deletingPost === p._id}
                              className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-40"
                            >
                              {deletingPost === p._id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
