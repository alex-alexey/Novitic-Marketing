"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, X } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";

/* ─────────────────────── DATOS ─────────────────────── */

const SOPORTE_ACC = [
  {
    num: "01",
    title: "Plan Básico — hasta 5 equipos",
    desc: "Soporte remoto ilimitado para autónomos y pequeñas empresas. Resolvemos incidencias del día a día: correo, Office, impresoras, navegadores y actualizaciones. Sin desplazamientos, sin esperas largas.",
    tags: ["Remoto ilimitado", "Hasta 5 equipos", "Respuesta 8h", "Desde 12€/equipo/mes"],
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
  },
  {
    num: "02",
    title: "Plan Empresa — 5 a 20 equipos",
    desc: "Soporte remoto y presencial con visita mensual incluida. Backup en la nube, gestión de Microsoft 365 o Google Workspace y respuesta prioritaria de 4h. El plan más completo para pymes.",
    tags: ["Remoto + presencial", "5–20 equipos", "Respuesta 4h", "15€/equipo/mes"],
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>,
  },
  {
    num: "03",
    title: "Plan Premium — +20 equipos",
    desc: "Para empresas con infraestructura crítica. Soporte presencial ilimitado, SLA de 2h garantizado, gestor IT dedicado, gestión de servidores y plan de continuidad de negocio documentado.",
    tags: ["Presencial ilimitado", "+20 equipos", "SLA 2h", "Desde 20€/equipo/mes"],
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>,
  },
];

const CLOUD_ACC = [
  {
    num: "01",
    title: "Microsoft 365",
    desc: "Migración completa de correos, contactos y calendarios. Exchange, Teams, SharePoint, OneDrive y Office en todos los equipos. Políticas de seguridad y MFA incluidas. Licencia Business Basic incluida en la cuota mensual.",
    tags: ["Exchange", "Teams", "OneDrive", "9€/usuario/mes"],
    icon: <svg viewBox="0 0 23 23" fill="none" width="16" height="16"><path fill="#f25022" d="M0 0h11v11H0z"/><path fill="#00a4ef" d="M12 0h11v11H12z"/><path fill="#7fba00" d="M0 12h11v11H0z"/><path fill="#ffb900" d="M12 12h11v11H12z"/></svg>,
  },
  {
    num: "02",
    title: "Google Workspace",
    desc: "Alta del dominio, Admin Console y migración de correos. Gmail, Drive, Calendar y Meet listos en 3–5 días. Alta y baja de usuarios gestionada mensualmente. Licencia Business Starter incluida.",
    tags: ["Gmail", "Drive", "Meet", "8€/usuario/mes"],
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 0 20M12 2a15.3 15.3 0 0 0 0 20"/></svg>,
  },
];

const SEGURIDAD_ACC = [
  {
    num: "01",
    title: "Auditoría de Seguridad",
    desc: "Análisis completo de vulnerabilidades de red, cuentas, contraseñas, backups y software desactualizado. Informe con puntuación de riesgo y plan de acción priorizado. Seguimiento a los 30 días.",
    tags: ["Red", "Phishing test", "Informe detallado", "390€"],
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
  },
  {
    num: "02",
    title: "Protección EDR Gestionada",
    desc: "Antivirus de nueva generación con detección y respuesta a amenazas. Panel centralizado, alertas en tiempo real y respuesta a incidentes incluida. Compatible con Windows y macOS.",
    tags: ["Windows", "macOS", "Alertas real-time", "8€/equipo/mes"],
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  },
  {
    num: "03",
    title: "Formación en Ciberseguridad",
    desc: "Taller práctico de 3h para el equipo sobre phishing, ransomware e ingeniería social. Simulación en vivo, material PDF descargable y certificado de participación. Hasta 15 personas por sesión.",
    tags: ["Phishing", "Ransomware", "Certificado", "290€/sesión"],
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  },
];

const INFRA_ACC = [
  {
    num: "01",
    title: "Red de Oficina",
    desc: "Diseño, instalación y configuración de red Wi-Fi y cableada. Router/firewall empresarial, VLANs para empleados y visitas, VPN de acceso remoto y documentación entregada al cliente.",
    tags: ["Wi-Fi", "VPN", "Firewall", "VLAN", "Desde 490€"],
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1" fill="currentColor"/></svg>,
  },
  {
    num: "02",
    title: "Servidor NAS / Backup Local",
    desc: "Almacenamiento centralizado con RAID, backup automático de todos los equipos, carpetas por departamento con permisos y acceso remoto seguro. Segunda copia en la nube incluida.",
    tags: ["RAID", "Backup auto", "Acceso remoto", "Desde 350€"],
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>,
  },
];

const PLANS: Record<string, { nombre: string; precio: string; detalle: string; plazo: string; destacado: boolean; incluye: string[] }[]> = {
  "Soporte IT": [
    {
      nombre: "Plan Básico",
      precio: "12€", detalle: "/ equipo / mes (mín. 60€/mes)",
      plazo: "Sin permanencia · hasta 5 equipos",
      destacado: false,
      incluye: [
        "Soporte remoto ilimitado (incidencias sin límite de tickets)",
        "Resolución de problemas: correo, Office, impresoras, navegadores",
        "Actualizaciones automáticas Windows y macOS",
        "Soporte por email y teléfono en horario laboral (9h–18h L–V)",
        "Tiempo de respuesta: máx. 8h laborables",
        "Horas adicionales fuera del plan: 40€/h",
      ],
    },
    {
      nombre: "Plan Empresa",
      precio: "15€", detalle: "/ equipo / mes (mín. 150€/mes)",
      plazo: "Sin permanencia · 5–20 equipos",
      destacado: true,
      incluye: [
        "Todo lo del Plan Básico",
        "Soporte remoto ilimitado + soporte presencial incluido",
        "1 visita presencial al mes (Barcelona y área metropolitana)",
        "Tiempo de respuesta prioritario: máx. 4h laborables",
        "Backup automático en la nube — retención 30 días",
        "Parches y actualizaciones de seguridad gestionados",
        "Gestión de Microsoft 365 o Google Workspace (altas, bajas, incidencias)",
        "Informe mensual del estado del parque informático",
        "Horas adicionales fuera del plan: 35€/h",
      ],
    },
    {
      nombre: "Plan Premium",
      precio: "20€", detalle: "/ equipo / mes (personalizado)",
      plazo: "Mínimo 3 meses · +20 equipos",
      destacado: false,
      incluye: [
        "Todo lo del Plan Empresa",
        "Soporte presencial ilimitado (sin límite de visitas)",
        "SLA garantizado: respuesta máx. 2h laborables",
        "Gestor IT dedicado + reunión de seguimiento quincenal",
        "Gestión de servidores on-premise y/o cloud (AWS, Azure, Google Cloud)",
        "Monitorización proactiva 24/7 de sistemas críticos",
        "Plan de continuidad de negocio (BCP) documentado",
        "Inventario de hardware y software actualizado",
        "Informe ejecutivo mensual + reunión de presentación",
      ],
    },
  ],
  "Cloud": [
    {
      nombre: "Microsoft 365",
      precio: "200€", detalle: "configuración",
      plazo: "Migración en 1–2 semanas",
      destacado: true,
      incluye: ["Migración de correos, contactos y calendarios", "Exchange, Teams, SharePoint, OneDrive", "Office instalado en todos los equipos", "MFA y políticas de seguridad", "9€/usuario/mes (licencia Business Basic incluida)"],
    },
    {
      nombre: "Google Workspace",
      precio: "150€", detalle: "configuración",
      plazo: "Listo en 3–5 días",
      destacado: false,
      incluye: ["Gmail, Drive, Calendar, Meet y Contacts", "Migración de correos", "MFA y políticas de seguridad", "Alta/baja de usuarios mensual", "8€/usuario/mes (licencia Business Starter incluida)"],
    },
  ],
  "Seguridad": [
    {
      nombre: "Auditoría de Seguridad",
      precio: "390€", detalle: "pago único",
      plazo: "Entrega en 1 semana",
      destacado: false,
      incluye: ["Análisis de vulnerabilidades de red", "Test de phishing simulado", "Revisión de cuentas, contraseñas y backups", "Informe con puntuación de riesgo", "Plan de acción priorizado + seguimiento 30 días"],
    },
    {
      nombre: "EDR Gestionado",
      precio: "8€", detalle: "/ equipo / mes",
      plazo: "Despliegue en 24–48h",
      destacado: true,
      incluye: ["Licencia EDR incluida por equipo", "Panel centralizado en tiempo real", "Alertas automáticas ante amenazas", "Respuesta a incidentes: aislamiento y limpieza", "Compatible con Windows y macOS"],
    },
    {
      nombre: "Formación Ciberseguridad",
      precio: "290€", detalle: "/ sesión",
      plazo: "Disponible en 1–2 semanas",
      destacado: false,
      incluye: ["Sesión de 3h (presencial o videoconferencia)", "Phishing, ransomware e ingeniería social", "Simulación de phishing en vivo", "Material PDF por participante", "Certificado de participación (hasta 15 personas)"],
    },
  ],
  "Infraestructura": [
    {
      nombre: "Red de Oficina",
      precio: "Desde 490€", detalle: "",
      plazo: "1–3 días según tamaño",
      destacado: false,
      incluye: ["Router/firewall empresarial configurado", "Wi-Fi seguro (WPA3, SSID separados)", "VLANs por departamento", "VPN de acceso remoto", "Documentación de red entregada"],
    },
    {
      nombre: "Servidor NAS / Backup",
      precio: "Desde 350€", detalle: "configuración",
      plazo: "1–2 días",
      destacado: true,
      incluye: ["RAID configurado para redundancia", "Backup automático de todos los equipos", "Carpetas por departamento con permisos", "Acceso remoto seguro (VPN)", "Segunda copia en la nube incluida"],
    },
  ],
};

/* Datos descriptivos de cada tab */
const TAB_INFO: Record<string, { titulo: string; sub: string; badges: string[]; acento: string }> = {
  "Soporte IT": {
    titulo: "Mantenimiento informático desde 12€/equipo/mes",
    sub: "Soporte remoto ilimitado, visitas presenciales y gestión completa de tus equipos. Planes por dispositivo sin permanencia, igual que las mejores empresas IT de Madrid y Barcelona.",
    badges: ["🖥️ Desde 12€/equipo/mes", "🔧 Soporte remoto ilimitado", "🏢 Presencial Barcelona", "⚡ Respuesta desde 2h", "🔄 Sin permanencia"],
    acento: "Soporte IT",
  },
  "Cloud": {
    titulo: "Correo corporativo y productividad en la nube",
    sub: "Microsoft 365 o Google Workspace para toda tu empresa. Te migramos sin perder un solo correo y gestionamos los usuarios mes a mes para que no tengas que preocuparte de nada.",
    badges: ["📧 Correo corporativo", "☁️ Drive / OneDrive", "🎥 Teams / Meet", "🔒 MFA activado"],
    acento: "Cloud",
  },
  "Seguridad": {
    titulo: "Protege tu empresa frente a ciberataques",
    sub: "El 60% de las pymes que sufren un ciberataque grave cierran en 6 meses. Auditamos tu estado de seguridad, protegemos tus equipos con EDR y formamos a tu equipo para que no caiga en phishing.",
    badges: ["🛡️ EDR gestionado", "🔍 Auditoría de red", "🎣 Test de phishing", "📋 Informe de riesgo"],
    acento: "Ciberseguridad",
  },
  "Infraestructura": {
    titulo: "Red, servidores y backup para tu oficina",
    sub: "Una infraestructura sólida es la base de todo lo demás. Diseñamos tu red Wi-Fi, configuramos tu servidor NAS y aseguramos que nunca pierdas un solo archivo importante.",
    badges: ["📶 Wi-Fi empresarial", "🖧 VLANs seguras", "💾 Backup automático", "🔐 VPN remota"],
    acento: "Infraestructura",
  },
  "Bolsas de Horas": {
    titulo: "Soporte puntual sin permanencia",
    sub: "Horas de trabajo técnico prepagadas a tarifa preferente. Sin contrato, sin mínimos. Válidas para cualquier servicio IT: soporte, configuraciones, formación o lo que necesites.",
    badges: ["⏱️ 40€/hora", "✅ Sin permanencia", "🔄 Acumulables", "📦 Transferibles"],
    acento: "Bolsas de Horas",
  },
};

const BOLSAS = [
  { nombre: "Bolsa 5h",  horas: 5,  precio: 200, precioHora: 40, caducidad: "6 meses",  destacado: false },
  { nombre: "Bolsa 10h", horas: 10, precio: 400, precioHora: 40, caducidad: "12 meses", destacado: true  },
  { nombre: "Bolsa 20h", horas: 20, precio: 800, precioHora: 40, caducidad: "12 meses", destacado: false },
];

const TABS = ["Soporte IT", "Cloud", "Seguridad", "Infraestructura", "Bolsas de Horas"];

/* ─────────────────────── ACCORDION ─────────────────────── */
function Accordion({ items }: { items: typeof SOPORTE_ACC }) {
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

/* ─────────────────────── LAPTOP MOCKUP ─────────────────────── */
function LaptopMockup() {
  return (
    <div className="flex flex-col items-center select-none" aria-hidden="true">
      <div style={{ width:290, height:185, background:"#0a0a14", borderRadius:"10px 10px 0 0", border:"2px solid rgba(255,255,255,0.1)", boxShadow:"0 0 0 1px rgba(0,200,255,0.08), 0 20px 60px rgba(0,0,0,0.5)", overflow:"hidden", position:"relative" }}>
        <div style={{ position:"absolute", top:5, left:"50%", transform:"translateX(-50%)", width:5, height:5, borderRadius:"50%", background:"rgba(255,255,255,0.15)", zIndex:2 }} />
        <div style={{ padding:"14px 10px 8px", height:"100%", display:"flex", flexDirection:"column", gap:7 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", paddingBottom:6, borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
            <img src="/novitic-logo.png" alt="" style={{ width:18, height:18, objectFit:"contain", filter:"drop-shadow(0 0 4px rgba(0,200,255,0.6))" }} />
            <div style={{ display:"flex", gap:4 }}>
              {[1,2,3].map(i => <div key={i} style={{ width:20, height:4, background:"rgba(255,255,255,0.12)", borderRadius:2 }} />)}
            </div>
          </div>
          <div style={{ display:"flex", gap:5 }}>
            {[["#22d3ee","Sistemas OK"],["#4ade80","Red activa"],["#f59e0b","1 alerta"]].map(([color, label]) => (
              <div key={label as string} style={{ flex:1, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:5, padding:"4px 5px", display:"flex", alignItems:"center", gap:4 }}>
                <div style={{ width:5, height:5, borderRadius:"50%", background:color as string, boxShadow:`0 0 6px ${color}` }} />
                <div style={{ flex:1, height:3, background:"rgba(255,255,255,0.12)", borderRadius:2 }} />
              </div>
            ))}
          </div>
          {[{ color:"#4ade80", w:"75%" }, { color:"#22d3ee", w:"55%" }, { color:"#f59e0b", w:"65%" }].map((t, i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:6, padding:"4px 6px", background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.05)", borderRadius:5 }}>
              <div style={{ width:5, height:5, borderRadius:"50%", background:t.color, flexShrink:0 }} />
              <div style={{ flex:1, height:3, background:"rgba(255,255,255,0.15)", borderRadius:2, maxWidth:t.w }} />
              <div style={{ width:22, height:3, background:"rgba(255,255,255,0.06)", borderRadius:2 }} />
            </div>
          ))}
          <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:5, padding:"5px 7px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
              <div style={{ width:50, height:3, background:"rgba(255,255,255,0.15)", borderRadius:2 }} />
              <div style={{ width:20, height:3, background:"rgba(0,200,255,0.5)", borderRadius:2 }} />
            </div>
            <div style={{ height:4, background:"rgba(255,255,255,0.06)", borderRadius:2, overflow:"hidden" }}>
              <div style={{ width:"72%", height:"100%", background:"linear-gradient(90deg,#00c8ff,#22d3ee)", borderRadius:2 }} />
            </div>
          </div>
        </div>
      </div>
      <div style={{ height:3, width:"100%", background:"linear-gradient(to bottom,rgba(255,255,255,0.07),transparent)" }} />
      <div style={{ width:305, height:13, background:"#111118", borderRadius:"0 0 7px 7px", border:"1px solid rgba(255,255,255,0.08)", borderTop:"none", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{ width:44, height:6, border:"1px solid rgba(255,255,255,0.1)", borderRadius:2 }} />
      </div>
    </div>
  );
}

/* ─────────────────────── CLOUD MOCKUP ─────────────────────── */
function CloudMockup() {
  return (
    <div className="dw-phone-wrap">
      <div className="dw-badge dw-badge-1">📧 Correo corporativo</div>
      <div className="dw-badge dw-badge-2">☁️ Drive sincronizado</div>
      <div className="dw-badge dw-badge-3">🔒 MFA activo</div>
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
              </div>
            </div>
            <div className="dw-mock-hero">
              <div className="dw-mock-line m50 bold" />
              <div className="dw-mock-line m75" />
            </div>
            {[1,2,3,4].map(i => (
              <div key={i} className="dw-mock-section" style={{ paddingTop:10, paddingBottom:10 }}>
                <div className="dw-mock-line bold" style={{ width: i % 2 === 0 ? "80%" : "65%" }} />
                <div className="dw-mock-line" style={{ width:"90%" }} />
              </div>
            ))}
            <div className="dw-mock-cards">
              <div className="dw-mock-card" /><div className="dw-mock-card" />
            </div>
            <div className="dw-mock-footer">
              <div className="dw-mock-line m50" />
              <div className="dw-mock-line short" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── SECURITY MOCKUP ─────────────────────── */
function SecurityMockup() {
  return (
    <div className="flex items-center justify-center py-6" aria-hidden="true">
      <div style={{ width:260, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, padding:18, display:"flex", flexDirection:"column", gap:10 }}>
        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", gap:8, paddingBottom:10, borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ width:28, height:28, borderRadius:7, background:"rgba(34,211,238,0.1)", border:"1px solid rgba(34,211,238,0.25)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="1.5" style={{ width:14, height:14 }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div>
            <div style={{ width:80, height:5, background:"rgba(255,255,255,0.2)", borderRadius:3, marginBottom:4 }} />
            <div style={{ width:50, height:3, background:"rgba(34,211,238,0.4)", borderRadius:3 }} />
          </div>
          <div style={{ marginLeft:"auto", fontSize:"0.6rem", fontWeight:700, color:"#4ade80", background:"rgba(74,222,128,0.1)", border:"1px solid rgba(74,222,128,0.25)", borderRadius:20, padding:"2px 8px" }}>SEGURO</div>
        </div>
        {/* Risk items */}
        {[
          { label:"Vulnerabilidades red",     score:92, color:"#4ade80" },
          { label:"Seguridad contraseñas",     score:78, color:"#22d3ee" },
          { label:"Backups verificados",       score:95, color:"#4ade80" },
          { label:"Software actualizado",      score:60, color:"#f59e0b" },
        ].map((item) => (
          <div key={item.label}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
              <span style={{ fontSize:"0.65rem", color:"rgba(255,255,255,0.5)" }}>{item.label}</span>
              <span style={{ fontSize:"0.65rem", fontWeight:700, color:item.color }}>{item.score}%</span>
            </div>
            <div style={{ height:3, background:"rgba(255,255,255,0.06)", borderRadius:2, overflow:"hidden" }}>
              <div style={{ width:`${item.score}%`, height:"100%", background:item.color, borderRadius:2, opacity:0.8 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────── INFRA MOCKUP ─────────────────────── */
function InfraMockup() {
  return (
    <div className="flex items-center justify-center py-4" aria-hidden="true">
      <div style={{ display:"flex", flexDirection:"column", gap:8, width:240 }}>
        {/* Router */}
        <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(34,211,238,0.2)", borderRadius:10, padding:"10px 14px", display:"flex", alignItems:"center", gap:10 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="1.5" style={{ width:18, height:18, flexShrink:0 }}><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1" fill="#22d3ee"/></svg>
          <div style={{ flex:1 }}>
            <div style={{ width:70, height:4, background:"rgba(255,255,255,0.2)", borderRadius:2, marginBottom:4 }} />
            <div style={{ width:90, height:3, background:"rgba(255,255,255,0.08)", borderRadius:2 }} />
          </div>
          <div style={{ width:7, height:7, borderRadius:"50%", background:"#4ade80", boxShadow:"0 0 6px #4ade80" }} />
        </div>
        {/* Clients */}
        <div style={{ display:"flex", gap:6 }}>
          {["PC 01","PC 02","PC 03"].map((label) => (
            <div key={label} style={{ flex:1, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:8, padding:"8px 6px", display:"flex", flexDirection:"column", alignItems:"center", gap:5 }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" style={{ width:16, height:16 }}><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
              <div style={{ width:"80%", height:3, background:"rgba(255,255,255,0.1)", borderRadius:2 }} />
              <div style={{ width:5, height:5, borderRadius:"50%", background:"#4ade80" }} />
            </div>
          ))}
        </div>
        {/* NAS */}
        <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:10, padding:"10px 14px", display:"flex", alignItems:"center", gap:10 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" style={{ width:18, height:18, flexShrink:0 }}><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>
          <div style={{ flex:1 }}>
            <div style={{ width:50, height:4, background:"rgba(255,255,255,0.15)", borderRadius:2, marginBottom:4 }} />
            <div style={{ height:3, background:"rgba(255,255,255,0.06)", borderRadius:2, overflow:"hidden" }}>
              <div style={{ width:"68%", height:"100%", background:"rgba(34,211,238,0.5)", borderRadius:2 }} />
            </div>
          </div>
          <span style={{ fontSize:"0.55rem", color:"rgba(34,211,238,0.7)", fontWeight:700 }}>68%</span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── SECTION VISUAL ─────────────────────── */
function TabVisual({ tab, accordion }: { tab: string; accordion: typeof SOPORTE_ACC | null }) {
  if (tab === "Soporte IT") {
    return (
      <div className="dw-split mb-14">
        {accordion && <Accordion items={accordion} />}
        <div className="relative flex items-center justify-center py-10">
          <div className="hero-float-card hero-float-a" style={{ position:"absolute", top:"5%", right:"-4%", zIndex:2 }}>
            <svg viewBox="0 0 23 23" width="20" height="20"><path fill="#f25022" d="M0 0h11v11H0z"/><path fill="#00a4ef" d="M12 0h11v11H12z"/><path fill="#7fba00" d="M0 12h11v11H0z"/><path fill="#ffb900" d="M12 12h11v11H12z"/></svg>
            <span>Windows 11</span>
          </div>
          <div className="hero-float-card hero-float-b" style={{ position:"absolute", top:"44%", left:"-4%", zIndex:2 }}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="white"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.15-2.19 1.35-2.16 4.02.03 3.2 2.81 4.27 2.84 4.28-.03.07-.44 1.51-1.43 3.27z"/><path d="M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
            <span>macOS</span>
          </div>
          <div className="hero-float-card hero-float-c" style={{ position:"absolute", bottom:"5%", right:"-2%", zIndex:2 }}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm4 0h-2v-2h2v2zm1-5.5c-.28.5-.78.9-1.38 1.06L14 12v1h-4v-1l-.62-.44C8.78 11.4 8.28 11 8 10.5 7.64 9.84 7.5 9.14 7.5 8.5c0-2.49 2.01-4.5 4.5-4.5s4.5 2.01 4.5 4.5c0 .64-.14 1.34-.5 2z"/></svg>
            <span>Linux</span>
          </div>
          <LaptopMockup />
        </div>
      </div>
    );
  }
  if (tab === "Cloud") {
    return (
      <div className="dw-split mb-14">
        {accordion && <Accordion items={accordion} />}
        <CloudMockup />
      </div>
    );
  }
  if (tab === "Seguridad") {
    return (
      <div className="dw-split mb-14">
        {accordion && <Accordion items={accordion} />}
        <SecurityMockup />
      </div>
    );
  }
  if (tab === "Infraestructura") {
    return (
      <div className="dw-split mb-14">
        {accordion && <Accordion items={accordion} />}
        <InfraMockup />
      </div>
    );
  }
  return null;
}

/* ─────────────────────── PAGE ─────────────────────── */
export default function ServiciosITPage() {
  const [tab, setTab] = useState("Soporte IT");

  const info = TAB_INFO[tab];

  const accordionMap: Record<string, typeof SOPORTE_ACC | null> = {
    "Soporte IT":       SOPORTE_ACC,
    "Cloud":            CLOUD_ACC,
    "Seguridad":        SEGURIDAD_ACC,
    "Infraestructura":  INFRA_ACC,
    "Bolsas de Horas":  null,
  };

  return (
    <div className="min-h-screen" style={{ background:"#050505", color:"#fff" }}>

      <SiteHeader />

      {/* ── HERO ── */}
      <section className="pt-36 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-6 h-px bg-cyan-400" />
            <span className="text-xs font-bold tracking-widest text-cyan-400 uppercase">Servicios IT · Novitic</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-none mb-4">
            Soluciones<br />tecnológicas
          </h1>
          <p className="text-lg max-w-xl leading-relaxed" style={{ color:"rgba(255,255,255,0.45)" }}>
            Soporte integral, cloud, ciberseguridad e infraestructura para que tu negocio funcione al máximo rendimiento.
          </p>
        </div>
      </section>

      {/* ── TABS (sticky) ── */}
      <div
        className="sticky top-16 z-40 border-b"
        style={{ background:"rgba(5,5,5,0.95)", backdropFilter:"blur(20px)", borderColor:"rgba(255,255,255,0.08)" }}
      >
        <div className="max-w-6xl mx-auto px-6 overflow-x-auto">
          <div className="flex items-center gap-1 py-2 w-max">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap"
                style={
                  tab === t
                    ? { background:"rgba(34,211,238,0.12)", color:"#22d3ee", border:"1px solid rgba(34,211,238,0.3)" }
                    : { background:"transparent", color:"rgba(255,255,255,0.4)", border:"1px solid transparent" }
                }
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

          {/* Intro de la categoría */}
          <div className="mb-14">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-6 h-px bg-cyan-400" />
              <span className="text-xs font-bold tracking-widest text-cyan-400 uppercase">{info.acento}</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-6">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight max-w-lg">
                {info.titulo}
              </h2>
              <p className="text-sm max-w-sm leading-relaxed" style={{ color:"rgba(255,255,255,0.45)" }}>
                {info.sub}
              </p>
            </div>
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {info.badges.map(b => (
                <span key={b} className="text-xs px-3 py-1.5 rounded-full" style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", color:"rgba(255,255,255,0.6)" }}>
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Visual + Accordion (todos menos Bolsas) */}
          {tab !== "Bolsas de Horas" && (
            <TabVisual tab={tab} accordion={accordionMap[tab]} />
          )}

          {/* ── PLANES / PRICING ── */}
          {tab !== "Bolsas de Horas" && PLANS[tab] && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <span className="w-4 h-px bg-cyan-400/50" />
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color:"rgba(255,255,255,0.3)" }}>Planes y tarifas</span>
              </div>
              <div className={`grid gap-4 ${PLANS[tab].length === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-3"}`}>
                {PLANS[tab].map((p) => (
                  <div
                    key={p.nombre}
                    className="relative flex flex-col rounded-2xl overflow-hidden transition-transform hover:-translate-y-1"
                    style={{
                      background: p.destacado ? "rgba(34,211,238,0.05)" : "rgba(255,255,255,0.03)",
                      border: p.destacado ? "1px solid rgba(34,211,238,0.25)" : "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    {p.destacado && (
                      <div className="absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background:"rgba(34,211,238,0.15)", color:"#22d3ee", border:"1px solid rgba(34,211,238,0.3)" }}>
                        Más popular
                      </div>
                    )}
                    <div className="px-5 pt-5 pb-4" style={{ borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
                      <p className="text-sm font-bold text-white mb-3">{p.nombre}</p>
                      <div className="flex items-baseline gap-2">
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
                          <CheckCircle2 size={12} className="text-cyan-400 mt-0.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="px-5 pb-5">
                      <Link href="/#contacto" className="block w-full text-center py-2.5 rounded-xl text-xs font-semibold transition-all"
                        style={p.destacado
                          ? { background:"rgba(34,211,238,0.12)", color:"#22d3ee", border:"1px solid rgba(34,211,238,0.3)" }
                          : { background:"rgba(255,255,255,0.05)", color:"rgba(255,255,255,0.5)", border:"1px solid rgba(255,255,255,0.1)" }}>
                        Solicitar información
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── BOLSAS DE HORAS ── */}
          {tab === "Bolsas de Horas" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {BOLSAS.map((b) => (
                  <div
                    key={b.nombre}
                    className="relative rounded-2xl p-6 transition-transform hover:-translate-y-1"
                    style={{
                      background: b.destacado ? "rgba(34,211,238,0.05)" : "rgba(255,255,255,0.03)",
                      border: b.destacado ? "1px solid rgba(34,211,238,0.25)" : "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    {b.destacado && (
                      <div className="absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background:"rgba(34,211,238,0.15)", color:"#22d3ee", border:"1px solid rgba(34,211,238,0.3)" }}>
                        Más popular
                      </div>
                    )}
                    <div className="text-4xl font-bold text-white mb-1">{b.horas}h</div>
                    <div className="text-2xl font-bold mb-1" style={{ color:"#22d3ee" }}>{b.precio}€</div>
                    <div className="text-xs mb-5" style={{ color:"rgba(255,255,255,0.35)" }}>{b.precioHora}€/hora · caduca en {b.caducidad}</div>
                    <ul className="space-y-2 mb-5">
                      {["Soporte técnico IT","Acumulable con mantenimiento","Transferible a otro proyecto"].map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs" style={{ color:"rgba(255,255,255,0.6)" }}>
                          <CheckCircle2 size={12} className="text-cyan-400 shrink-0" />{item}
                        </li>
                      ))}
                    </ul>
                    <Link href="/#contacto" className="block w-full text-center py-2.5 rounded-xl text-xs font-semibold transition-all"
                      style={b.destacado
                        ? { background:"rgba(34,211,238,0.12)", color:"#22d3ee", border:"1px solid rgba(34,211,238,0.3)" }
                        : { background:"rgba(255,255,255,0.05)", color:"rgba(255,255,255,0.5)", border:"1px solid rgba(255,255,255,0.1)" }}>
                      Contratar bolsa
                    </Link>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl overflow-hidden" style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)" }}>
                <div className="px-6 py-4" style={{ borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
                  <p className="text-sm font-semibold text-white">Tarifa hora suelta</p>
                  <p className="text-xs mt-0.5" style={{ color:"rgba(255,255,255,0.35)" }}>Sin bolsa prepagada · Con contrato de mantenimiento IT, tarifa preferente de 40€/h</p>
                </div>
                <div className="grid grid-cols-3 divide-x" style={{ borderColor:"rgba(255,255,255,0.07)" }}>
                  {[
                    { label:"Soporte remoto",               precio:"50€/h",          highlight:false },
                    { label:"Presencial (área Barcelona)",   precio:"50€/h + despl.", highlight:false },
                    { label:"Con contrato mantenimiento IT", precio:"40€/h",          highlight:true  },
                  ].map((item) => (
                    <div key={item.label} className="px-6 py-5 text-center" style={{ borderColor:"rgba(255,255,255,0.07)" }}>
                      <p className="text-xs mb-1" style={{ color:"rgba(255,255,255,0.35)" }}>{item.label}</p>
                      <p className="text-xl font-bold" style={{ color: item.highlight ? "#22d3ee" : "#fff" }}>{item.precio}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-6 border-t" style={{ borderColor:"rgba(255,255,255,0.08)" }}>
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="w-6 h-px bg-cyan-400" />
            <span className="text-xs font-bold tracking-widest text-cyan-400 uppercase">¿Hablamos?</span>
            <span className="w-6 h-px bg-cyan-400" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Necesitas soporte IT<br />para tu empresa?</h2>
          <p className="mb-8 leading-relaxed" style={{ color:"rgba(255,255,255,0.45)" }}>
            Cuéntanos tu situación y te preparamos una propuesta sin compromiso. Respondemos en menos de 24h.
          </p>
          <Link href="/#contacto" className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all"
            style={{ background:"rgba(34,211,238,0.12)", color:"#22d3ee", border:"1px solid rgba(34,211,238,0.3)" }}>
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
