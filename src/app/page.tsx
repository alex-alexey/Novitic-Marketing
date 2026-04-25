"use client";
import React, { useState, useEffect, useRef } from "react";

import dynamic from "next/dynamic";
import { LogoSplash } from "../components/LogoSplash";

const PF_FILTERS = ["Todos", "Desarrollo Web"];

const PROJECTS = [
  {
    id: 1,
    name: "Aprados Agente Inmobiliario",
    tagline: "Web corporativa, branding completo, CRM y posicionamiento SEO para agencia inmobiliaria.",
    category: "Desarrollo Web",
    year: 2024,
    bg: "linear-gradient(135deg,#0a1628,#112240)",
    client: "Aprados",
    tech: "WordPress, Elementor, PHP, MySQL",
    status: "Completado",
    desc: "Desarrollo completo para agencia inmobiliaria: diseño y desarrollo web en WordPress con catálogo de propiedades, identidad de marca (logo, tarjetas de visita y material corporativo), integración de CRM para gestión de clientes y leads, y estrategia de posicionamiento SEO para aumentar la visibilidad orgánica.",
    link: "https://aprados.com",
  },
  {
    id: 2,
    name: "Inmobiliaria Lunallar",
    tagline: "Desarrollo web, mantenimiento informático y gestión de usuarios para agencia inmobiliaria.",
    category: "Desarrollo Web",
    year: 2024,
    bg: "linear-gradient(135deg,#0d2b1a,#1a4a2e)",
    client: "Lunallar",
    tech: "WordPress, Elementor",
    status: "Completado",
    desc: "Diseño y desarrollo de sitio web corporativo en WordPress con Elementor para agencia inmobiliaria. El proyecto incluyó mantenimiento informático continuo y gestión de usuarios para que el equipo pueda administrar el contenido y las propiedades de forma autónoma.",
    link: "#",
  },
  {
    id: 3,
    name: "Clínica Dental Serramar",
    tagline: "Web con sistema de citas online, SEO local y branding para clínica dental en Castelldefels.",
    category: "Desarrollo Web",
    year: 2025,
    bg: "linear-gradient(135deg,#1a0a28,#2d1245)",
    client: "Clínica Dental Serramar",
    tech: "WordPress, WooCommerce, Google My Business",
    status: "Completado",
    desc: "Diseño y desarrollo de sitio web profesional para clínica dental en Castelldefels. Incluye sistema de reserva de citas online, página de servicios optimizada para SEO local (Baix Llobregat), integración con Google My Business y rediseño de identidad visual corporativa para diferenciarse de la competencia.",
    link: "#",
  },
  {
    id: 4,
    name: "Taller Mecànic Vilafranca",
    tagline: "Presencia digital completa para taller de automóviles: web, Google Ads y gestión informática.",
    category: "Desarrollo Web",
    year: 2025,
    bg: "linear-gradient(135deg,#1a1200,#3a2800)",
    client: "Taller Mecànic Vilafranca",
    tech: "WordPress, Google Ads, Microsoft 365",
    status: "Completado",
    desc: "Proyecto integral para taller mecánico en Vilafranca del Penedès: desarrollo de web corporativa con catálogo de servicios y formulario de presupuesto, configuración y gestión de campañas Google Ads para captar clientes locales, y migración completa de su infraestructura informática a Microsoft 365.",
    link: "#",
  },
  {
    id: 5,
    name: "Gestoría Montserrat & Asociados",
    tagline: "Web corporativa multiidioma, área privada de clientes y automatización de documentos para gestoría.",
    category: "Desarrollo Web",
    year: 2025,
    bg: "linear-gradient(135deg,#0a1a1a,#0d3030)",
    client: "Gestoría Montserrat",
    tech: "Next.js, Supabase, Tailwind CSS",
    status: "Completado",
    desc: "Diseño y desarrollo de plataforma web moderna para gestoría en Sant Boi de Llobregat. El proyecto incluyó web corporativa en español y catalán, portal privado para que los clientes suban y descarguen documentos de forma segura, y automatización de notificaciones por email para avisos de vencimientos fiscales.",
    link: "#",
  },
  {
    id: 6,
    name: "Academia de Idiomas Linguo",
    tagline: "Landing page de alta conversión, tienda online de cursos y branding para academia de idiomas.",
    category: "Desarrollo Web",
    year: 2024,
    bg: "linear-gradient(135deg,#1a0a14,#350a28)",
    client: "Academia Linguo",
    tech: "WordPress, WooCommerce, Stripe, Figma",
    status: "Completado",
    desc: "Rediseño completo de identidad visual y desarrollo web para academia de idiomas en Barcelona. Incluye tienda online para la venta de cursos y matrículas con pasarela Stripe, landing pages específicas por idioma optimizadas para SEO, e integración con sistema de gestión de alumnos.",
    link: "#",
  },
];

const SERVICES: { title: string; desc: string; tags: string[]; featured: boolean; icon: React.ReactNode }[] = [
  {
    title: "Mantenimiento Informático",
    desc: "Revisión periódica, actualizaciones de software, limpieza de hardware y optimización del sistema para que tus equipos funcionen siempre al máximo rendimiento, sin interrupciones ni sorpresas.",
    tags: ["Preventivo", "Correctivo", "Periódico"],
    featured: true,
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
  },
  {
    title: "Reparación de Equipos",
    desc: "Diagnóstico profesional y reparación de ordenadores, portátiles y periféricos. Recuperamos tus equipos rápidamente.",
    tags: ["PC", "Portátil", "Mac", "Periféricos"],
    featured: false,
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>,
  },
  {
    title: "Consultoría IT",
    desc: "Asesoramiento estratégico para optimizar tu infraestructura tecnológica y tomar las mejores decisiones para tu negocio.",
    tags: ["Estrategia", "Auditoría", "Planificación"],
    featured: false,
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z"/></svg>,
  },
  {
    title: "Venta de Productos",
    desc: "Hardware, software y licencias seleccionados para tu empresa con asesoramiento personalizado en cada compra.",
    tags: ["Hardware", "Software", "Licencias"],
    featured: false,
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18M16 10a4 4 0 0 1-8 0"/></svg>,
  },
  {
    title: "Backup & Recuperación",
    desc: "Copias de seguridad automáticas y planes de recuperación ante desastres para que nunca pierdas información crítica.",
    tags: ["Cloud", "Local", "Automatizado"],
    featured: false,
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.49"/></svg>,
  },
  {
    title: "Microsoft 365 Admin",
    desc: "Gestión completa de cuentas, licencias, seguridad y productividad en el ecosistema Microsoft 365 para tu empresa.",
    tags: ["Exchange", "Teams", "SharePoint"],
    featured: false,
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  },
  {
    title: "Google Admin",
    desc: "Administración de Gmail, Drive, Meet y toda la suite Google Workspace para optimizar la colaboración en tu equipo.",
    tags: ["Gmail", "Drive", "Meet", "Workspace"],
    featured: false,
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 0 20M12 2a15.3 15.3 0 0 0 0 20"/></svg>,
  },
  {
    title: "Redes & Ciberseguridad",
    desc: "Configuración de redes, VPN, firewall y protección frente a amenazas digitales. Cumplimiento GDPR garantizado.",
    tags: ["Firewall", "VPN", "GDPR", "WiFi"],
    featured: false,
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  },
];

const WEB_SERVICES: { title: string; desc: string; tags: string[]; icon: React.ReactNode }[] = [
  {
    title: "Páginas Web Corporativas",
    desc: "Diseño web profesional para empresas en Barcelona y Sant Boi de Llobregat. Webs rápidas, modernas y optimizadas para convertir visitas en clientes reales.",
    tags: ["WordPress", "Next.js", "Responsive"],
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>,
  },
  {
    title: "Tiendas Online & E-commerce",
    desc: "Tiendas online para vender en Barcelona, toda España y el mundo. Integración de pasarelas de pago, gestión de catálogo y experiencia de compra optimizada.",
    tags: ["WooCommerce", "Shopify", "Stripe"],
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><path d="M3 6h18M16 10a4 4 0 01-8 0"/></svg>,
  },
  {
    title: "Posicionamiento SEO Local",
    desc: "Aparece en Google cuando tus clientes buscan en Barcelona, Sant Boi de Llobregat y el Baix Llobregat. Más visibilidad orgánica, más clientes sin pagar publicidad.",
    tags: ["SEO Barcelona", "Google Maps", "Analytics"],
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/><path d="M11 8v6M8 11h6"/></svg>,
  },
  {
    title: "Landing Pages de Conversión",
    desc: "Páginas de aterrizaje diseñadas para maximizar resultados en campañas de Google Ads y Meta Ads en Barcelona y área metropolitana.",
    tags: ["CRO", "Google Ads", "A/B Testing"],
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
  },
  {
    title: "Diseño UI/UX & Branding",
    desc: "Identidad visual y experiencia de usuario que diferencian tu marca en Barcelona. Diseño coherente, memorable y alineado con los valores de tu negocio.",
    tags: ["Figma", "Identidad corporativa", "Branding"],
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>,
  },
  {
    title: "Mantenimiento & Soporte Web",
    desc: "Mantenemos tu página web actualizada, segura y funcionando sin interrupciones. Soporte técnico continuo para empresas de Barcelona y Sant Boi de Llobregat.",
    tags: ["Hosting", "SSL", "Backups automáticos"],
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>,
  },
];

const PRINCIPLES: { num: string; title: string; desc: string; icon: React.ReactNode }[] = [
  {
    num: "01",
    title: "Calidad",
    desc: "Calidad y rendimiento no son casualidad; definen cada acción que tomamos. La excelencia es la única garantía de éxito a largo plazo.",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  },
  {
    num: "02",
    title: "Integridad",
    desc: "Principios morales sólidos en cada área de actividad. La honestidad y la transparencia con nuestros clientes nos define como empresa.",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>,
  },
  {
    num: "03",
    title: "Precio justo",
    desc: "Nos enorgullece una estimación y presupuestación equitativa. No pagarás poco ni mucho, barato ni caro, sino exactamente lo que vale.",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  },
  {
    num: "04",
    title: "Innovación",
    desc: "La innovación forma parte de nuestro ADN. En Novitic creemos que el éxito pertenece a los valientes, por eso no tememos implementar ideas visionarias del futuro.",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  },
];

const ParticlesBg = dynamic(() => import("../components/ParticlesBg"), { ssr: false });


const NAV_LINKS = [
  { href: "#servicios-it",   label: "Servicios IT" },
  { href: "#desarrollo-web", label: "Desarrollo Web" },
  { href: "#portafolio",     label: "Portafolio" },
  { href: "#equipo",         label: "Equipo" },
  { href: "#blog",           label: "Blog" },
];

export default function HomePage() {
  const principiosRef = useRef<HTMLElement>(null);
  const [showSplash, setShowSplash] = useState(true);
  const [contentVisible, setContentVisible] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [time, setTime] = useState("");
  const [pfFilter, setPfFilter] = useState("Todos");
  const [activeProject, setActiveProject] = useState<typeof PROJECTS[0] | null>(null);
  const [activeService, setActiveService] = useState<number>(0);
  const [activePrinciple, setActivePrinciple] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setContentVisible(true), 2200);
    const t2 = setTimeout(() => setShowSplash(false), 3300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const t = new Date();
      setTime(t.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }));
    };
    updateTime();
    const iv = setInterval(updateTime, 1000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = activeProject ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [activeProject]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setActiveProject(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Observer global para data-reveal / reveal-stagger
  useEffect(() => {
    if (!contentVisible) return;
    const els = Array.from(document.querySelectorAll("[data-reveal]"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const delay = Number(el.dataset.delay ?? 0);
          const apply = () => el.classList.add("revealed");
          delay ? setTimeout(apply, delay) : apply();
          io.unobserve(el);
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [contentVisible]);

  useEffect(() => {
    const section = principiosRef.current;
    if (!section) return;
    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const scrolled = -rect.top;
      const total = section.offsetHeight - window.innerHeight;
      if (scrolled <= 0) { setActivePrinciple(0); return; }
      if (scrolled >= total) { setActivePrinciple(3); return; }
      // Reserva 8% al inicio y 8% al final sin cambios,
      // distribuye los 4 principios en el 84% central.
      const pad = 0.08;
      const progress = Math.max(0, Math.min(1, (scrolled / total - pad) / (1 - pad * 2)));
      setActivePrinciple(Math.min(3, Math.floor(progress * 4)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
  {showSplash && <LogoSplash />}
      <ParticlesBg />

      <svg aria-hidden="true" style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <filter id="hdr-glow" x="-.25" y="-.25" width="1.5" height="1.5">
            <feComponentTransfer><feFuncA type="table" tableValues="0 2 0" /></feComponentTransfer>
            <feGaussianBlur stdDeviation="2" />
            <feComponentTransfer result="rond"><feFuncA type="table" tableValues="-2 3" /></feComponentTransfer>
            <feMorphology operator="dilate" radius="3" />
            <feGaussianBlur stdDeviation="6" />
            <feBlend in="rond" result="glow" />
            <feComponentTransfer in="SourceGraphic"><feFuncA type="table" tableValues="0 0 1" /></feComponentTransfer>
            <feBlend in2="glow" />
          </filter>
        </defs>
      </svg>

      {/* ==================== HEADER ==================== */}
      <header className={`hdr-wrap${scrolled ? " scrolled" : ""}`}>
        <div className="hdr-inner">
          <div className="hdr-left hdr-glow-border">
            <div className="hdr-left-inner">
              <a href="/" className="hdr-logo">
                <img src="/novitic-logo.png" alt="Novitic" width={52} height={52} />
              </a>
              <nav className={`hdr-nav${contentVisible ? " hdr-nav-visible" : ""}`}>
                {NAV_LINKS.map((item) => (
                  <a key={item.href} href={item.href} className="hdr-nav-link">
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          </div>

          <div className={`hdr-right${contentVisible ? " hdr-right-visible" : ""}`}>
            <div className="hdr-time">
              Madrid, España <span>{time}</span>
            </div>

            <a href="tel:+34600000000" className="hdr-phone-btn" aria-label="Teléfono">
              <svg viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.77 4.63a5.37 5.37 0 0 1 3.59 3.59M12.77 1a8.21 8.21 0 0 1 7.23 7.21M19.09 15.45v2.73a1.82 1.82 0 0 1-1.98 1.82 18.02 18.02 0 0 1-7.86-2.79 17.75 17.75 0 0 1-5.46-5.46 18.02 18.02 0 0 1-2.79-7.9A1.82 1.82 0 0 1 2.82 1.9H5.55a1.82 1.82 0 0 1 1.82 1.57c.115.875.33 1.734.64 2.56a1.82 1.82 0 0 1-.41 1.92L6.44 9.09a14.56 14.56 0 0 0 5.46 5.46l1.04-1.04a1.82 1.82 0 0 1 1.92-.41c.826.31 1.685.525 2.56.64a1.82 1.82 0 0 1 1.57 1.75z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>

            <a href="#contacto" className="hdr-special-btn hdr-glow-border">
              <span style={{ fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.04em" }}>
                contacto rápido
              </span>
              <span className="hdr-btn-circle">
                <svg className="hdr-btn-icon" viewBox="0 0 14 15" fill="none">
                  <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor"/>
                </svg>
                <svg className="hdr-btn-icon hdr-btn-icon-copy" viewBox="0 0 14 15" fill="none">
                  <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor"/>
                </svg>
              </span>
            </a>

            <button
              className={`hdr-hamburger${mobileMenu ? " open" : ""}`}
              onClick={() => setMobileMenu(!mobileMenu)}
              aria-label="Toggle menu"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>

      {/* Overlay backdrop menú móvil */}
      <div
        className={`hdr-mobile-overlay${mobileMenu ? " active" : ""}`}
        onClick={() => setMobileMenu(false)}
      />

      {/* Panel menú móvil */}
      <div className={`hdr-mobile-menu${mobileMenu ? " active" : ""}`}>
        {NAV_LINKS.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="hdr-mobile-nav-link"
            onClick={() => setMobileMenu(false)}
          >
            {item.label}
          </a>
        ))}
        <a href="#contacto" className="hdr-mobile-cta" onClick={() => setMobileMenu(false)}>
          Contacto rápido
        </a>
        <a href="tel:+34600000000" className="hdr-mobile-tel" onClick={() => setMobileMenu(false)}>
          <svg viewBox="0 0 21 21" fill="none">
            <path d="M12.77 4.63a5.37 5.37 0 0 1 3.59 3.59M12.77 1a8.21 8.21 0 0 1 7.23 7.21M19.09 15.45v2.73a1.82 1.82 0 0 1-1.98 1.82 18.02 18.02 0 0 1-7.86-2.79 17.75 17.75 0 0 1-5.46-5.46 18.02 18.02 0 0 1-2.79-7.9A1.82 1.82 0 0 1 2.82 1.9H5.55a1.82 1.82 0 0 1 1.82 1.57c.115.875.33 1.734.64 2.56a1.82 1.82 0 0 1-.41 1.92L6.44 9.09a14.56 14.56 0 0 0 5.46 5.46l1.04-1.04a1.82 1.82 0 0 1 1.92-.41c.826.31 1.685.525 2.56.64a1.82 1.82 0 0 1 1.57 1.75z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          +34 600 000 000
        </a>
      </div>

      {/* ==================== POPUP PORTAFOLIO ==================== */}
      {activeProject && (
        <div
          className="pf-popup-overlay"
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveProject(null)}
        >
          <div className="pf-popup" onClick={(e) => e.stopPropagation()}>

            {/* Contador + cerrar */}
            <div className="pf-popup-topbar">
              <span className="pf-popup-num">
                {String(activeProject.id).padStart(2, "0")} / {String(PROJECTS.length).padStart(2, "0")}
              </span>
              <button className="pf-popup-close" onClick={() => setActiveProject(null)} aria-label="Cerrar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Hero con gradiente del proyecto */}
            <div className="pf-popup-hero" style={{ background: activeProject.bg }}>
              <div className="pf-popup-hero-inner">
                <span className="pf-popup-tag">{activeProject.category}</span>
                <h2 className="pf-popup-title">{activeProject.name}</h2>
                <p className="pf-popup-subtitle">{activeProject.tagline}</p>
              </div>
            </div>

            {/* Cuerpo */}
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
                    <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor"/>
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      )}

  <main className={`relative min-h-screen bg-[#050505] text-white transition-opacity duration-700 ${contentVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>


        {/* ==================== HERO ==================== */}
        <section className="hero-section">

          {/* Grid: texto izquierda / showcase derecha */}
          <div className="hero-grid">

            {/* ── Columna izquierda: texto ── */}
            <div className="hero-text">
              <div className="hero-eyebrow">
                <span className="hero-eyebrow-dot" />
                Barcelona · Sant Boi de Llobregat
              </div>

              <h1 className="hero-h1">
                <span className="hero-h1-cyan">Empresa IT<br />&amp; Diseño Web</span><br />
                profesional
              </h1>

              <p className="hero-sub">
                Servicios informáticos y páginas web para empresas en Barcelona, Sant Boi de Llobregat y el Baix Llobregat.
              </p>

              <div className="hero-actions">
                <a href="#contacto" className="hero-cta-primary">Quiero mi web única</a>
                <a href="#portafolio" className="hero-cta-ghost">Ver portafolio</a>
              </div>

              {/* Tech badges */}
              <div className="hero-badges">
                {[
                  { label: "Windows", icon: <svg viewBox="0 0 23 23" width="18" height="18"><path fill="#f25022" d="M0 0h11v11H0z"/><path fill="#00a4ef" d="M12 0h11v11H12z"/><path fill="#7fba00" d="M0 12h11v11H0z"/><path fill="#ffb900" d="M12 12h11v11H12z"/></svg> },
                  { label: "Azure", icon: <svg viewBox="0 0 96 96" width="18" height="18"><defs><linearGradient id="az1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#114A8B"/><stop offset="100%" stopColor="#0669BC"/></linearGradient><linearGradient id="az2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#3CCBF4"/><stop offset="100%" stopColor="#2892DF"/></linearGradient></defs><path d="M33.34 6h26.04L31.5 90H7.26L33.34 6z" fill="url(#az1)"/><path d="M60.3 6L39.5 52.27l20.07 23.73H88.5L60.3 6z" fill="url(#az2)"/></svg> },
                  { label: "Microsoft 365", icon: <svg viewBox="0 0 23 23" width="18" height="18"><path fill="#f25022" d="M0 0h11v11H0z"/><path fill="#00a4ef" d="M12 0h11v11H12z"/><path fill="#7fba00" d="M0 12h11v11H0z"/><path fill="#ffb900" d="M12 12h11v11H12z"/></svg> },
                  { label: "Google Workspace", icon: <svg viewBox="0 0 24 24" width="18" height="18"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg> },
                  { label: "macOS", icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="white"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.15-2.19 1.35-2.16 4.02.03 3.2 2.81 4.27 2.84 4.28-.03.07-.44 1.51-1.43 3.27z"/><path d="M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg> },
                  { label: "WordPress", icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="#21759b"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM3.9 12c0-.9.15-1.77.43-2.57L8.2 21.3A9.1 9.1 0 013.9 12zm8.1 9.1a9.1 9.1 0 01-2.59-.37l2.75-7.98 2.82 7.72c.02.05.04.09.07.14A9.1 9.1 0 0112 21.1zm1.27-12.47c.55-.03 1.05-.09 1.05-.09.5-.06.44-.79-.06-.77 0 0-1.48.12-2.44.12-.9 0-2.4-.12-2.4-.12-.5-.03-.56.73-.06.77 0 0 .47.06.97.09l1.44 3.94-2.02 6.07-3.36-9.97c.55-.03 1.05-.09 1.05-.09.5-.06.44-.79-.06-.77 0 0-1.48.12-2.44.12l-.44-.01A9.1 9.1 0 0112 2.9a9.1 9.1 0 016.92 3.21 3.28 3.28 0 01-.2.01c-.9 0-1.53.78-1.53 1.62 0 .75.44 1.39.9 2.14.35.61.76 1.39.76 2.52 0 .78-.3 1.69-.7 2.95l-.91 3.05-3.33-9.77zm4.64 10.44l2.8-8.09c.52-1.3.7-2.34.7-3.26 0-.33-.02-.64-.07-.92A9.1 9.1 0 0120.1 12a9.1 9.1 0 01-2.19 5.87z"/></svg> },
                  { label: "Linux", icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm4 0h-2v-2h2v2zm1-5.5c-.28.5-.78.9-1.38 1.06L14 12v1h-4v-1l-.62-.44C8.78 11.4 8.28 11 8 10.5 7.64 9.84 7.5 9.14 7.5 8.5c0-2.49 2.01-4.5 4.5-4.5s4.5 2.01 4.5 4.5c0 .64-.14 1.34-.5 2z"/></svg> },
                ].map((b, i) => (
                  <div key={b.label} className="hero-badge" style={{ animationDelay: `${i * 0.12}s` }}>
                    {b.icon}
                    <span>{b.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Columna derecha: showcase de dispositivos ── */}
            <div className="hero-showcase" aria-hidden="true">

              {/* Laptop mockup */}
              <div className="hero-laptop hero-float-a">
                <div className="hero-laptop-screen">
                  <div className="hero-laptop-cam" />
                  <div className="hero-laptop-content">
                    {/* Nav bar with real logo */}
                    <div className="hero-laptop-nav">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/novitic-logo.png" alt="Novitic" className="hero-laptop-nav-logo" />
                      <div style={{ display:"flex", gap:4 }}>
                        {[1,2,3].map(i=><div key={i} className="hero-laptop-nav-dot" />)}
                      </div>
                    </div>
                    {/* Hero area: logo centrado como en una web real */}
                    <div className="hero-laptop-hero-area">
                      <div className="hero-laptop-glow" />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/novitic-logo.png" alt="Novitic" className="hero-laptop-logo-img" />
                      <div className="hero-laptop-line" style={{ width:"60%", margin:"0 auto 5px" }} />
                      <div className="hero-laptop-line" style={{ width:"40%", margin:"0 auto 8px" }} />
                      <div className="hero-laptop-btn" style={{ margin:"0 auto" }} />
                    </div>
                    <div className="hero-laptop-cards">
                      {[1,2,3].map(i=><div key={i} className="hero-laptop-card" />)}
                    </div>
                  </div>
                </div>
                <div className="hero-laptop-hinge" />
                <div className="hero-laptop-base">
                  <div className="hero-laptop-trackpad" />
                </div>
              </div>

              {/* Phone mockup */}
              <div className="hero-phone hero-float-b">
                <div className="hero-phone-notch" />
                <div className="hero-phone-screen">
                  {/* Header nav del sitio */}
                  <div className="hero-phone-nav">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/novitic-logo.png" alt="Novitic" className="hero-phone-nav-logo" />
                    <div className="hero-phone-hamburger">
                      {[0,1,2].map(i=><div key={i} className="hero-phone-ham-line" />)}
                    </div>
                  </div>
                  {/* Hero area con logo grande centrado */}
                  <div className="hero-phone-hero">
                    <div className="hero-phone-glow" />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/novitic-logo.png" alt="Novitic" className="hero-phone-logo-img" />
                    <div className="hero-phone-line" style={{ width:"70%" }} />
                    <div className="hero-phone-line" style={{ width:"50%" }} />
                    <div className="hero-phone-btn" />
                  </div>
                  {/* Cards de servicios */}
                  <div className="hero-phone-cards">
                    {[1,2].map(i=><div key={i} className="hero-phone-card" />)}
                  </div>
                </div>
              </div>

              {/* Floating tech cards around devices */}
              <div className="hero-float-card hero-fc-1 hero-float-c">
                <svg viewBox="0 0 96 96" width="28" height="28"><defs><linearGradient id="azh1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#114A8B"/><stop offset="100%" stopColor="#0669BC"/></linearGradient><linearGradient id="azh2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#3CCBF4"/><stop offset="100%" stopColor="#2892DF"/></linearGradient></defs><path d="M33.34 6h26.04L31.5 90H7.26L33.34 6z" fill="url(#azh1)"/><path d="M60.3 6L39.5 52.27l20.07 23.73H88.5L60.3 6z" fill="url(#azh2)"/></svg>
                <span>Azure</span>
              </div>

              <div className="hero-float-card hero-fc-2 hero-float-d">
                <svg viewBox="0 0 23 23" width="26" height="26"><path fill="#f25022" d="M0 0h11v11H0z"/><path fill="#00a4ef" d="M12 0h11v11H12z"/><path fill="#7fba00" d="M0 12h11v11H0z"/><path fill="#ffb900" d="M12 12h11v11H12z"/></svg>
                <span>Windows 11</span>
              </div>

              <div className="hero-float-card hero-fc-3 hero-float-a">
                <svg viewBox="0 0 24 24" width="26" height="26"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                <span>Google Workspace</span>
              </div>

              <div className="hero-float-card hero-fc-4 hero-float-b">
                <svg viewBox="0 0 24 24" width="26" height="26" fill="#21759b"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm4 0h-2v-2h2v2zm1-5.5c-.28.5-.78.9-1.38 1.06L14 12v1h-4v-1l-.62-.44C8.78 11.4 8.28 11 8 10.5 7.64 9.84 7.5 9.14 7.5 8.5c0-2.49 2.01-4.5 4.5-4.5s4.5 2.01 4.5 4.5c0 .64-.14 1.34-.5 2z"/></svg>
                <span>WordPress</span>
              </div>

            </div>
          </div>

          {/* Scroll indicator */}
          <div className="hero-scroll-hint">
            SCROLL
            <div className="hero-scroll-line" />
          </div>

        </section>

        {/* ==================== SERVICIOS IT ==================== */}
        <section id="servicios-it" className="py-28 border-t border-white/10">
          <div className="max-w-6xl mx-auto px-6">

            {/* Header asimétrico */}
            <div data-reveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-6 h-px bg-cyan-400" />
                  <span className="text-xs font-bold tracking-widest text-cyan-400 uppercase">Servicios IT</span>
                </div>
                <h2 className="text-5xl font-bold tracking-tight leading-none">
                  Soluciones<br />tecnológicas
                </h2>
              </div>
              <div className="flex flex-col items-start md:items-end gap-3">
                <span className="srv-count-badge">08 servicios</span>
                <p className="text-white/40 max-w-[260px] text-sm leading-relaxed md:text-right">
                  Soporte integral para mantener tu negocio funcionando al máximo rendimiento.
                </p>
              </div>
            </div>

            {/* Grid bento */}
            <div data-reveal data-delay="120" className="srv-grid reveal-stagger">
              {SERVICES.map((s, i) => (
                <div key={i} className={`srv-card${s.featured ? " srv-card--featured" : ""}`}>
                  <span className="srv-wm" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  <div className="srv-top">
                    <div className="srv-icon">{s.icon}</div>
                    <span className="srv-num">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="srv-title">{s.title}</h3>
                  <p className="srv-desc">{s.desc}</p>
                  <div className="srv-tags">
                    {s.tags.map((t) => <span key={t} className="srv-tag">{t}</span>)}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ==================== DESARROLLO WEB ==================== */}
        <section id="desarrollo-web" className="py-28 border-t border-white/10">
          <div className="max-w-6xl mx-auto px-6">

            {/* Header */}
            <div data-reveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-6 h-px bg-cyan-400" />
                  <span className="text-xs font-bold tracking-widest text-cyan-400 uppercase">Desarrollo Web</span>
                </div>
                <h2 className="text-5xl font-bold tracking-tight leading-[1.08]">
                  Diseño web en<br />Barcelona &amp; Sant Boi
                </h2>
              </div>
              <div className="flex flex-col items-start md:items-end gap-3">
                <span className="srv-count-badge">06 servicios</span>
                <p className="text-white/40 max-w-[280px] text-sm leading-relaxed md:text-right">
                  Webs profesionales para empresas del área metropolitana de Barcelona y Baix Llobregat.
                </p>
              </div>
            </div>

            {/* Split layout: acordeón + phone */}
            <div data-reveal data-delay="150" className="dw-split">

              {/* Left: Accordion */}
              <div className="dw-accordion">
                {WEB_SERVICES.map((s, i) => (
                  <div
                    key={i}
                    className={`dw-acc-item${activeService === i ? " open" : ""}`}
                    onClick={() => setActiveService(activeService === i ? -1 : i)}
                  >
                    <div className="dw-acc-head">
                      <span className="dw-acc-num">{String(i + 1).padStart(2, "0")}</span>
                      <div className="dw-acc-icon-box">{s.icon}</div>
                      <h3 className="dw-acc-title">{s.title}</h3>
                      <svg className="dw-acc-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                    <div className="dw-acc-body">
                      <div className="dw-acc-inner">
                        <p className="dw-acc-desc">{s.desc}</p>
                        <div className="dw-acc-tags">
                          {s.tags.map((t) => <span key={t} className="dw-acc-tag">{t}</span>)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right: Phone mockup */}
              <div className="dw-phone-wrap">
                <div className="dw-badge dw-badge-1">⚡ Carga rápida</div>
                <div className="dw-badge dw-badge-2">📱 Responsive</div>
                <div className="dw-badge dw-badge-3">🎯 SEO optimizado</div>
                <div className="dw-phone-glow" />
                <div className="dw-phone">
                  <div className="dw-phone-notch" />
                  <div className="dw-phone-screen">
                    <div className="dw-phone-content">
                      <div className="dw-mock-nav">
                        <div className="dw-mock-logo" />
                        <div className="dw-mock-nav-links">
                          <div className="dw-mock-line short" />
                          <div className="dw-mock-line short" />
                          <div className="dw-mock-line short" />
                        </div>
                      </div>
                      <div className="dw-mock-hero">
                        <div className="dw-mock-line m75 bold" />
                        <div className="dw-mock-line m50" />
                        <div className="dw-mock-btn" />
                      </div>
                      <div className="dw-mock-cards">
                        <div className="dw-mock-card" />
                        <div className="dw-mock-card" />
                        <div className="dw-mock-card" />
                      </div>
                      <div className="dw-mock-section">
                        <div className="dw-mock-line m33 bold" />
                        <div className="dw-mock-line" />
                        <div className="dw-mock-line m80" />
                        <div className="dw-mock-line m66" />
                      </div>
                      <div className="dw-mock-section">
                        <div className="dw-mock-img" />
                        <div className="dw-mock-line" />
                        <div className="dw-mock-line m75" />
                      </div>
                      <div className="dw-mock-footer">
                        <div className="dw-mock-line m50" />
                        <div className="dw-mock-line short" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* Wave Separator */}
        <div className="w-full overflow-hidden -mt-1">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-[90px]">
            <path d="M0 80C360 30 720 110 1080 50C1440 0 1440 0 1440 0V120H0V80Z" fill="#050505" />
          </svg>
        </div>

        {/* ==================== PORTAFOLIO ==================== */}
  <section id="portafolio" className="py-28 bg-[#050505]">
          <div className="max-w-6xl mx-auto px-6">
            <h2 data-reveal className="text-5xl font-bold text-center mb-4 tracking-tight">Portafolio</h2>
            <p data-reveal data-delay="80" className="text-center text-white/50 mb-12">Más de 50 proyectos entregados para clientes de España y Europa.</p>

            {/* Filtros */}
            <div data-reveal data-delay="160" className="pf-filters">
              {PF_FILTERS.map((f) => (
                <button
                  key={f}
                  className={`pf-filter-btn${pfFilter === f ? " active" : ""}`}
                  onClick={() => setPfFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Grid */}
            <div data-reveal data-delay="240" className="pf-grid reveal-stagger">
              {PROJECTS.filter((p) => pfFilter === "Todos" || p.category === pfFilter).map((p) => (
                <div key={p.id} className="pf-item" onClick={() => setActiveProject(p)}>
                  <div className="pf-mask">
                    <div className="pf-mask-inner" />
                  </div>

                  <div className="pf-image">
                    <div className="pf-placeholder" style={{ background: p.bg, width: "80%", aspectRatio: "16/10" }} />
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
                        <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10 0c.423 0 .766.343.766.766v8.467h8.468a.766.766 0 1 1 0 1.533h-8.468v8.468a.766.766 0 1 1-1.532 0l-.001-8.468H.766a.766.766 0 0 1 0-1.532l8.467-.001V.766A.768.768 0 0 1 10 0Z" fill="currentColor"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== NUESTROS PRINCIPIOS ==================== */}
        <section id="principios" className="princ-section" ref={principiosRef}>
          <div className="princ-sticky">

            {/* Header centrado arriba */}
            <div className="princ-hdr">
              <h2 className="princ-h2">
                Nuestros <strong>principios</strong>
              </h2>
            </div>

            {/* Fondo: tira vertical de números que se desplaza */}
            <div className="princ-bg-wrap" aria-hidden="true">
              <div
                className="princ-bg-strip"
                style={{ transform: `translateY(calc(50vh - (${activePrinciple} + 0.6) * 0.88 * 42vw))` }}
              >
                {PRINCIPLES.map((p) => <span key={p.num}>{p.num}</span>)}
              </div>
            </div>

            {/* Stack de tarjetas */}
            <div className="princ-stack">
              {PRINCIPLES.map((p, i) => (
                <div
                  key={p.num}
                  className={`princ-row${activePrinciple === i ? " active" : activePrinciple > i ? " past" : " upcoming"}`}
                >
                  {/* Columna izquierda: icono + título */}
                  <div className="princ-left">
                    <div className="princ-icon">{p.icon}</div>
                    <h3 className="princ-title">{p.title}</h3>
                  </div>

                  {/* Columna central: número grande (focal point como la imagen de Magic5) */}
                  <div className="princ-center">
                    <span className="princ-num-big">{p.num}</span>
                  </div>

                  {/* Columna derecha: descripción */}
                  <div className="princ-right">
                    <p className="princ-desc">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Puntos de progreso */}
            <div className="princ-dots" aria-hidden="true">
              {PRINCIPLES.map((_, i) => (
                <div key={i} className={`princ-dot${activePrinciple === i ? " active" : ""}`} />
              ))}
            </div>

          </div>
        </section>

        {/* ==================== TESTIMONIOS ==================== */}
  <section id="testimonios" className="py-28 border-t border-white/10">
          <div className="max-w-5xl mx-auto px-6">
            <h2 data-reveal className="text-5xl font-bold text-center mb-16">Lo que dicen nuestros clientes</h2>

            <div data-reveal data-delay="120" className="grid md:grid-cols-2 gap-8 reveal-stagger">
              {[
                { text: "El equipo más profesional y creativo con el que hemos trabajado. La web superó todas nuestras expectativas.", name: "Carlos Martínez, CEO" },
                { text: "Entrega rápida, diseño premium y soporte excelente. ¡Lo recomiendo sin dudarlo!", name: "María López, Fundadora" },
              ].map((t, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-3xl p-10">
                  <p className="text-lg italic text-white/90">"{t.text}"</p>
                  <p className="mt-8 text-sm text-cyan-400">— {t.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== BLOG / FAQ ==================== */}
  <section id="blog" className="py-28 border-t border-white/10">
          <div className="max-w-4xl mx-auto px-6">
            <h2 data-reveal className="text-5xl font-bold text-center mb-16">Blog & FAQ</h2>

            <div data-reveal data-delay="120" className="space-y-6 reveal-stagger">
              {[
                { q: "¿Cuánto tarda en desarrollarse una web?", a: "Dependiendo de la complejidad, normalmente entre 3 y 8 semanas." },
                { q: "¿Trabajáis con clientes internacionales?", a: "Sí, colaboramos con clientes de España, Europa y América Latina." },
                { q: "¿Ofrecéis soporte y mantenimiento?", a: "Sí, disponemos de paquetes completos de mantenimiento y soporte técnico." },
                { q: "¿Puedo empezar solo con el diseño?", a: "Sí, nuestros servicios son flexibles y se adaptan a tus necesidades." },
              ].map((item, idx) => (
                <div key={idx} className="bg-white/5 border border-white/10 rounded-3xl p-8">
                  <h3 className="font-semibold text-lg mb-3">{item.q}</h3>
                  <p className="text-white/70">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== CONTACTO ==================== */}
        <section id="contacto" className="py-28 border-t border-white/10 bg-[#050505]">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 data-reveal className="text-5xl font-bold mb-6">Hablemos de tu proyecto</h2>
            <p data-reveal data-delay="80" className="text-white/70 mb-12">Rellena el formulario y te contactamos a la mayor brevedad.</p>

            <form data-reveal data-delay="160" className="space-y-6 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="text" placeholder="Nombre completo *" className="bg-white/5 border border-white/20 rounded-2xl px-6 py-4 focus:border-cyan-400 outline-none transition" />
                <input type="email" placeholder="Email *" className="bg-white/5 border border-white/20 rounded-2xl px-6 py-4 focus:border-cyan-400 outline-none transition" />
              </div>
              <input type="tel" placeholder="Teléfono" className="w-full bg-white/5 border border-white/20 rounded-2xl px-6 py-4 focus:border-cyan-400 outline-none transition" />
              <textarea placeholder="Tu mensaje *" rows={6} className="w-full bg-white/5 border border-white/20 rounded-2xl px-6 py-4 focus:border-cyan-400 outline-none transition resize-y" />

              <div className="flex items-center gap-3">
                <input type="checkbox" id="accept" className="accent-cyan-400" />
                <label htmlFor="accept" className="text-sm text-white/60">Acepto el tratamiento de mis datos personales.</label>
              </div>

              <button type="submit" className="w-full py-5 bg-white text-black font-bold rounded-2xl text-lg hover:bg-zinc-100 transition-all">
                Enviar mensaje
              </button>
            </form>
          </div>
        </section>

        {/* ==================== FOOTER ==================== */}
        <footer className="bg-[#050505] border-t border-white/10 py-16">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <img src="/novitic-logo.png" alt="Novitic" width={44} height={44} />
              <span className="text-2xl font-bold tracking-tight">Novitic</span>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-white/60 mb-8">
              <a href="#desarrollo-web" className="hover:text-white">Desarrollo Web</a>
              <a href="#servicios-it"   className="hover:text-white">Servicios IT</a>
              <a href="#portafolio"     className="hover:text-white">Portafolio</a>
              <a href="#equipo"         className="hover:text-white">Equipo</a>
              <a href="#contacto"       className="hover:text-white">Contacto</a>
            </div>

            <p className="text-white/40 text-sm">
              © {new Date().getFullYear()} Novitic. Todos los derechos reservados.
            </p>
          </div>
        </footer>
      </main>

    </>
  );
}

