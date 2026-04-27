"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, X } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";

/* ══════════════════════════ ACORDEONES ══════════════════════════ */

const WEBS_ACC = [
  {
    num: "01",
    title: "Web Básica — WordPress",
    desc: "Web profesional en WordPress de hasta 5 páginas para autónomos y pequeños negocios. Diseño personalizado, adaptada a móvil, con formulario de contacto, Google Maps, botón WhatsApp y SEO básico. Hosting y dominio incluidos el primer año.",
    tags: ["WordPress", "Hasta 5 páginas", "SEO básico", "749€"],
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>,
  },
  {
    num: "02",
    title: "Web Profesional — WordPress / Next.js",
    desc: "Web corporativa de hasta 12 páginas en WordPress o React/Next.js. SEO avanzado con Core Web Vitals, blog, Google Analytics 4, Search Console y ficha de Google Business Profile. Hosting y dominio incluidos el primer año.",
    tags: ["WordPress", "Next.js", "SEO avanzado", "1.690€"],
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>,
  },
  {
    num: "03",
    title: "Aplicación Web a Medida",
    desc: "Desarrollo de plataformas y aplicaciones web a medida con React / Next.js. Área privada de clientes, integraciones con ERPs o APIs de terceros, automatizaciones y lógica de negocio compleja. Presupuesto según proyecto.",
    tags: ["React", "Next.js", "API", "Presupuesto personalizado"],
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  },
];

const ECOMMERCE_ACC = [
  {
    num: "01",
    title: "Tienda WooCommerce",
    desc: "E-commerce completo en WordPress + WooCommerce. Catálogo ilimitado, pasarelas de pago (Stripe, PayPal, Bizum), gestión de stock y pedidos, emails automáticos y módulo de valoraciones. Hosting y dominio incluidos.",
    tags: ["WooCommerce", "Stripe", "Bizum", "2.690€"],
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><path d="M3 6h18M16 10a4 4 0 01-8 0"/></svg>,
  },
  {
    num: "02",
    title: "Tienda Shopify",
    desc: "Tienda Shopify para vender en España y el mundo. Diseño personalizado, configuración de pasarelas de pago, integración con redes sociales y Google Shopping. Ideal para marcas que quieren escalar rápido.",
    tags: ["Shopify", "Google Shopping", "Meta", "Desde 1.500€"],
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 001.98 1.61h9.72a2 2 0 001.98-1.61L23 6H6"/></svg>,
  },
  {
    num: "03",
    title: "E-commerce a Medida",
    desc: "Tienda online desarrollada con Next.js y Stripe para proyectos con necesidades específicas: suscripciones, acceso a contenido, reservas, marketplaces o integración con ERP / almacén.",
    tags: ["Next.js", "Stripe", "Suscripciones", "Presupuesto personalizado"],
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  },
];

const SEO_ACC = [
  {
    num: "01",
    title: "SEO Local",
    desc: "Posicionamiento en Google para atraer clientes de tu zona. Auditoría SEO, investigación de palabras clave locales, optimización on-page, Google Business Profile y 2 contenidos/mes. Resultados visibles en 3–6 meses.",
    tags: ["Google Maps", "Palabras clave locales", "290€/mes"],
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>,
  },
  {
    num: "02",
    title: "SEO Nacional",
    desc: "Estrategia SEO completa para competir a nivel nacional. Auditoría técnica avanzada, 4 contenidos/mes, link building de calidad (4–6 enlaces/mes), schema markup y seguimiento de hasta 50 palabras clave.",
    tags: ["Link building", "Core Web Vitals", "590€/mes"],
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
  },
  {
    num: "03",
    title: "Google Business Profile",
    desc: "Gestión completa de tu ficha de Google Empresas. Alta o reclamación, 2 posts semanales, gestión de reseñas, estrategia para conseguir más valoraciones e informes mensuales de rendimiento.",
    tags: ["Google Maps", "Reseñas", "Posts semanales", "99€/mes"],
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  },
  {
    num: "04",
    title: "Auditoría SEO",
    desc: "Análisis técnico completo: velocidad, errores, indexación, contenido y perfil de enlaces. Benchmarking con los 3 principales competidores e informe con plan de acción priorizado en 3 fases.",
    tags: ["Análisis técnico", "Competencia", "199€ único"],
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  },
];

const MANT_ACC = [
  {
    num: "01",
    title: "Mantenimiento Básico",
    desc: "Para webs informativas sencillas en WordPress. Actualizaciones de WP, plugins y tema, backup mensual en la nube, monitorización de uptime, revisión mensual de errores y hasta 1h/mes de cambios menores.",
    tags: ["WordPress", "Backup mensual", "60€/mes"],
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
  },
  {
    num: "02",
    title: "Mantenimiento Profesional",
    desc: "Para webs corporativas o con blog activo. Backups semanales (retención 30 días), revisión mensual de Core Web Vitals y analítica, hasta 2h/mes de cambios y soporte prioritario con respuesta en 4h.",
    tags: ["Backups semanales", "PageSpeed", "120€/mes"],
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>,
  },
  {
    num: "03",
    title: "Mantenimiento E-commerce",
    desc: "Para tiendas WooCommerce. Backups diarios, monitorización de pasarela de pago, revisión mensual del proceso de compra completo, hasta 3h/mes de cambios y respuesta urgente de máx. 2h ante caídas.",
    tags: ["Backups diarios", "WooCommerce", "Desde 150€/mes"],
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><path d="M3 6h18M16 10a4 4 0 01-8 0"/></svg>,
  },
];

const BRANDING_ACC = [
  {
    num: "01",
    title: "Identidad Corporativa & Branding",
    desc: "Creación de logotipo, paleta de colores, tipografía y guía de estilo corporativa. Todo listo para aplicar en web, redes sociales, documentos y material impreso. Entregamos en formatos vectoriales y digitales.",
    tags: ["Logotipo", "Guía de estilo", "Figma", "Desde 490€"],
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/></svg>,
  },
  {
    num: "02",
    title: "Diseño UI/UX",
    desc: "Diseño de interfaces y experiencia de usuario para webs y apps. Wireframes, prototipos interactivos en Figma y diseño final listo para desarrollo. Centrado en conversión y usabilidad.",
    tags: ["Figma", "Wireframes", "Prototipo", "Desde 390€"],
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><circle cx="11" cy="11" r="2"/></svg>,
  },
  {
    num: "03",
    title: "Landing Pages de Conversión",
    desc: "Páginas de aterrizaje diseñadas para maximizar resultados en campañas de Google Ads y Meta Ads. A/B testing, CTA optimizados y velocidad de carga máxima. Entrega en 5–7 días.",
    tags: ["CRO", "Google Ads", "A/B Testing", "Desde 590€"],
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
  },
];

/* ══════════════════════════ PLANES ══════════════════════════ */

const PLANS: Record<string, { nombre: string; precio: string; detalle: string; plazo: string; destacado: boolean; incluye: string[]; noIncluye?: string[] }[]> = {
  "Páginas Web": [
    {
      nombre: "Web Básica",
      precio: "749€", detalle: "pago único",
      plazo: "2–3 semanas desde aprobación del diseño",
      destacado: false,
      incluye: [
        "Diseño personalizado en WordPress (hasta 5 páginas)",
        "Responsive: móvil, tablet y escritorio",
        "SEO básico: títulos, metas, alt text, velocidad",
        "Formulario de contacto + notificación por email",
        "Integración con Google Maps",
        "Botón WhatsApp flotante personalizado",
        "Hosting Dinahosting + dominio incluidos 1 año",
        "SSL gratuito (HTTPS) + RGPD completo",
        "Panel WordPress para editar sin conocimientos técnicos",
        "Formación de 1h por videollamada",
        "Soporte técnico incluido 1 mes",
      ],
      noIncluye: ["Tienda online", "Blog con más de 5 artículos", "Integraciones con ERPs"],
    },
    {
      nombre: "Web Profesional",
      precio: "1.690€", detalle: "pago único",
      plazo: "3–5 semanas desde aprobación del diseño",
      destacado: true,
      incluye: [
        "Diseño premium en WordPress o React/Next.js (hasta 12 páginas)",
        "Responsive: móvil, tablet y escritorio",
        "SEO avanzado: palabras clave, schema markup, Core Web Vitals",
        "Blog / noticias con panel de edición completo",
        "Formularios avanzados con notificaciones y autorespuesta",
        "Google Analytics 4 + Search Console configurados",
        "PageSpeed objetivo +90 en móvil",
        "Hosting Dinahosting + dominio incluidos 1 año",
        "SSL, HTTPS y cabeceras de seguridad HTTP",
        "RGPD completo: privacidad, aviso legal, cookies",
        "Google Business Profile configurado y optimizado",
        "Formación de 2h por videollamada + manual PDF",
        "Soporte técnico incluido 3 meses",
      ],
      noIncluye: ["Tienda online (ampliable)", "Integraciones con ERPs complejos"],
    },
    {
      nombre: "App Web a Medida",
      precio: "Desde 2.500€", detalle: "",
      plazo: "Según alcance del proyecto",
      destacado: false,
      incluye: [
        "Desarrollo en React / Next.js a medida",
        "Área privada de clientes o usuarios",
        "Integraciones con APIs y sistemas externos",
        "Base de datos y lógica de negocio personalizada",
        "Autenticación segura (NextAuth, OAuth)",
        "Diseño UI/UX incluido",
        "Despliegue en Vercel, AWS o servidor propio",
        "Documentación técnica entregada",
        "Soporte post-entrega 3 meses",
      ],
    },
  ],
  "Tienda Online": [
    {
      nombre: "Tienda WooCommerce",
      precio: "2.690€", detalle: "pago único",
      plazo: "4–6 semanas",
      destacado: true,
      incluye: [
        "Diseño personalizado en WordPress + WooCommerce",
        "Catálogo ilimitado con variantes (talla, color, etc.)",
        "Pasarelas de pago: Stripe, PayPal, Bizum, transferencia",
        "Gestión de stock, pedidos y clientes desde el panel",
        "Emails automáticos: confirmación, factura, seguimiento",
        "Fichas de producto optimizadas para SEO",
        "Módulo de valoraciones y opiniones",
        "Sistema de cupones y descuentos",
        "Hosting de alto rendimiento + dominio incluidos 1 año",
        "Google Analytics 4 + seguimiento de conversiones",
        "Integración básica con Google Merchant Center",
        "Formación de 3h por videollamada + manual completo",
        "Soporte técnico incluido 3 meses",
      ],
      noIncluye: ["Fotografía de producto", "Alta en marketplaces (Amazon, Wallapop)"],
    },
    {
      nombre: "Tienda Shopify",
      precio: "Desde 1.500€", detalle: "pago único",
      plazo: "2–4 semanas",
      destacado: false,
      incluye: [
        "Diseño personalizado en Shopify (tema + customización)",
        "Configuración de pasarelas de pago",
        "Integración con redes sociales y Google Shopping",
        "Apps de Shopify configuradas según necesidades",
        "SEO básico de productos y colecciones",
        "Formación para gestionar la tienda de forma autónoma",
        "Soporte técnico incluido 1 mes",
      ],
      noIncluye: ["Cuota mensual de Shopify (a cargo del cliente)", "Apps premium de Shopify"],
    },
    {
      nombre: "E-commerce a Medida",
      precio: "Presupuesto personalizado", detalle: "",
      plazo: "Según alcance",
      destacado: false,
      incluye: [
        "Desarrollo en Next.js + Stripe o pasarela a medida",
        "Suscripciones, membresías o acceso a contenido",
        "Integración con ERP, almacén o sistema de gestión",
        "Marketplace o modelo multi-vendedor",
        "Diseño UI/UX incluido",
        "Documentación técnica entregada",
        "Soporte post-entrega 3 meses",
      ],
    },
  ],
  "SEO": [
    {
      nombre: "SEO Local",
      precio: "290€", detalle: "/ mes",
      plazo: "Resultados en 3–6 meses",
      destacado: false,
      incluye: [
        "Auditoría SEO inicial completa",
        "Investigación de palabras clave locales",
        "Optimización on-page: títulos, metas y contenido",
        "Alta y optimización en Google Business Profile",
        "Gestión y respuesta a reseñas de Google",
        "2 contenidos/mes (blog o landing)",
        "Construcción de enlaces locales (directorios)",
        "Seguimiento de hasta 20 palabras clave",
        "Informe mensual de posicionamiento",
      ],
    },
    {
      nombre: "SEO Nacional",
      precio: "590€", detalle: "/ mes",
      plazo: "Resultados en 4–8 meses",
      destacado: true,
      incluye: [
        "Auditoría SEO técnica avanzada",
        "Estrategia de contenidos y palabras clave",
        "Optimización técnica (Core Web Vitals, velocidad)",
        "4 contenidos/mes (blog o landings)",
        "Link building de calidad (4–6 enlaces/mes)",
        "Schema markup y datos estructurados",
        "Seguimiento de hasta 50 palabras clave",
        "Análisis de competencia mensual",
        "Informe detallado mensual + reunión de seguimiento (30 min)",
      ],
    },
    {
      nombre: "Google Business Profile",
      precio: "99€", detalle: "/ mes",
      plazo: "Activación en 1 semana",
      destacado: false,
      incluye: [
        "Alta o reclamación del perfil en Google",
        "Configuración completa (categorías, horarios, fotos)",
        "2 posts semanales en el perfil",
        "Gestión y respuesta a reseñas (positivas y negativas)",
        "Estrategia para conseguir más reseñas",
        "Actualización de fotos y contenido mensual",
        "Seguimiento de estadísticas (vistas, llamadas, clics)",
        "Informe mensual de rendimiento",
      ],
    },
    {
      nombre: "Auditoría SEO",
      precio: "199€", detalle: "pago único",
      plazo: "Entrega en 5–7 días",
      destacado: false,
      incluye: [
        "Análisis técnico completo (velocidad, errores, indexación)",
        "Revisión de contenido y palabras clave actuales",
        "Análisis del perfil de enlaces",
        "Auditoría de Google Business Profile",
        "Benchmarking con los 3 competidores principales",
        "Informe ejecutivo + informe técnico detallado",
        "Plan de acción priorizado en 3 fases",
        "Reunión de presentación de resultados (1h)",
      ],
    },
  ],
  "Mantenimiento Web": [
    {
      nombre: "Mantenimiento Básico",
      precio: "60€", detalle: "/ mes",
      plazo: "Sin permanencia mínima",
      destacado: false,
      incluye: [
        "Actualizaciones de WordPress, plugins y tema",
        "Backup mensual en la nube",
        "Monitorización de uptime 24h",
        "Revisión mensual de errores y formularios",
        "Renovación de dominio y hosting gestionada",
        "SSL activo y renovado",
        "Hasta 1h/mes de cambios menores",
        "Soporte por email — respuesta en 24–48h",
      ],
      noIncluye: ["Nuevas páginas (40€/h)", "SEO activo", "Horas adicionales (40€/h)"],
    },
    {
      nombre: "Mantenimiento Profesional",
      precio: "120€", detalle: "/ mes",
      plazo: "Sin permanencia mínima",
      destacado: true,
      incluye: [
        "Actualizaciones de WordPress, plugins y tema",
        "Backups semanales (retención 30 días)",
        "Monitorización de rendimiento y uptime 24h",
        "Revisión mensual de Core Web Vitals y PageSpeed",
        "Revisión de analítica mensual (Google Analytics 4)",
        "Hasta 2h/mes de cambios incluidas",
        "Renovación de dominio y hosting gestionada",
        "SSL activo y renovado automáticamente",
        "Soporte prioritario — respuesta en 4h laborables",
        "Informe mensual de estado de la web",
      ],
      noIncluye: ["Rediseño completo", "Horas adicionales (40€/h)"],
    },
    {
      nombre: "Mantenimiento E-commerce",
      precio: "Desde 150€", detalle: "/ mes",
      plazo: "Sin permanencia mínima",
      destacado: false,
      incluye: [
        "Todo lo del plan Profesional",
        "Backups diarios (retención 30 días)",
        "Monitorización activa de la pasarela de pago",
        "Revisión mensual del proceso de compra completo",
        "Actualización de hasta 30 productos/mes",
        "Control de seguridad: malware y accesos sospechosos",
        "Respuesta urgente ante caídas: máx. 2h",
        "Hasta 3h/mes de cambios incluidas",
      ],
      noIncluye: ["Gestión de Google Ads / Meta Ads", "Integración con ERPs (presupuesto aparte)"],
    },
  ],
  "Diseño & Branding": [
    {
      nombre: "Identidad Corporativa",
      precio: "Desde 490€", detalle: "pago único",
      plazo: "1–2 semanas",
      destacado: false,
      incluye: [
        "Creación de logotipo (3 propuestas + revisiones)",
        "Paleta de colores corporativa",
        "Tipografía principal y secundaria",
        "Guía de estilo (brand guidelines en PDF)",
        "Entrega en formatos vectoriales (AI, SVG, PNG, PDF)",
        "Versiones del logo: color, blanco, negro y monocromático",
        "Aplicaciones básicas: tarjeta de visita, firma de email",
      ],
    },
    {
      nombre: "Diseño UI/UX",
      precio: "Desde 390€", detalle: "pago único",
      plazo: "1–3 semanas según alcance",
      destacado: true,
      incluye: [
        "Análisis de usuarios y competencia",
        "Arquitectura de información y flujos de navegación",
        "Wireframes de baja fidelidad",
        "Prototipo interactivo en alta fidelidad (Figma)",
        "Diseño adaptado a móvil, tablet y escritorio",
        "Handoff listo para desarrollo (tokens de diseño, assets)",
        "2 rondas de revisiones incluidas",
      ],
    },
    {
      nombre: "Landing Page de Conversión",
      precio: "Desde 590€", detalle: "pago único",
      plazo: "5–7 días",
      destacado: false,
      incluye: [
        "Diseño y desarrollo de landing page de alta conversión",
        "Estructura optimizada para el objetivo (lead, venta, descarga)",
        "CTA estratégicos y formulario de captación",
        "Velocidad de carga máxima (PageSpeed +95)",
        "Integración con Google Ads / Meta Ads",
        "Pixel de seguimiento de conversiones configurado",
        "Compatible con A/B testing",
        "Soporte incluido 1 mes",
      ],
    },
  ],
};

/* ══════════════════════ INFO POR TAB ══════════════════════ */

const TAB_INFO: Record<string, { titulo: string; sub: string; badges: string[]; acento: string }> = {
  "Páginas Web": {
    titulo: "Páginas web que convierten visitas en clientes",
    sub: "Diseñamos y desarrollamos webs profesionales en WordPress, Next.js o a medida para empresas de Barcelona, Sant Boi de Llobregat y toda España. Rápidas, bien posicionadas y listas para crecer.",
    badges: ["🌐 WordPress & Next.js", "📱 Responsive", "⚡ PageSpeed +90", "🔒 SSL + RGPD", "📍 Barcelona & España"],
    acento: "Páginas Web",
  },
  "Tienda Online": {
    titulo: "Tu tienda online lista para vender desde el primer día",
    sub: "E-commerce completo en WooCommerce, Shopify o Next.js. Diseño personalizado, pasarelas de pago configuradas y formación incluida para que puedas gestionar tu tienda de forma autónoma.",
    badges: ["🛒 WooCommerce", "🏪 Shopify", "💳 Stripe & Bizum", "📦 Gestión de pedidos", "📈 Google Shopping"],
    acento: "Tienda Online",
  },
  "SEO": {
    titulo: "Aparece en Google cuando tus clientes te buscan",
    sub: "Estrategia SEO para posicionarte en Barcelona, toda España o mercados específicos. Contenido, link building y optimización técnica para que el tráfico orgánico crezca mes a mes sin pagar publicidad.",
    badges: ["🔍 SEO Local", "📈 SEO Nacional", "🗺️ Google Maps", "✍️ Contenido mensual", "📊 Informe mensual"],
    acento: "SEO",
  },
  "Mantenimiento Web": {
    titulo: "Tu web siempre actualizada, segura y funcionando",
    sub: "Sin mantenimiento, una web pierde seguridad y rendimiento en pocos meses. Nos encargamos de las actualizaciones, backups, monitorización y pequeños cambios para que tú te concentres en tu negocio.",
    badges: ["🔄 Actualizaciones", "💾 Backups automáticos", "👁️ Uptime 24/7", "⚡ PageSpeed", "🛡️ Seguridad activa"],
    acento: "Mantenimiento Web",
  },
  "Diseño & Branding": {
    titulo: "Diseño que diferencia tu marca de la competencia",
    sub: "Identidad visual, UI/UX y landing pages de conversión para empresas que quieren destacar. Diseño coherente, memorable y alineado con los valores de tu negocio. Entregamos en Figma y formatos listos para producción.",
    badges: ["🎨 Figma", "🖋️ Identidad corporativa", "📐 UI/UX", "🎯 Conversión", "📱 Responsive"],
    acento: "Diseño & Branding",
  },
};

const TABS = ["Páginas Web", "Tienda Online", "SEO", "Mantenimiento Web", "Diseño & Branding"];

const ACCORDION_MAP: Record<string, typeof WEBS_ACC> = {
  "Páginas Web":       WEBS_ACC,
  "Tienda Online":     ECOMMERCE_ACC,
  "SEO":               SEO_ACC,
  "Mantenimiento Web": MANT_ACC,
  "Diseño & Branding": BRANDING_ACC,
};

/* ══════════════════════ MOCKUPS ══════════════════════ */

function WebMockup() {
  return (
    <div className="dw-phone-wrap">
      <div className="dw-badge dw-badge-1">⚡ PageSpeed 98</div>
      <div className="dw-badge dw-badge-2">📱 Responsive</div>
      <div className="dw-badge dw-badge-3">🔒 SSL activo</div>
      <div className="dw-phone-glow" />
      <div className="dw-phone">
        <div className="dw-phone-notch" />
        <div className="dw-phone-screen">
          <div className="dw-phone-content">
            <div className="dw-mock-nav">
              <div className="dw-mock-logo" />
              <div className="dw-mock-nav-links">
                <div className="dw-mock-line short" /><div className="dw-mock-line short" /><div className="dw-mock-line short" />
              </div>
            </div>
            <div className="dw-mock-hero">
              <div className="dw-mock-line m75 bold" />
              <div className="dw-mock-line m50" />
              <div className="dw-mock-btn" />
            </div>
            <div className="dw-mock-cards">
              <div className="dw-mock-card" /><div className="dw-mock-card" /><div className="dw-mock-card" />
            </div>
            <div className="dw-mock-section">
              <div className="dw-mock-line m33 bold" />
              <div className="dw-mock-line" /><div className="dw-mock-line m80" /><div className="dw-mock-line m66" />
            </div>
            <div className="dw-mock-section">
              <div className="dw-mock-img" />
              <div className="dw-mock-line" /><div className="dw-mock-line m75" />
            </div>
            <div className="dw-mock-footer">
              <div className="dw-mock-line m50" /><div className="dw-mock-line short" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EcommerceMockup() {
  return (
    <div className="dw-phone-wrap">
      <div className="dw-badge dw-badge-1">💳 Stripe & Bizum</div>
      <div className="dw-badge dw-badge-2">📦 Gestión de stock</div>
      <div className="dw-badge dw-badge-3">🛒 Carrito listo</div>
      <div className="dw-phone-glow" />
      <div className="dw-phone">
        <div className="dw-phone-notch" />
        <div className="dw-phone-screen">
          <div className="dw-phone-content">
            <div className="dw-mock-nav">
              <div className="dw-mock-logo" />
              <div className="dw-mock-nav-links">
                <div className="dw-mock-line short" /><div className="dw-mock-line short" />
              </div>
            </div>
            {/* Product grid */}
            <div className="dw-mock-cards" style={{ flexWrap:"wrap", gap:5, padding:14 }}>
              {[1,2,3,4].map(i => (
                <div key={i} style={{ flex:"1 1 calc(50% - 5px)", height:64, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:8 }} />
              ))}
            </div>
            <div className="dw-mock-section">
              <div className="dw-mock-line m50 bold" />
              <div className="dw-mock-line m75" />
            </div>
            {/* Cart */}
            <div style={{ margin:"0 14px 14px", background:"rgba(34,211,238,0.08)", border:"1px solid rgba(34,211,238,0.2)", borderRadius:8, padding:"8px 10px" }}>
              <div style={{ width:"60%", height:5, background:"rgba(34,211,238,0.5)", borderRadius:3, marginBottom:6 }} />
              <div style={{ width:"40%", height:3, background:"rgba(255,255,255,0.15)", borderRadius:3 }} />
            </div>
            <div className="dw-mock-footer">
              <div className="dw-mock-line m50" /><div className="dw-mock-line short" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SeoMockup() {
  return (
    <div className="flex items-center justify-center py-6" aria-hidden="true">
      <div style={{ width:270, display:"flex", flexDirection:"column", gap:8 }}>
        {/* Google search bar */}
        <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:24, padding:"8px 14px", display:"flex", alignItems:"center", gap:8 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" style={{ width:14, height:14, flexShrink:0 }}><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <div style={{ flex:1, height:4, background:"rgba(255,255,255,0.12)", borderRadius:2 }} />
          <div style={{ width:6, height:6, borderRadius:"50%", background:"rgba(34,211,238,0.5)" }} />
        </div>
        {/* Result 1 — highlighted (your client) */}
        <div style={{ background:"rgba(34,211,238,0.06)", border:"1px solid rgba(34,211,238,0.22)", borderRadius:10, padding:"10px 12px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6 }}>
            <div style={{ width:14, height:14, borderRadius:3, background:"rgba(34,211,238,0.3)", flexShrink:0 }} />
            <div style={{ flex:1, height:3, background:"rgba(34,211,238,0.5)", borderRadius:2 }} />
          </div>
          <div style={{ width:"85%", height:5, background:"rgba(255,255,255,0.25)", borderRadius:3, marginBottom:5 }} />
          <div style={{ width:"100%", height:3, background:"rgba(255,255,255,0.1)", borderRadius:2, marginBottom:3 }} />
          <div style={{ width:"75%", height:3, background:"rgba(255,255,255,0.1)", borderRadius:2 }} />
          <div style={{ display:"flex", gap:5, marginTop:7 }}>
            {["#1 en Google","★ 4.9","Barcelona"].map(t => (
              <span key={t} style={{ fontSize:"0.52rem", fontWeight:700, color:"rgba(34,211,238,0.8)", background:"rgba(34,211,238,0.1)", border:"1px solid rgba(34,211,238,0.2)", borderRadius:20, padding:"1px 6px" }}>{t}</span>
            ))}
          </div>
        </div>
        {/* Results 2 & 3 — competition (dimmed) */}
        {[1,2].map(i => (
          <div key={i} style={{ background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:10, padding:"10px 12px", opacity: 0.5 }}>
            <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:5 }}>
              <div style={{ width:12, height:12, borderRadius:3, background:"rgba(255,255,255,0.1)", flexShrink:0 }} />
              <div style={{ flex:1, height:3, background:"rgba(255,255,255,0.1)", borderRadius:2 }} />
            </div>
            <div style={{ width:"70%", height:4, background:"rgba(255,255,255,0.15)", borderRadius:3, marginBottom:5 }} />
            <div style={{ width:"90%", height:3, background:"rgba(255,255,255,0.07)", borderRadius:2 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function MaintenanceMockup() {
  return (
    <div className="flex items-center justify-center py-6" aria-hidden="true">
      <div style={{ width:260, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, padding:18, display:"flex", flexDirection:"column", gap:10 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", paddingBottom:10, borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
          <div>
            <div style={{ width:80, height:5, background:"rgba(255,255,255,0.2)", borderRadius:3, marginBottom:4 }} />
            <div style={{ width:50, height:3, background:"rgba(34,211,238,0.4)", borderRadius:3 }} />
          </div>
          <div style={{ fontSize:"0.6rem", fontWeight:700, color:"#4ade80", background:"rgba(74,222,128,0.1)", border:"1px solid rgba(74,222,128,0.25)", borderRadius:20, padding:"2px 8px" }}>ACTIVO</div>
        </div>
        {[
          { label:"WordPress actualizado",  ok:true  },
          { label:"Plugins actualizados",   ok:true  },
          { label:"Backup completado",      ok:true  },
          { label:"SSL válido",             ok:true  },
          { label:"Uptime (30 días)",       ok:true  },
          { label:"PageSpeed móvil",        score:"94" },
        ].map((item) => (
          <div key={item.label} style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <span style={{ fontSize:"0.65rem", color:"rgba(255,255,255,0.5)" }}>{item.label}</span>
            {"score" in item
              ? <span style={{ fontSize:"0.65rem", fontWeight:700, color:"#22d3ee" }}>{item.score}/100</span>
              : <div style={{ width:14, height:14, borderRadius:"50%", background:"rgba(74,222,128,0.15)", border:"1px solid rgba(74,222,128,0.3)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <svg viewBox="0 0 12 12" style={{ width:8, height:8 }} fill="none" stroke="#4ade80" strokeWidth="2"><polyline points="2 6 5 9 10 3"/></svg>
                </div>
            }
          </div>
        ))}
      </div>
    </div>
  );
}

function BrandingMockup() {
  return (
    <div className="flex items-center justify-center py-6" aria-hidden="true">
      <div style={{ width:260, display:"flex", flexDirection:"column", gap:10 }}>
        {/* Color palette */}
        <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, padding:"12px 14px" }}>
          <div style={{ width:60, height:4, background:"rgba(255,255,255,0.15)", borderRadius:2, marginBottom:10 }} />
          <div style={{ display:"flex", gap:6 }}>
            {["#22d3ee","#6366f1","#f59e0b","#10b981","#f43f5e","#1e1e2e"].map(c => (
              <div key={c} style={{ flex:1, height:28, borderRadius:7, background:c, boxShadow: c === "#22d3ee" ? "0 0 12px rgba(34,211,238,0.4)" : "none" }} />
            ))}
          </div>
        </div>
        {/* Logo placeholder */}
        <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, padding:"14px", display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:36, height:36, borderRadius:9, background:"rgba(34,211,238,0.15)", border:"1px solid rgba(34,211,238,0.3)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="1.5" style={{ width:18, height:18 }}><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/></svg>
          </div>
          <div>
            <div style={{ width:80, height:6, background:"rgba(255,255,255,0.2)", borderRadius:3, marginBottom:5 }} />
            <div style={{ width:55, height:3, background:"rgba(255,255,255,0.08)", borderRadius:2 }} />
          </div>
        </div>
        {/* Typography */}
        <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, padding:"12px 14px", display:"flex", flexDirection:"column", gap:6 }}>
          <div style={{ width:"75%", height:8, background:"rgba(255,255,255,0.25)", borderRadius:3 }} />
          <div style={{ width:"90%", height:4, background:"rgba(255,255,255,0.1)", borderRadius:2 }} />
          <div style={{ width:"65%", height:4, background:"rgba(255,255,255,0.1)", borderRadius:2 }} />
          <div style={{ width:"80%", height:3, background:"rgba(255,255,255,0.07)", borderRadius:2 }} />
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════ ACCORDION ══════════════════════ */

function Accordion({ items }: { items: typeof WEBS_ACC }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="dw-accordion">
      {items.map((s, i) => (
        <div key={i} className={`dw-acc-item${open === i ? " open" : ""}`} onClick={() => setOpen(open === i ? -1 : i)}>
          <div className="dw-acc-head">
            <span className="dw-acc-num">{s.num}</span>
            <div className="dw-acc-icon-box">{s.icon}</div>
            <h3 className="dw-acc-title">{s.title}</h3>
            <svg className="dw-acc-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
          <div className="dw-acc-body">
            <div className="dw-acc-inner">
              <p className="dw-acc-desc">{s.desc}</p>
              <div className="dw-acc-tags">
                {s.tags.map(t => <span key={t} className="dw-acc-tag">{t}</span>)}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════ PAGE ══════════════════════ */

export default function DesarrolloWebPage() {
  const [tab, setTab] = useState("Páginas Web");
  const info = TAB_INFO[tab];
  const plans = PLANS[tab] ?? [];
  const colClass = plans.length <= 2 ? "grid-cols-1 md:grid-cols-2" : plans.length === 4 ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-4" : "grid-cols-1 md:grid-cols-3";

  const mockups: Record<string, React.ReactNode> = {
    "Páginas Web":       <WebMockup />,
    "Tienda Online":     <EcommerceMockup />,
    "SEO":               <SeoMockup />,
    "Mantenimiento Web": <MaintenanceMockup />,
    "Diseño & Branding": <BrandingMockup />,
  };

  return (
    <div className="min-h-screen" style={{ background:"#050505", color:"#fff" }}>
      <SiteHeader />

      {/* ── HERO ── */}
      <section className="pt-36 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-6 h-px bg-cyan-400" />
            <span className="text-xs font-bold tracking-widest text-cyan-400 uppercase">Desarrollo Web · Novitic</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-none mb-4">
            Diseño web &<br />marketing digital
          </h1>
          <p className="text-lg max-w-xl leading-relaxed" style={{ color:"rgba(255,255,255,0.45)" }}>
            Páginas web, tiendas online, SEO y diseño para empresas de Barcelona, Sant Boi de Llobregat y toda España.
          </p>
        </div>
      </section>

      {/* ── TABS ── */}
      <div className="sticky top-16 z-40 border-b" style={{ background:"rgba(5,5,5,0.95)", backdropFilter:"blur(20px)", borderColor:"rgba(255,255,255,0.08)" }}>
        <div className="max-w-6xl mx-auto px-6 overflow-x-auto">
          <div className="flex items-center gap-1 py-2 w-max">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap"
                style={tab === t
                  ? { background:"rgba(34,211,238,0.12)", color:"#22d3ee", border:"1px solid rgba(34,211,238,0.3)" }
                  : { background:"transparent", color:"rgba(255,255,255,0.4)", border:"1px solid transparent" }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── CONTENIDO ── */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">

          {/* Intro */}
          <div className="mb-14">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-6 h-px bg-cyan-400" />
              <span className="text-xs font-bold tracking-widest text-cyan-400 uppercase">{info.acento}</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-6">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight max-w-lg">{info.titulo}</h2>
              <p className="text-sm max-w-sm leading-relaxed" style={{ color:"rgba(255,255,255,0.45)" }}>{info.sub}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {info.badges.map(b => (
                <span key={b} className="text-xs px-3 py-1.5 rounded-full" style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", color:"rgba(255,255,255,0.6)" }}>
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Accordion + Mockup */}
          <div className="dw-split mb-14">
            <Accordion items={ACCORDION_MAP[tab]} />
            {mockups[tab]}
          </div>

          {/* Planes */}
          <div className="flex items-center gap-3 mb-6">
            <span className="w-4 h-px bg-cyan-400/50" />
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color:"rgba(255,255,255,0.3)" }}>Planes y tarifas</span>
          </div>
          <div className={`grid gap-4 ${colClass}`}>
            {plans.map((p) => (
              <div
                key={p.nombre}
                className="relative flex flex-col rounded-2xl overflow-hidden transition-transform hover:-translate-y-1"
                style={{
                  background: p.destacado ? "rgba(34,211,238,0.05)" : "rgba(255,255,255,0.03)",
                  border:     p.destacado ? "1px solid rgba(34,211,238,0.25)" : "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {p.destacado && (
                  <div className="absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background:"rgba(34,211,238,0.15)", color:"#22d3ee", border:"1px solid rgba(34,211,238,0.3)" }}>
                    Más popular
                  </div>
                )}
                <div className="px-5 pt-5 pb-4" style={{ borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
                  <p className="text-sm font-bold text-white mb-3">{p.nombre}</p>
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-2xl font-bold text-white">{p.precio}</span>
                    {p.detalle && <span className="text-xs" style={{ color:"rgba(255,255,255,0.35)" }}>{p.detalle}</span>}
                  </div>
                  <div className="flex items-center gap-1.5 mt-2">
                    <svg className="w-3 h-3" style={{ color:"rgba(255,255,255,0.3)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    <span className="text-xs" style={{ color:"rgba(255,255,255,0.35)" }}>{p.plazo}</span>
                  </div>
                </div>
                <ul className="px-5 py-4 space-y-2 flex-1">
                  {p.incluye.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs" style={{ color:"rgba(255,255,255,0.65)" }}>
                      <CheckCircle2 size={12} className="text-cyan-400 mt-0.5 shrink-0" />{item}
                    </li>
                  ))}
                </ul>
                {p.noIncluye && p.noIncluye.length > 0 && (
                  <div className="px-5 pb-3">
                    <div className="pt-3" style={{ borderTop:"1px solid rgba(255,255,255,0.06)" }}>
                      <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color:"rgba(255,255,255,0.2)" }}>No incluye</p>
                      <ul className="space-y-1">
                        {p.noIncluye.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs" style={{ color:"rgba(255,255,255,0.3)" }}>
                            <X size={10} className="mt-0.5 shrink-0" />{item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                <div className="px-5 pb-5 pt-2">
                  <Link
                    href="/#contacto"
                    className="block w-full text-center py-2.5 rounded-xl text-xs font-semibold transition-all"
                    style={p.destacado
                      ? { background:"rgba(34,211,238,0.12)", color:"#22d3ee", border:"1px solid rgba(34,211,238,0.3)" }
                      : { background:"rgba(255,255,255,0.05)", color:"rgba(255,255,255,0.5)", border:"1px solid rgba(255,255,255,0.1)" }}
                  >
                    Solicitar presupuesto
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-6 border-t" style={{ borderColor:"rgba(255,255,255,0.08)" }}>
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="w-6 h-px bg-cyan-400" />
            <span className="text-xs font-bold tracking-widest text-cyan-400 uppercase">¿Empezamos?</span>
            <span className="w-6 h-px bg-cyan-400" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Tienes un proyecto en mente?</h2>
          <p className="mb-8 leading-relaxed" style={{ color:"rgba(255,255,255,0.45)" }}>
            Cuéntanos qué necesitas y te preparamos un presupuesto sin compromiso. Respondemos en menos de 24h.
          </p>
          <Link
            href="/#contacto"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all"
            style={{ background:"rgba(34,211,238,0.12)", color:"#22d3ee", border:"1px solid rgba(34,211,238,0.3)" }}
          >
            Contacto rápido
            <svg className="w-4 h-4" viewBox="0 0 14 15" fill="none">
              <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor"/>
            </svg>
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-8 px-6 border-t text-center" style={{ borderColor:"rgba(255,255,255,0.08)" }}>
        <p className="text-xs" style={{ color:"rgba(255,255,255,0.2)" }}>
          Todos los precios son orientativos · IVA no incluido (21%) · Novitic · info@novitic.com
        </p>
      </footer>
    </div>
  );
}
