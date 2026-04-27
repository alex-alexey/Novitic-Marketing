"use client";

import { useState } from "react";
import { Wrench, Cloud, Shield, Clock, CheckCircle2, Star, Zap, Server, Wifi } from "lucide-react";
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
  destacado: boolean;
  incluye: string[];
  noIncluye?: string[];
  plazo: string;
}

const SOPORTE: Servicio[] = [
  {
    id: "soporte-basico",
    categoria: "Soporte IT",
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
    categoria: "Soporte IT",
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
    id: "soporte-premium",
    categoria: "Soporte IT",
    icon: Server,
    color: "blue",
    nombre: "Soporte Premium",
    descripcion: "Para empresas de más de 15 usuarios con infraestructura crítica. Soporte prioritario, SLA garantizado y gestión proactiva.",
    precio: null,
    precioTipo: "Personalizado",
    destacado: false,
    incluye: [
      "Horas ilimitadas de soporte remoto prioritario",
      "Visitas presenciales ilimitadas (área metropolitana Barcelona)",
      "SLA garantizado: respuesta en máx. 1h laborable",
      "Gestor IT dedicado con revisión quincenal",
      "Gestión de servidores on-premise o cloud (AWS, Azure, GCP)",
      "Backup diario con retención de 90 días y prueba de restauración mensual",
      "EDR + SIEM gestionado: alertas en tiempo real",
      "Gestión completa de licencias Microsoft / Google / Adobe",
      "Inventario de hardware y software actualizado",
      "Plan de continuidad de negocio (BCP) documentado",
      "Informe ejecutivo mensual + reunión de seguimiento",
    ],
    noIncluye: [
      "Compra de hardware (se gestiona al coste del proveedor)",
    ],
    plazo: "Contrato mínimo 3 meses",
  },
];

const CLOUD: Servicio[] = [
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
];

const SEGURIDAD: Servicio[] = [
  {
    id: "auditoria-seguridad",
    categoria: "Seguridad",
    icon: Shield,
    color: "green",
    nombre: "Auditoría de Seguridad",
    descripcion: "Análisis completo del estado de seguridad de tu empresa y plan de acción priorizado.",
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
  {
    id: "proteccion-edr",
    categoria: "Seguridad",
    icon: Shield,
    color: "green",
    nombre: "Protección EDR Gestionada",
    descripcion: "Antivirus de nueva generación con detección y respuesta a amenazas (EDR) gestionado centralmente. Alertas en tiempo real y respuesta rápida a incidentes.",
    precio: 8,
    precioTipo: "por equipo/mes",
    destacado: true,
    incluye: [
      "Licencia EDR (endpoint detection & response) incluida",
      "Instalación y configuración en todos los equipos",
      "Panel de control centralizado con visibilidad en tiempo real",
      "Alertas automáticas ante amenazas detectadas",
      "Respuesta a incidentes incluida (aislamiento, limpieza)",
      "Actualizaciones de firmas y motor automatizadas",
      "Informe mensual de amenazas detectadas y bloqueadas",
      "Compatible con Windows y macOS",
    ],
    noIncluye: [
      "Dispositivos móviles (Android/iOS) — precio diferente",
      "Servidores — precio diferente",
    ],
    plazo: "Despliegue en 24–48h",
  },
  {
    id: "formacion-ciberseguridad",
    categoria: "Seguridad",
    icon: Shield,
    color: "green",
    nombre: "Formación en Ciberseguridad",
    descripcion: "Taller práctico para el equipo sobre amenazas actuales (phishing, ransomware, ingeniería social) y buenas prácticas de seguridad.",
    precio: 290,
    precioTipo: "sesión (hasta 15 personas)",
    destacado: false,
    incluye: [
      "Sesión presencial o por videoconferencia (3h)",
      "Módulo 1: Phishing y correo malicioso — cómo identificarlo",
      "Módulo 2: Contraseñas seguras y gestores de contraseñas",
      "Módulo 3: Dispositivos móviles y trabajo remoto seguro",
      "Módulo 4: Ransomware — qué hacer si te atacan",
      "Simulación de phishing en vivo (con permiso de la empresa)",
      "Material en PDF descargable para cada participante",
      "Test de evaluación final con resultados por persona",
      "Certificado de participación para el equipo",
    ],
    noIncluye: [
      "Sesiones adicionales (precio reducido para clientes con mantenimiento)",
    ],
    plazo: "Disponibilidad en 1–2 semanas",
  },
];

const INFRAESTRUCTURA: Servicio[] = [
  {
    id: "red-oficina",
    categoria: "Infraestructura",
    icon: Wifi,
    color: "violet",
    nombre: "Red de Oficina",
    descripcion: "Diseño, instalación y configuración de la red Wi-Fi y cableada de tu oficina. Segmentación de red, VLANs y acceso seguro para empleados y visitas.",
    precio: 490,
    precioTipo: "único (hasta 20 equipos)",
    destacado: false,
    incluye: [
      "Estudio previo de cobertura y diseño de red",
      "Instalación y configuración de router/firewall empresarial",
      "Configuración de Wi-Fi seguro (WPA3, SSID separados empleados/visitas)",
      "Segmentación de red con VLANs",
      "Configuración de switch gestionable (si aplica)",
      "VPN de acceso remoto para el equipo",
      "Documentación de la red entregada al cliente",
      "Soporte post-instalación de 30 días",
    ],
    noIncluye: [
      "Hardware (se suministra al coste del proveedor)",
      "Obra civil o canalización de cable (se coordina con instalador)",
    ],
    plazo: "1–3 días según tamaño de la oficina",
  },
  {
    id: "servidor-nas",
    categoria: "Infraestructura",
    icon: Server,
    color: "violet",
    nombre: "Servidor NAS / Backup Local",
    descripcion: "Instalación y configuración de servidor NAS para almacenamiento centralizado, backup automático y acceso remoto seguro a los archivos de empresa.",
    precio: 350,
    precioTipo: "único (configuración)",
    destacado: true,
    incluye: [
      "Selección y asesoramiento del hardware más adecuado",
      "Instalación del sistema operativo del NAS (Synology DSM, QNAP, etc.)",
      "Configuración de RAID para redundancia de datos",
      "Carpetas compartidas por departamento con permisos",
      "Backup automático de equipos al NAS (agentes instalados)",
      "Acceso remoto seguro (VPN o QuickConnect)",
      "Sincronización con nube (como segunda copia de seguridad)",
      "Alerta de fallos de disco por email",
      "Documentación y formación básica al responsable",
    ],
    noIncluye: [
      "Hardware NAS y discos duros (se suministran al coste del proveedor)",
      "Rack o mobiliario",
    ],
    plazo: "1–2 días de configuración",
  },
];

const BOLSAS_HORAS = [
  {
    nombre: "Bolsa 5h",
    horas: 5,
    precio: 200,
    precioHora: 40,
    color: "zinc",
    descripcion: "Para tareas puntuales: pequeños cambios, configuraciones o soporte puntual.",
    caducidad: "6 meses",
    destacado: false,
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
    color: "violet",
    descripcion: "Para empresas con necesidades continuadas de soporte o infraestructura.",
    caducidad: "12 meses",
    destacado: false,
  },
];

const colorMap: Record<string, { bg: string; text: string; border: string; badge: string }> = {
  blue: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", badge: "bg-blue-100 text-blue-700" },
  sky: { bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-200", badge: "bg-sky-100 text-sky-700" },
  green: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", badge: "bg-green-100 text-green-700" },
  violet: { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200", badge: "bg-violet-100 text-violet-700" },
  zinc: { bg: "bg-zinc-50", text: "text-zinc-700", border: "border-zinc-200", badge: "bg-zinc-100 text-zinc-700" },
};

const TABS = ["Soporte IT", "Cloud", "Seguridad", "Infraestructura", "Bolsas de Horas"];

const tabIcons: Record<string, string> = {
  "Soporte IT": "🔧",
  "Cloud": "☁️",
  "Seguridad": "🔒",
  "Infraestructura": "🖧",
  "Bolsas de Horas": "⏱️",
};

const tabData: Record<string, Servicio[]> = {
  "Soporte IT": SOPORTE,
  "Cloud": CLOUD,
  "Seguridad": SEGURIDAD,
  "Infraestructura": INFRAESTRUCTURA,
};

export default function ServiciosITPage() {
  const [tab, setTab] = useState("Soporte IT");

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900">Servicios IT</h2>
        <p className="text-zinc-500 mt-1">
          Soporte, cloud, seguridad e infraestructura · Todos los precios en EUR (IVA no incluido)
        </p>
      </div>

      {/* Pestañas */}
      <div className="flex items-center gap-1 mb-8 bg-zinc-100 p-1 rounded-xl w-fit flex-wrap">
        {TABS.map((cat) => (
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

      {/* Catálogo de servicios */}
      {tab !== "Bolsas de Horas" && (
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {(tabData[tab] ?? []).map((s) => {
              const c = colorMap[s.color] ?? colorMap.zinc;
              const Icon = s.icon;
              return (
                <div
                  key={s.id}
                  className={`relative bg-white rounded-2xl border flex flex-col overflow-hidden ${
                    s.destacado
                      ? "border-blue-400 ring-2 ring-blue-100 shadow-md"
                      : "border-zinc-200 shadow-sm"
                  }`}
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
                      {s.precio !== null ? (
                        <>
                          <span className="text-2xl font-bold text-zinc-900">
                            {s.precio.toLocaleString("es-ES")}€
                          </span>
                          <span className="text-sm text-zinc-500">/ {s.precioTipo}</span>
                        </>
                      ) : (
                        <span className="text-xl font-bold text-zinc-900">{s.precioTipo}</span>
                      )}
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
                      <span className="text-xs text-zinc-500">{s.plazo}</span>
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
        </section>
      )}

      {/* Bolsas de Horas */}
      {tab === "Bolsas de Horas" && (
        <section>
          <p className="text-zinc-500 text-sm mb-6">
            Horas de soporte técnico e infraestructura prepagadas a precio reducido. Válidas para cualquier servicio IT.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            {BOLSAS_HORAS.map((plan) => {
              const c = colorMap[plan.color] ?? colorMap.zinc;
              return (
                <div
                  key={plan.nombre}
                  className={`relative bg-white rounded-2xl border p-6 ${
                    plan.destacado
                      ? "border-blue-400 ring-2 ring-blue-100 shadow-md"
                      : "border-zinc-200 shadow-sm"
                  }`}
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
                    <div className="flex items-center gap-2"><CheckCircle2 size={13} className="text-green-500" />{plan.horas} horas de soporte técnico</div>
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
                <p className="text-xs text-zinc-500 mb-1">Soporte remoto (sin mantenimiento)</p>
                <p className="text-xl font-bold text-zinc-900">50€<span className="text-sm font-normal text-zinc-400">/h</span></p>
              </div>
              <div className="px-6 py-5 text-center">
                <p className="text-xs text-zinc-500 mb-1">Soporte presencial (área Barcelona)</p>
                <p className="text-xl font-bold text-zinc-900">50€<span className="text-sm font-normal text-zinc-400">/h + despl.</span></p>
              </div>
              <div className="px-6 py-5 text-center">
                <p className="text-xs text-zinc-500 mb-1">Con contrato mantenimiento IT</p>
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
