"use client";

import { useState } from "react";
import { Package, Monitor, Shield, Cloud, Wrench, Clock, CheckCircle2, Star, Zap, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Servicio {
  id: string;
  categoria: string;
  icon: LucideIcon;
  color: string;
  nombre: string;
  descripcion: string;
  precio: number | null;
  precioTipo: string;
  mantenimiento?: number | null;
  mantenimientoLabel?: string;
  porqueEstePrice?: string;
  destacado: boolean;
  incluye: string[];
  noIncluye?: string[];
  plazo: string;
}

const SERVICIOS: Servicio[] = [
  {
    id: "web-basica",
    categoria: "Página Web",
    icon: Monitor,
    color: "purple",
    nombre: "Web Básica",
    descripcion: "Web profesional en WordPress para autónomos y pequeños negocios. Diseño personalizado, optimizada para móvil y lista para aparecer en Google.",
    precio: 749,
    precioTipo: "único",
    mantenimiento: 60,
    destacado: false,
    incluye: [
      "Diseño personalizado en WordPress (hasta 5 páginas)",
      "Responsive: adaptada a móvil, tablet y escritorio",
      "SEO básico: títulos, meta descripciones, alt text, velocidad",
      "Formulario de contacto con notificación por email",
      "Integración con Google Maps",
      "Botón de WhatsApp flotante con mensaje personalizado",
      "Hosting en Dinahosting incluido 1 año (renovación al coste del proveedor)",
      "Dominio .com o .es incluido 1 año",
      "Certificado SSL gratuito (HTTPS)",
      "Política de privacidad y banner de cookies (RGPD)",
      "Panel WordPress para editar textos e imágenes sin conocimientos técnicos",
      "Formación de 1h por videollamada para gestionar la web",
      "Soporte técnico incluido 1 mes después de la entrega",
    ],
    noIncluye: [
      "Tienda online / carrito de compra",
      "Blog con más de 5 artículos iniciales",
      "Integraciones con ERPs, CRMs o sistemas externos",
      "Fotografía o vídeo profesional",
    ],
    porqueEstePrice: "Tarifa calculada sobre ~18h de trabajo a 40€/h + hosting Dinahosting anual. Los cambios adicionales fuera del alcance se presupuestan a 40€/h (con mantenimiento) o 50€/h sin contrato de mantenimiento.",
    plazo: "2–3 semanas desde la aprobación del diseño",
  },
  {
    id: "web-profesional",
    categoria: "Página Web",
    icon: Monitor,
    color: "purple",
    nombre: "Web Profesional",
    descripcion: "Web en WordPress o tecnología a medida (React/Next.js) para empresas que necesitan un proyecto sólido, rápido y bien posicionado en Google.",
    precio: 1690,
    precioTipo: "único",
    mantenimiento: 120,
    destacado: true,
    incluye: [
      "Diseño premium personalizado en WordPress o React/Next.js (hasta 12 páginas)",
      "Responsive: móvil, tablet y escritorio",
      "SEO avanzado: investigación de palabras clave, schema markup, Core Web Vitals",
      "Blog / sección de noticias con panel de edición completo",
      "Formularios avanzados con notificaciones y autorespuesta",
      "Google Analytics 4 y Search Console configurados y verificados",
      "Velocidad optimizada (objetivo PageSpeed +90 en móvil)",
      "Hosting en Dinahosting incluido 1 año (renovación al coste del proveedor)",
      "Dominio .com o .es incluido 1 año",
      "SSL, HTTPS y cabeceras de seguridad HTTP",
      "Política de privacidad, aviso legal y cookies completos (RGPD)",
      "Ficha de Google Business Profile configurada y optimizada",
      "Integración con redes sociales (Open Graph, Twitter Card)",
      "Formación de 2h por videollamada + manual de uso en PDF",
      "Soporte técnico incluido 3 meses después de la entrega",
    ],
    noIncluye: [
      "Tienda online (ampliable con presupuesto adicional)",
      "Integraciones con ERPs o sistemas a medida complejos",
      "Fotografía o vídeo profesional",
    ],
    porqueEstePrice: "Tarifa calculada sobre ~38h de trabajo a 40€/h + hosting y herramientas. Cambios fuera del alcance: 40€/h con mantenimiento, 50€/h sin él.",
    plazo: "3–5 semanas desde la aprobación del diseño",
  },
  {
    id: "tienda-online",
    categoria: "Página Web",
    icon: Package,
    color: "purple",
    nombre: "Tienda Online",
    descripcion: "E-commerce completo en WordPress + WooCommerce. Diseño, pasarelas de pago, gestión de pedidos y formación incluidos. Listo para vender desde el primer día.",
    precio: 2690,
    precioTipo: "único",
    mantenimiento: null,
    mantenimientoLabel: "Personalizado según tienda",
    destacado: false,
    incluye: [
      "Diseño de tienda personalizado en WordPress + WooCommerce",
      "Responsive: móvil, tablet y escritorio",
      "Catálogo de productos ilimitado con variantes (talla, color, etc.)",
      "Pasarela de pago: Stripe, PayPal, Bizum y transferencia bancaria",
      "Gestión de stock, pedidos y clientes desde el panel",
      "Emails automáticos de confirmación, factura y seguimiento",
      "Fichas de producto optimizadas para SEO",
      "Página inicio + categorías + carrito + checkout + área de cliente",
      "Módulo de valoraciones y opiniones de clientes",
      "Configuración de métodos y costes de envío",
      "Sistema de cupones y descuentos",
      "Hosting de alto rendimiento en Dinahosting incluido 1 año",
      "Dominio incluido 1 año",
      "SSL y certificado de seguridad avanzado",
      "Google Analytics 4 + seguimiento de conversiones e-commerce",
      "Integración básica con Google Merchant Center",
      "Formación de 3h por videollamada + manual completo",
      "Soporte técnico incluido 3 meses",
    ],
    noIncluye: [
      "Fotografía de producto (se puede presupuestar aparte)",
      "Alta en marketplaces (Amazon, Wallapop, Miravia)",
      "Diseño de logotipo o identidad corporativa",
    ],
    porqueEstePrice: "Tarifa calculada sobre ~60h de trabajo a 40€/h + hosting y licencias. Cambios fuera del alcance: 40€/h con mantenimiento, 50€/h sin él.",
    plazo: "4–6 semanas desde la aprobación del diseño",
  },
  {
    id: "soporte-basico",
    categoria: "Mantenimiento IT",
    icon: Wrench,
    color: "blue",
    nombre: "Soporte Básico",
    descripcion: "Para autónomos y pequeñas empresas de 1–3 usuarios. Atención remota, actualizaciones y resolución de incidencias del día a día.",
    precio: 80,
    precioTipo: "mes",
    destacado: false,
    incluye: [
      "Hasta 2h de soporte remoto al mes incluidas (adicionales a 40€/h)",
      "Resolución de incidencias: correo, impresoras, Office, navegadores",
      "Actualizaciones de Windows / macOS y software instalado",
      "Revisión mensual de seguridad básica",
      "Gestión de contraseñas y accesos",
      "Soporte por email y teléfono en horario laboral (9h–18h L–V)",
      "Tiempo de respuesta: máx. 8h laborables",
    ],
    noIncluye: [
      "Visitas presenciales (se pueden contratar a 50€/h + desplazamiento)",
      "Gestión de servidores o infraestructura cloud",
      "Backup automático en la nube",
    ],
    plazo: "Sin permanencia mínima",
  },
  {
    id: "soporte-empresa",
    categoria: "Mantenimiento IT",
    icon: Wrench,
    color: "blue",
    nombre: "Soporte Empresa",
    descripcion: "Para empresas de 4–15 usuarios. Soporte remoto y presencial, gestión completa de equipos, correo corporativo y backups.",
    precio: 200,
    precioTipo: "mes",
    destacado: true,
    incluye: [
      "Hasta 5h de soporte remoto/presencial al mes (adicionales a 40€/h)",
      "1 visita presencial al mes incluida (área metropolitana Barcelona)",
      "Soporte prioritario por email y teléfono (9h–19h L–V)",
      "Tiempo de respuesta: máx. 2h laborables",
      "Gestión de hasta 15 equipos (Windows/macOS)",
      "Actualizaciones y parches de seguridad gestionados",
      "Backup automático en la nube con retención de 30 días",
      "Antivirus/EDR gestionado centralizado",
      "Gestión de Microsoft 365 o Google Workspace (usuarios, correo, licencias)",
      "Informe mensual de estado del parque informático",
    ],
    noIncluye: [
      "Sustitución o compra de hardware (se gestiona al coste del proveedor)",
      "Licencias de software de terceros (se repercuten al coste)",
    ],
    plazo: "Sin permanencia mínima",
  },
  {
    id: "microsoft-365",
    categoria: "Cloud",
    icon: Cloud,
    color: "sky",
    nombre: "Microsoft 365",
    descripcion: "Migración y gestión completa de Microsoft 365 para tu empresa. Correo corporativo, Teams, OneDrive y Office siempre actualizados.",
    precio: 200,
    precioTipo: "único (configuración)",
    mantenimiento: 9,
    mantenimientoLabel: "por usuario/mes (licencia + gestión)",
    destacado: true,
    incluye: [
      "Análisis del entorno actual y planificación de la migración",
      "Migración de correos, contactos y calendarios al nuevo tenant",
      "Configuración de Microsoft 365 Admin Center",
      "Configuración de SharePoint / OneDrive para el equipo",
      "Instalación y activación de Office en todos los equipos",
      "Configuración de políticas de seguridad y MFA (doble factor)",
      "Alta y baja de usuarios gestionada mensualmente",
      "Soporte durante los primeros 30 días incluido",
      "Licencia Microsoft 365 Business Basic incluida en cuota mensual",
      "Formación básica al equipo (hasta 1h)",
    ],
    noIncluye: [
      "Licencias premium (Business Standard / Premium) — precio diferente",
      "Hardware",
      "Desarrollo de aplicaciones Power Platform",
    ],
    plazo: "Migración en 1–2 semanas",
  },
  {
    id: "google-workspace",
    categoria: "Cloud",
    icon: Cloud,
    color: "sky",
    nombre: "Google Workspace",
    descripcion: "Gestión completa de Google Workspace (Gmail corporativo, Drive, Meet, Calendar). Alta de usuarios, seguridad y administración delegada.",
    precio: 150,
    precioTipo: "único (configuración)",
    mantenimiento: 8,
    mantenimientoLabel: "por usuario/mes (licencia + gestión)",
    destacado: false,
    incluye: [
      "Configuración del Google Admin Console",
      "Alta del dominio y verificación DNS",
      "Migración de correos al nuevo workspace",
      "Configuración de Gmail, Drive, Calendar, Meet y Contacts",
      "Alta y baja de usuarios gestionada mensualmente",
      "Configuración de grupos, alias y listas de distribución",
      "Políticas de seguridad: MFA, sesiones, acceso por dispositivo",
      "Configuración de copias de seguridad con Google Vault (si aplica)",
      "Licencia Google Workspace Business Starter incluida en cuota mensual",
      "Formación básica al equipo (hasta 1h)",
    ],
    noIncluye: [
      "Licencias Business Standard / Plus — precio diferente",
      "Desarrollo de scripts o automatizaciones con AppScript",
    ],
    plazo: "Configuración en 3–5 días",
  },
  {
    id: "ciberseguridad",
    categoria: "Seguridad",
    icon: Shield,
    color: "green",
    nombre: "Auditoría de Seguridad",
    descripcion: "Análisis completo del estado de seguridad de tu empresa y plan de acción.",
    precio: 390,
    precioTipo: "único",
    destacado: false,
    incluye: [
      "Análisis de vulnerabilidades de red",
      "Revisión de cuentas y contraseñas",
      "Test de phishing simulado",
      "Revisión de copias de seguridad",
      "Análisis de software desactualizado",
      "Informe detallado con puntuación de riesgo",
      "Plan de acción priorizado",
      "Reunión de presentación de resultados (1h)",
      "Seguimiento a los 30 días",
    ],
    noIncluye: [
      "Implementación de mejoras (presupuesto aparte)",
    ],
    plazo: "1 semana",
  },
];

const SERVICIOS_SEO: Servicio[] = [
  {
    id: "seo-local",
    categoria: "SEO",
    icon: TrendingUp,
    color: "orange",
    nombre: "SEO Local",
    descripcion: "Posicionamiento en Google para atraer clientes de tu zona. Ideal para negocios locales.",
    precio: 290,
    precioTipo: "mes",
    destacado: false,
    incluye: [
      "Auditoría SEO inicial completa",
      "Investigación de palabras clave locales",
      "Optimización de títulos, metas y contenido",
      "Alta y optimización en Google Business Profile",
      "Gestión de reseñas y respuestas",
      "Creación de 2 contenidos/mes (blog o landing)",
      "Construcción de enlaces locales (directorios)",
      "Informe mensual de posicionamiento",
      "Seguimiento de hasta 20 palabras clave",
    ],
    noIncluye: [
      "Publicidad de pago (Google Ads)",
      "Diseño de nuevas páginas web",
    ],
    plazo: "Resultados en 3–6 meses",
  },
  {
    id: "seo-nacional",
    categoria: "SEO",
    icon: TrendingUp,
    color: "orange",
    nombre: "SEO Nacional",
    descripcion: "Estrategia SEO completa para competir a nivel nacional y aumentar visibilidad orgánica.",
    precio: 590,
    precioTipo: "mes",
    destacado: true,
    incluye: [
      "Auditoría SEO técnica avanzada",
      "Estrategia de contenidos y palabras clave",
      "Optimización técnica (Core Web Vitals, velocidad)",
      "Creación de 4 contenidos/mes (blog o landings)",
      "Link building de calidad (4–6 enlaces/mes)",
      "Optimización de Google Business Profile",
      "Schema markup y datos estructurados",
      "Seguimiento de hasta 50 palabras clave",
      "Análisis de competencia mensual",
      "Informe detallado mensual con próximos pasos",
      "Reunión de seguimiento mensual (30 min)",
    ],
    noIncluye: [
      "Publicidad de pago (Google Ads)",
    ],
    plazo: "Resultados visibles en 4–8 meses",
  },
  {
    id: "google-business",
    categoria: "SEO",
    icon: TrendingUp,
    color: "orange",
    nombre: "Google Business Profile",
    descripcion: "Gestión completa de tu ficha de Google Empresas para aparecer en el mapa y ganar reseñas.",
    precio: 99,
    precioTipo: "mes",
    destacado: false,
    incluye: [
      "Alta o reclamación del perfil en Google",
      "Configuración completa (categorías, horarios, fotos)",
      "Publicación de 2 posts semanales en el perfil",
      "Gestión y respuesta a reseñas (positivas y negativas)",
      "Estrategia para conseguir más reseñas",
      "Actualización de fotos y contenido mensual",
      "Seguimiento de estadísticas (vistas, llamadas, clics)",
      "Informe mensual de rendimiento",
      "Alertas ante cambios no autorizados en el perfil",
    ],
    noIncluye: [
      "Google Ads / publicidad de pago",
      "Creación de contenido web adicional",
    ],
    plazo: "Activación en 1 semana",
  },
  {
    id: "seo-auditoria",
    categoria: "SEO",
    icon: TrendingUp,
    color: "orange",
    nombre: "Auditoría SEO",
    descripcion: "Análisis completo de tu web para detectar problemas y oportunidades de posicionamiento.",
    precio: 199,
    precioTipo: "único",
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
    noIncluye: [
      "Implementación de mejoras (presupuesto aparte)",
    ],
    plazo: "Entrega en 5–7 días",
  },
];

const PLANES_MANTENIMIENTO_WEB = [
  {
    id: "mant-basico",
    nombre: "Mantenimiento Básico",
    descripcion: "Para webs informativas sencillas en WordPress. Seguridad, actualizaciones y pequeños cambios mensuales.",
    precio: 60,
    precioLabel: "60€/mes",
    color: "zinc",
    destacado: false,
    incluye: [
      "Actualizaciones de WordPress, plugins y tema",
      "Copia de seguridad mensual en la nube",
      "Monitorización de caída del servidor (uptime 24h)",
      "Revisión mensual de errores, enlaces rotos y formularios",
      "Renovación de dominio y hosting gestionada (al coste del proveedor)",
      "Certificado SSL activo y renovado",
      "Hasta 1h/mes de cambios menores (textos, imágenes, datos de contacto)",
      "Soporte por email — respuesta en 24–48h laborables",
    ],
    noIncluye: [
      "Nuevas páginas o secciones (se presupuestan a 40€/h)",
      "Cambios de diseño o estructura",
      "SEO activo ni posicionamiento",
      "Horas adicionales fuera del plan (40€/h)",
    ],
    nota: "Ideal para webs de autónomos, restaurantes, clínicas o pequeños negocios.",
  },
  {
    id: "mant-profesional",
    nombre: "Mantenimiento Profesional",
    descripcion: "Para webs corporativas o con blog activo. Más horas incluidas, informes mensuales y soporte prioritario.",
    precio: 120,
    precioLabel: "120€/mes",
    color: "purple",
    destacado: true,
    incluye: [
      "Actualizaciones de WordPress, plugins y tema",
      "Copias de seguridad semanales en la nube con retención 30 días",
      "Monitorización de rendimiento, velocidad y uptime (24h)",
      "Revisión mensual de Core Web Vitals y PageSpeed",
      "Revisión de analítica mensual (Google Analytics 4)",
      "Hasta 2h/mes de cambios incluidas (textos, imágenes, nuevas secciones menores)",
      "Renovación de dominio y hosting gestionada (al coste del proveedor)",
      "SSL activo y renovado automáticamente",
      "Soporte prioritario por email y teléfono — respuesta en 4h laborables",
      "Informe mensual de estado de la web (rendimiento, visitas, incidencias)",
    ],
    noIncluye: [
      "Rediseño completo o cambio de tecnología",
      "Desarrollo de nuevas funcionalidades complejas (se presupuestan a 40€/h)",
      "SEO activo ni creación de contenido",
      "Horas adicionales fuera del plan (40€/h)",
    ],
    nota: "El plan más equilibrado para empresas con web activa.",
  },
  {
    id: "mant-ecommerce",
    nombre: "Mantenimiento E-commerce",
    descripcion: "Para tiendas online en WooCommerce. Precio personalizado según la complejidad de la tienda (productos, integraciones, volumen de pedidos).",
    precio: null,
    precioLabel: "Desde 150€/mes",
    color: "blue",
    destacado: false,
    incluye: [
      "Todo lo del plan Profesional",
      "Copias de seguridad diarias con retención 30 días",
      "Monitorización activa de la pasarela de pago (Stripe/PayPal/Bizum)",
      "Revisión mensual del proceso de compra completo (checkout, emails, stock)",
      "Actualización de productos y precios (hasta 30 referencias/mes incluidas)",
      "Control de seguridad avanzado: malware, fuerza bruta, accesos sospechosos",
      "Respuesta urgente ante caídas o bloqueo de ventas (máx. 2h respuesta)",
      "Hasta 3h/mes de cambios incluidas",
      "Informe mensual: ventas, conversión, rendimiento y estado técnico",
    ],
    noIncluye: [
      "Fotografía de producto",
      "Gestión de campañas publicitarias (Google Ads, Meta Ads)",
      "Integraciones con ERPs o sincronización masiva de stock (se presupuestan aparte)",
    ],
    nota: "El precio final depende del número de productos, integraciones activas y volumen de pedidos. Se define en reunión previa sin compromiso.",
  },
];

const PLANES_HORAS = [
  {
    nombre: "Bolsa 5h",
    horas: 5,
    precio: 200,
    precioHora: 40,
    color: "zinc",
    descripcion: "Para tareas puntuales: pequeños cambios, configuraciones o soporte puntual.",
    caducidad: "6 meses",
  },
  {
    nombre: "Bolsa 10h",
    horas: 10,
    precio: 400,
    precioHora: 40,
    color: "blue",
    descripcion: "La opción más solicitada. Para proyectos medianos o soporte recurrente.",
    caducidad: "12 meses",
    destacado: true,
  },
  {
    nombre: "Bolsa 20h",
    horas: 20,
    precio: 800,
    precioHora: 40,
    color: "purple",
    descripcion: "Para empresas con necesidades continuadas de desarrollo o soporte técnico.",
    caducidad: "12 meses",
  },
];

const colorMap: Record<string, { bg: string; text: string; border: string; badge: string }> = {
  purple: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
    badge: "bg-purple-100 text-purple-700",
  },
  blue: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    badge: "bg-blue-100 text-blue-700",
  },
  sky: {
    bg: "bg-sky-50",
    text: "text-sky-700",
    border: "border-sky-200",
    badge: "bg-sky-100 text-sky-700",
  },
  green: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
    badge: "bg-green-100 text-green-700",
  },
  zinc: {
    bg: "bg-zinc-50",
    text: "text-zinc-700",
    border: "border-zinc-200",
    badge: "bg-zinc-100 text-zinc-700",
  },
  orange: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-200",
    badge: "bg-orange-100 text-orange-700",
  },
};

const categorias = ["Página Web", "Mantenimiento IT", "Cloud", "Seguridad", "SEO", "Bolsas de Horas"];

const tabIcons: Record<string, string> = {
  "Página Web": "🌐",
  "Mantenimiento IT": "🔧",
  "Cloud": "☁️",
  "Seguridad": "🔒",
  "SEO": "📈",
  "Bolsas de Horas": "⏱️",
};

export default function ServiciosPage() {
  const [tab, setTab] = useState("Página Web");

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900">Catálogo de Servicios</h2>
        <p className="text-zinc-500 mt-1">
          Servicios, planes y tarifas de Novitic · Todos los precios en EUR (IVA no incluido)
        </p>
      </div>

      {/* Pestañas */}
      <div className="flex items-center gap-1 mb-8 bg-zinc-100 p-1 rounded-xl w-fit flex-wrap">
        {categorias.map((cat) => (
          <button
            key={cat}
            onClick={() => setTab(cat)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              tab === cat
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            <span>{tabIcons[cat]}</span>
            {cat}
          </button>
        ))}
      </div>

      {/* Contenido por pestaña — Servicios */}
      {tab !== "Bolsas de Horas" && (
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {(tab === "SEO" ? SERVICIOS_SEO : SERVICIOS.filter((s) => s.categoria === tab)).map((s) => {
              const c = colorMap[s.color] ?? colorMap.zinc;
              const Icon = s.icon;
              return (
                <div
                  key={s.id}
                  className={`relative bg-white rounded-2xl border ${s.destacado ? "border-blue-400 ring-2 ring-blue-100 shadow-md" : "border-zinc-200 shadow-sm"} flex flex-col overflow-hidden`}
                >
                  {s.destacado && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-blue-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                      <Star size={11} fill="white" />
                      Más popular
                    </div>
                  )}
                  <div className={`px-6 pt-6 pb-4 ${c.bg}`}>
                    <div className={`w-10 h-10 rounded-xl ${c.bg} ${c.border} border flex items-center justify-center mb-3`}>
                      <Icon size={20} className={c.text} />
                    </div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${c.badge}`}>
                      {s.categoria}
                    </span>
                    <h4 className="text-base font-bold text-zinc-900 mt-2">{s.nombre}</h4>
                    <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{s.descripcion}</p>
                  </div>
                  <div className="px-6 py-4 border-b border-zinc-100">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-bold text-zinc-900">{(s.precio ?? 0).toLocaleString("es-ES")}€</span>
                      <span className="text-sm text-zinc-500">/ {s.precioTipo}</span>
                    </div>
                    {(s.mantenimiento || s.mantenimientoLabel) && (
                      <p className="text-xs text-zinc-400 mt-0.5">
                        {s.mantenimiento
                          ? `+ ${s.mantenimiento}€${s.mantenimientoLabel ? ` ${s.mantenimientoLabel}` : "/mes"} mantenimiento`
                          : `+ ${s.mantenimientoLabel}`}
                      </p>
                    )}
                    <div className="flex items-center gap-1.5 mt-2">
                      <Clock size={12} className="text-zinc-400" />
                      <span className="text-xs text-zinc-500">Plazo estimado: {s.plazo}</span>
                    </div>
                  </div>
                  <div className="px-6 py-4 flex-1">
                    <p className="text-xs font-semibold text-zinc-700 uppercase tracking-wide mb-3">Incluye</p>
                    <ul className="space-y-1.5">
                      {s.incluye.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-zinc-700">
                          <CheckCircle2 size={13} className="text-green-500 mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    {s.noIncluye && s.noIncluye.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-zinc-100">
                        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-2">No incluye</p>
                        <ul className="space-y-1">
                          {s.noIncluye.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-zinc-400">
                              <span className="mt-0.5 flex-shrink-0">✕</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Planes de mantenimiento web */}
          {tab === "Página Web" && (
            <div className="mt-10">
              <h3 className="text-base font-bold text-zinc-800 mb-1 flex items-center gap-2">
                <span className="w-1 h-4 rounded-full bg-purple-400 inline-block" />
                Planes de Mantenimiento Web
              </h3>
              <p className="text-zinc-500 text-sm mb-5">Cuida tu web después de la entrega. Sin mantenimiento, una web pierde seguridad y rendimiento en pocos meses.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {PLANES_MANTENIMIENTO_WEB.map((plan) => {
                  const c = colorMap[plan.color] ?? colorMap.zinc;
                  return (
                    <div
                      key={plan.id}
                      className={`relative bg-white rounded-2xl border ${plan.destacado ? "border-purple-400 ring-2 ring-purple-100 shadow-md" : "border-zinc-200 shadow-sm"} p-6 flex flex-col`}
                    >
                      {plan.destacado && (
                        <div className="absolute top-3 right-3 flex items-center gap-1 bg-purple-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                          <Star size={11} fill="white" />
                          Más popular
                        </div>
                      )}
                      <div className={`w-10 h-10 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center mb-3`}>
                        <Monitor size={18} className={c.text} />
                      </div>
                      <h4 className="text-base font-bold text-zinc-900">{plan.nombre}</h4>
                      <p className="text-xs text-zinc-500 mt-1 mb-4 leading-relaxed">{plan.descripcion}</p>
                      <div className="flex items-baseline gap-1.5 mb-5">
                        <span className="text-2xl font-bold text-zinc-900">{plan.precioLabel}</span>
                      </div>
                      <p className="text-xs font-semibold text-zinc-700 uppercase tracking-wide mb-3">Incluye</p>
                      <ul className="space-y-1.5 flex-1">
                        {plan.incluye.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-zinc-700">
                            <CheckCircle2 size={13} className="text-green-500 mt-0.5 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                      {plan.noIncluye.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-zinc-100">
                          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-2">No incluye</p>
                          <ul className="space-y-1">
                            {plan.noIncluye.map((item, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-zinc-400">
                                <span className="mt-0.5 flex-shrink-0">✕</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {plan.nota && (
                        <div className="mt-3 pt-3 border-t border-zinc-100">
                          <p className="text-xs text-zinc-500 leading-relaxed italic">💡 {plan.nota}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Pestaña Bolsas de Horas */}
      {tab === "Bolsas de Horas" && (
        <section>
          <p className="text-zinc-500 text-sm mb-6">
            Horas de trabajo técnico prepagadas a precio reducido. Válidas para desarrollo, soporte, formación o cualquier servicio.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            {PLANES_HORAS.map((plan) => {
              const c = colorMap[plan.color] ?? colorMap.zinc;
              return (
                <div
                  key={plan.nombre}
                  className={`relative bg-white rounded-2xl border ${plan.destacado ? "border-blue-400 ring-2 ring-blue-100 shadow-md" : "border-zinc-200 shadow-sm"} p-6`}
                >
                  {plan.destacado && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-blue-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                      <Zap size={11} fill="white" />
                      Más popular
                    </div>
                  )}
                  <div className={`w-10 h-10 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center mb-4`}>
                    <Clock size={20} className={c.text} />
                  </div>
                  <h4 className="text-lg font-bold text-zinc-900">{plan.nombre}</h4>
                  <p className="text-xs text-zinc-500 mt-1 mb-4">{plan.descripcion}</p>
                  <div className="flex items-baseline gap-1.5 mb-1">
                    <span className="text-2xl font-bold text-zinc-900">{plan.precio}€</span>
                    <span className="text-sm text-zinc-400">total</span>
                  </div>
                  <p className="text-sm font-semibold text-green-600 mb-4">{plan.precioHora}€/hora</p>
                  <div className="space-y-2 text-xs text-zinc-600">
                    <div className="flex items-center gap-2"><CheckCircle2 size={13} className="text-green-500" />{plan.horas} horas de trabajo técnico</div>
                    <div className="flex items-center gap-2"><CheckCircle2 size={13} className="text-green-500" />Caducidad: {plan.caducidad}</div>
                    <div className="flex items-center gap-2"><CheckCircle2 size={13} className="text-green-500" />Acumulables con mantenimiento</div>
                    <div className="flex items-center gap-2"><CheckCircle2 size={13} className="text-green-500" />Transferibles a otro proyecto</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50">
              <p className="text-sm font-semibold text-zinc-700">Tarifa hora suelta (sin bolsa prepagada)</p>
              <p className="text-xs text-zinc-500 mt-0.5">Las bolsas de horas y los clientes con contrato de mantenimiento tienen tarifa preferente de 40€/h</p>
            </div>
            <div className="grid grid-cols-3 divide-x divide-zinc-100">
              <div className="px-6 py-5 text-center">
                <p className="text-xs text-zinc-500 mb-1">Remoto (sin mantenimiento)</p>
                <p className="text-xl font-bold text-zinc-900">50€<span className="text-sm font-normal text-zinc-400">/h</span></p>
              </div>
              <div className="px-6 py-5 text-center">
                <p className="text-xs text-zinc-500 mb-1">Presencial (área Barcelona)</p>
                <p className="text-xl font-bold text-zinc-900">50€<span className="text-sm font-normal text-zinc-400">/h + despl.</span></p>
              </div>
              <div className="px-6 py-5 text-center">
                <p className="text-xs text-zinc-500 mb-1">Con contrato mantenimiento</p>
                <p className="text-xl font-bold text-green-700">40€<span className="text-sm font-normal text-zinc-400">/h</span></p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Nota legal */}
      <div className="mt-10 rounded-xl bg-zinc-100 border border-zinc-200 px-6 py-4 text-xs text-zinc-500 leading-relaxed">
        <strong className="text-zinc-700">Nota:</strong> Todos los precios son orientativos y pueden variar según las necesidades específicas de cada proyecto.
        Los precios no incluyen IVA (21%). Las bolsas de horas son nominativas y no reembolsables.
        Para proyectos fuera de la tarifa estándar se elabora un presupuesto personalizado sin compromiso.
        Novitic · info@novitic.com · <a href="https://novitic.com" className="underline hover:text-zinc-700">novitic.com</a>
      </div>
    </div>
  );
}