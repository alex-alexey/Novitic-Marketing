"use client";

import { useState, useEffect } from "react";
import SiteHeader from "@/components/SiteHeader";

/* ════════════════════════════ TYPES ════════════════════════════ */

interface Post {
  _id: string;
  title: string;
  slug: string;
  cat: string;
  excerpt: string;
  date: string;
  read: string;
  featured: boolean;
  published: boolean;
  bg: string;
}

const CATEGORIES = ["Todos", "Servicios IT", "Desarrollo Web", "SEO", "Diseño Web", "Seguridad", "E-commerce"];

function Arrow() {
  return (
    <svg viewBox="0 0 14 15" fill="none" width="12" height="12">
      <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor" />
    </svg>
  );
}

/* ════════════════════════════ PAGE ════════════════════════════ */

export default function BlogPage() {
  const [posts, setPosts]   = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat]       = useState("Todos");

  useEffect(() => {
    fetch("/api/posts?published=true")
      .then((r) => r.json())
      .then((data) => { setPosts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = posts.filter((p) => cat === "Todos" || p.cat === cat);
  const [featured, ...rest] = filtered;

  return (
    <>
      <SiteHeader />

      <main className="relative min-h-screen bg-[#050505] text-white">

        {/* ══ HERO ══ */}
        <section className="pt-40 pb-16 px-6 max-w-6xl mx-auto">
          <p className="text-xs font-bold tracking-[0.2em] text-[#22d3ee] uppercase mb-5">Actualidad</p>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-5" style={{ letterSpacing: "-0.03em" }}>
            Blog
          </h1>
          <p className="text-white/40 text-lg max-w-xl leading-relaxed">
            Consejos, guías y novedades sobre tecnología, diseño web y marketing digital para empresas en Barcelona.
          </p>
        </section>

        {/* ══ FILTROS ══ */}
        <div className="px-6 max-w-6xl mx-auto mb-10">
          <div className="pf-filters">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                className={`pf-filter-btn${cat === c ? " active" : ""}`}
                onClick={() => setCat(c)}
              >
                {c}
                {c !== "Todos" && (
                  <span style={{ marginLeft: "0.4rem", fontSize: "0.62rem", opacity: 0.55, fontWeight: 600 }}>
                    ({posts.filter((p) => p.cat === c).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ══ CONTENIDO ══ */}
        <section className="pb-32 px-6 max-w-6xl mx-auto">

          {loading && (
            <div className="flex items-center justify-center py-32 text-white/30 text-sm gap-3">
              <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20" />
              </svg>
              Cargando artículos…
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <p className="text-white/30 text-center py-24 text-sm">
              {posts.length === 0 ? "Todavía no hay artículos publicados." : "No hay artículos en esta categoría."}
            </p>
          )}

          {!loading && featured && (
            <article
              className="group relative rounded-2xl overflow-hidden border border-white/7 bg-[#0d0d0d] mb-6 cursor-pointer transition-all duration-300 hover:border-[rgba(34,211,238,0.35)]"
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}
            >
              <div className="relative overflow-hidden" style={{ minHeight: "22rem" }}>
                <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105" style={{ background: featured.bg }} />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to right, transparent 60%, #0d0d0d 100%)" }} />
                <span
                  className="absolute top-5 left-5 text-[0.58rem] font-[800] tracking-[0.12em] uppercase px-[0.55rem] py-[0.2rem] rounded-[0.35rem]"
                  style={{ color: "#22d3ee", border: "1px solid rgba(34,211,238,0.28)" }}
                >
                  {featured.featured ? "Destacado · " : ""}{featured.cat}
                </span>
              </div>
              <div className="flex flex-col justify-center p-10">
                <p className="text-[0.62rem] font-[800] tracking-[0.18em] uppercase text-[#22d3ee] mb-4">
                  {featured.date} · {featured.read} lectura
                </p>
                <h2 className="font-[900] leading-tight mb-4 text-white" style={{ fontSize: "clamp(1.3rem, 2.2vw, 2rem)", letterSpacing: "-0.025em" }}>
                  {featured.title}
                </h2>
                <p className="text-white/40 text-sm leading-relaxed mb-8">{featured.excerpt}</p>
                <span className="inline-flex items-center gap-2 text-[0.75rem] font-[700] text-[#22d3ee] group-hover:gap-3 transition-all">
                  Leer artículo <Arrow />
                </span>
              </div>
            </article>
          )}

          {!loading && rest.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(18rem, 1fr))", gap: "1.25rem" }}>
              {rest.map((post) => (
                <article
                  key={post._id}
                  className="group relative rounded-xl overflow-hidden border border-white/7 bg-[#0d0d0d] cursor-pointer flex flex-col transition-all duration-300 hover:border-[rgba(34,211,238,0.3)]"
                >
                  <div className="relative overflow-hidden" style={{ height: "10rem" }}>
                    <div className="absolute inset-0 transition-transform duration-600 group-hover:scale-105" style={{ background: post.bg }} />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 50%, #0d0d0d 100%)" }} />
                  </div>
                  <div className="flex flex-col flex-1 p-5">
                    <p className="text-[0.56rem] font-[800] tracking-[0.12em] uppercase text-[#22d3ee] mb-2">{post.cat}</p>
                    <h3 className="font-[700] text-white leading-snug mb-3 flex-1" style={{ fontSize: "0.88rem", letterSpacing: "-0.01em" }}>
                      {post.title}
                    </h3>
                    <p className="text-white/35 text-[0.75rem] leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-[0.62rem] text-white/28">{post.date} · {post.read}</p>
                      <span className="text-[#22d3ee] opacity-0 group-hover:opacity-100 transition-opacity"><Arrow /></span>
                    </div>
                  </div>
                </article>
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
            Contacto rápido <Arrow />
          </a>
        </section>

        <footer className="border-t border-white/8 py-8 px-6">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/20 text-xs">© 2025 Novitic. Todos los derechos reservados.</p>
            <div className="flex gap-6 text-white/30 text-xs">
              <a href="/servicios-it"   className="hover:text-white transition-colors">Servicios IT</a>
              <a href="/desarrollo-web" className="hover:text-white transition-colors">Desarrollo Web</a>
              <a href="/portafolio"     className="hover:text-white transition-colors">Portafolio</a>
              <a href="/#contacto"      className="hover:text-white transition-colors">Contacto</a>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
