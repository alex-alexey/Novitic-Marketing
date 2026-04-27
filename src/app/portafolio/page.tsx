"use client";

import { useState, useEffect } from "react";
import SiteHeader from "@/components/SiteHeader";

/* ════════════════════════════ TYPES ════════════════════════════ */

interface Project {
  _id: string;
  name: string;
  tagline: string;
  category: string;
  year: number;
  bg: string;
  image: string;
  client: string;
  tech: string;
  status: string;
  desc: string;
  link: string;
}

const PF_FILTERS = ["Todos", "Desarrollo Web", "Branding", "Servicios IT"];

const STATS = [
  { value: "50+", label: "Proyectos entregados" },
  { value: "30+", label: "Clientes activos" },
  { value: "98%", label: "Satisfacción" },
  { value: "5★",  label: "Valoración media" },
];

/* ════════════════════════════ PAGE ════════════════════════════ */

export default function PortafolioPage() {
  const [projects, setProjects]         = useState<Project[]>([]);
  const [loading, setLoading]           = useState(true);
  const [pfFilter, setPfFilter]         = useState("Todos");
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data) => { setProjects(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    document.body.style.overflow = activeProject ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [activeProject]);

  const filtered = projects.filter((p) => pfFilter === "Todos" || p.category === pfFilter);

  return (
    <>
      <SiteHeader />

      {/* ══ MODAL ══ */}
      {activeProject && (
        <div
          className="pf-popup-overlay"
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveProject(null)}
        >
          <div className="pf-popup" onClick={(e) => e.stopPropagation()}>
            <div className="pf-popup-topbar">
              <span className="pf-popup-num">
                {String(projects.findIndex((p) => p._id === activeProject._id) + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
              </span>
              <button className="pf-popup-close" onClick={() => setActiveProject(null)} aria-label="Cerrar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div
              className="pf-popup-hero"
              style={{
                background: activeProject.bg,
                ...(activeProject.image ? { backgroundImage: `url(${activeProject.image})`, backgroundSize: "cover", backgroundPosition: "center" } : {}),
              }}
            >
              <div className="pf-popup-hero-inner">
                <span className="pf-popup-tag">{activeProject.category}</span>
                <h2 className="pf-popup-title">{activeProject.name}</h2>
                <p className="pf-popup-subtitle">{activeProject.tagline}</p>
              </div>
            </div>

            <div className="pf-popup-body">
              <div className="pf-popup-meta">
                {[
                  { label: "Cliente",      value: activeProject.client },
                  { label: "Año",          value: String(activeProject.year) },
                  { label: "Tecnologías",  value: activeProject.tech },
                  { label: "Estado",       value: activeProject.status },
                ].map((item) => (
                  <div className="pf-popup-meta-item" key={item.label}>
                    <span className="pf-popup-meta-label">{item.label}</span>
                    <span className="pf-popup-meta-value">{item.value}</span>
                  </div>
                ))}
              </div>
              <p className="pf-popup-desc">{activeProject.desc}</p>
              {activeProject.link !== "#" && (
                <a href={activeProject.link} target="_blank" rel="noopener noreferrer" className="pf-popup-cta">
                  Ver proyecto en vivo
                  <svg viewBox="0 0 14 15" fill="none">
                    <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      <main className="relative min-h-screen bg-[#050505] text-white">

        {/* ══ HERO ══ */}
        <section className="pt-40 pb-20 px-6 max-w-6xl mx-auto">
          <p className="text-xs font-bold tracking-[0.2em] text-[#22d3ee] uppercase mb-5">Nuestro trabajo</p>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-6" style={{ letterSpacing: "-0.03em" }}>
            Portafolio
          </h1>
          <p className="text-white/40 text-lg max-w-xl leading-relaxed">
            Proyectos entregados para empresas de España y Europa en desarrollo web, branding y soporte informático.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-px mt-16 border border-white/8 rounded-2xl overflow-hidden">
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col items-center justify-center py-8 px-4 bg-white/[0.02] text-center">
                <span className="text-3xl font-black text-[#22d3ee] mb-1">{s.value}</span>
                <span className="text-white/40 text-xs font-medium tracking-wide">{s.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ══ FILTROS + GRID ══ */}
        <section className="pb-32 px-6 max-w-6xl mx-auto">
          <div className="pf-filters mb-10">
            {PF_FILTERS.map((f) => (
              <button
                key={f}
                className={`pf-filter-btn${pfFilter === f ? " active" : ""}`}
                onClick={() => setPfFilter(f)}
              >
                {f}
                {f !== "Todos" && (
                  <span style={{ marginLeft: "0.4rem", fontSize: "0.62rem", opacity: 0.55, fontWeight: 600 }}>
                    ({projects.filter((p) => p.category === f).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-32 text-white/30 text-sm gap-3">
              <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20" />
              </svg>
              Cargando proyectos…
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-white/30 text-center py-24 text-sm">
              {projects.length === 0 ? "Todavía no hay proyectos publicados." : "No hay proyectos en esta categoría."}
            </p>
          ) : (
            <div className="pf-grid">
              {filtered.map((p) => (
                <div key={p._id} className="pf-item" onClick={() => setActiveProject(p)}>
                  <div className="pf-mask"><div className="pf-mask-inner" /></div>
                  <div className="pf-image">
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.name}
                        className="pf-placeholder"
                        style={{ width: "80%", aspectRatio: "16/10", objectFit: "cover", borderRadius: "0.5rem" }}
                      />
                    ) : (
                      <div className="pf-placeholder" style={{ background: p.bg, width: "80%", aspectRatio: "16/10" }} />
                    )}
                  </div>
                  <div className="pf-inner">
                    <div className="pf-left">
                      <div>
                        <p className="pf-name">{p.name}</p>
                        <span className="pf-tagline">{p.tagline}</span>
                      </div>
                      <p className="pf-year">{p.year}</p>
                    </div>
                    <div className="pf-right">
                      <span className="pf-tag">{p.category}</span>
                      <div className="pf-cta">
                        <svg viewBox="0 0 20 20" fill="none">
                          <path d="M10 0c.423 0 .766.343.766.766v8.467h8.468a.766.766 0 1 1 0 1.533h-8.468v8.468a.766.766 0 1 1-1.532 0l-.001-8.468H.766a.766.766 0 0 1 0-1.532l8.467-.001V.766A.768.768 0 0 1 10 0Z" fill="currentColor" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ══ CTA ══ */}
        <section className="border-t border-white/8 py-24 px-6 text-center">
          <p className="text-xs font-bold tracking-[0.2em] text-[#22d3ee] uppercase mb-4">¿Tienes un proyecto?</p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6" style={{ letterSpacing: "-0.02em" }}>Hablemos</h2>
          <p className="text-white/40 max-w-md mx-auto mb-10 leading-relaxed">Cuéntanos qué necesitas y te preparamos una propuesta en 24 horas.</p>
          <a href="/#contacto" className="inline-flex items-center gap-3 px-8 py-4 bg-[#22d3ee] text-black font-bold text-sm rounded-full hover:bg-white transition-colors">
            Contacto rápido
            <svg viewBox="0 0 14 15" fill="none" width="12" height="12">
              <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor" />
            </svg>
          </a>
        </section>

        <footer className="border-t border-white/8 py-8 px-6">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/20 text-xs">© 2025 Novitic. Todos los derechos reservados.</p>
            <div className="flex gap-6 text-white/30 text-xs">
              <a href="/servicios-it"   className="hover:text-white transition-colors">Servicios IT</a>
              <a href="/desarrollo-web" className="hover:text-white transition-colors">Desarrollo Web</a>
              <a href="/#contacto"      className="hover:text-white transition-colors">Contacto</a>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
