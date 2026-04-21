"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Wand2, ChevronDown } from "lucide-react";

const CATEGORIAS = [
  { value: "pagina-web", label: "🌐 Página Web" },
  { value: "servicios-informaticos", label: "💻 Servicios Informáticos" },
  { value: "clientes", label: "⭐ Clientes actuales" },
  { value: "upsell", label: "🚀 Upsell — Venta cruzada" },
  { value: "otro", label: "📋 Otro" },
];

type Plantilla = { label: string; subject: string; body: string };

const PLANTILLAS: Record<string, Plantilla[]> = {
  "pagina-web": [
    {
      label: "He visto tu web — tiene margen de mejora",
      subject: "{{nombre}}, he echado un vistazo a la web de {{empresa}}",
      body: `<p>Hola {{nombre}},</p>

<p>Me llamo Alex, soy de <strong>Novitic</strong>, y antes de escribirte me he tomado unos minutos para revisar la web de {{empresa}}.</p>

<p>Te cuento lo que he visto — con toda la honestidad:</p>
<ul>
  <li>⚠️ La web no se adapta bien a móvil, y hoy más del 60% del tráfico viene de smartphones</li>
  <li>⚠️ La velocidad de carga es mejorable — Google penaliza las webs lentas en el posicionamiento</li>
  <li>⚠️ No aparece en los primeros resultados de Google para búsquedas de tu sector en tu zona</li>
</ul>

<p>No te digo esto para criticar — te lo digo porque son cosas que se pueden solucionar y que tienen impacto directo en los clientes que te llegan.</p>

<p>En <strong>Novitic</strong> nos especializamos exactamente en esto: coger webs con potencial y convertirlas en herramientas que realmente trabajan para el negocio.</p>

<p>¿Tienes 15 minutos esta semana para que te cuente qué haría yo con la web de {{empresa}}? Sin compromiso, solo para darte ideas.</p>

<p>Un saludo,<br/>
<strong>Alex</strong><br/>
Novitic · <a href="https://novitic.com">novitic.com</a> · info@novitic.com</p>`,
    },
    {
      label: "No tienen web — oportunidad clara",
      subject: "{{empresa}} no aparece en Google — esto tiene solución",
      body: `<p>Hola {{nombre}},</p>

<p>Soy Alex de <strong>Novitic</strong>. Buscando empresas como {{empresa}} en Google me di cuenta de que no tenéis presencia online, o si la tenéis es muy difícil de encontrar.</p>

<p>Entiendo que igual no has visto la necesidad hasta ahora — pero la realidad es que cada vez más clientes buscan proveedores en Google antes de llamar a nadie. Si no apareces, simplemente no existes para ellos.</p>

<p>Lo que haría para {{empresa}}:</p>
<ul>
  <li>🌐 Una web profesional, clara y rápida — que explique bien lo que hacéis</li>
  <li>📍 Posicionamiento local en Google — para que te encuentren clientes de tu zona</li>
  <li>📱 Adaptada a móvil desde el primer día</li>
  <li>🔧 Con panel propio para que tú puedas actualizar contenido cuando quieras</li>
</ul>

<p>¿Te parece si hablamos un momento? Te puedo mostrar ejemplos de webs que hemos hecho para negocios similares al tuyo.</p>

<p>Un saludo,<br/>
<strong>Alex</strong><br/>
Novitic · <a href="https://novitic.com">novitic.com</a> · info@novitic.com</p>`,
    },
    {
      label: "Web anticuada — renovación",
      subject: "La web de {{empresa}} transmite una imagen que no os hace justicia",
      body: `<p>Hola {{nombre}},</p>

<p>Antes de escribirte he visitado la web de {{empresa}} y quiero ser directo: el diseño y la tecnología que usa han quedado obsoletos.</p>

<p>Esto no es un juicio — es algo que pasa en muchos negocios que han crecido y mejorado, pero cuya web se quedó anclada en como era hace años. El problema es que un cliente nuevo que os encuentra online puede llevarse una impresión equivocada.</p>

<p>Una web renovada con <strong>Novitic</strong> os daría:</p>
<ul>
  <li>✅ Un diseño moderno que transmite profesionalidad y confianza</li>
  <li>✅ Carga rápida y experiencia fluida en móvil</li>
  <li>✅ Mejor posición en Google — SEO técnico incluido</li>
  <li>✅ Integración con WhatsApp, Google Maps, formularios de contacto</li>
</ul>

<p>Puedo prepararte un presupuesto en menos de 24h si me das unos minutos para entender bien vuestro negocio.</p>

<p>¿Cuándo tienes un hueco esta semana?</p>

<p>Un saludo,<br/>
<strong>Alex</strong><br/>
Novitic · <a href="https://novitic.com">novitic.com</a> · info@novitic.com</p>`,
    },
  ],
  "servicios-informaticos": [
    {
      label: "Soporte IT — empresa sin proveedor",
      subject: "{{nombre}}, ¿quién os ayuda cuando falla algo en {{empresa}}?",
      body: `<p>Hola {{nombre}},</p>

<p>Soy Alex de <strong>Novitic</strong>. Me pongo en contacto porque trabajamos con varias empresas del sector y muchas de ellas me dicen lo mismo antes de contratarnos: <em>"cuando algo falla, perdemos horas hasta resolverlo"</em>.</p>

<p>Si en {{empresa}} no tenéis un proveedor IT de confianza, eso significa que cada incidencia — un ordenador que no arranca, un correo que no funciona, un archivo que se pierde — os cuesta tiempo y dinero.</p>

<p>Lo que ofrecemos en <strong>Novitic</strong>:</p>
<ul>
  <li>⏱️ <strong>Respuesta garantizada en menos de 2 horas</strong> — por teléfono, remoto o presencial</li>
  <li>🔒 <strong>Copias de seguridad automáticas</strong> — nunca más perder un archivo importante</li>
  <li>🖥️ <strong>Gestión completa de equipos</strong> — actualizaciones, antivirus, rendimiento</li>
  <li>📞 <strong>Un solo número al que llamar</strong> — sin colas ni redireccionamientos</li>
</ul>

<p>Nuestros clientes pagan una cuota mensual fija y se olvidan de los problemas informáticos. Así de sencillo.</p>

<p>¿Tienes 10 minutos para contarme cómo tenéis montado actualmente el tema informático en {{empresa}}?</p>

<p>Un saludo,<br/>
<strong>Alex</strong><br/>
Novitic · <a href="https://novitic.com">novitic.com</a> · info@novitic.com</p>`,
    },
    {
      label: "Migración a la nube — Microsoft 365",
      subject: "{{empresa}} aún usa servidores locales — hay una alternativa mejor",
      body: `<p>Hola {{nombre}},</p>

<p>Soy Alex de <strong>Novitic</strong>. Muchas empresas como {{empresa}} siguen trabajando con servidores físicos o con versiones antiguas de Office — y cada año que pasa ese modelo se vuelve más caro y más inseguro.</p>

<p>La migración a <strong>Microsoft 365</strong> es algo que hacemos habitualmente y los resultados son siempre los mismos:</p>
<ul>
  <li>📂 Archivos accesibles desde cualquier dispositivo y lugar</li>
  <li>👥 Trabajo colaborativo en tiempo real — sin enviarse archivos por email</li>
  <li>🔐 Seguridad gestionada por Microsoft — con backups automáticos incluidos</li>
  <li>💰 Coste predecible por usuario al mes — sin sorpresas ni mantenimiento de hardware</li>
</ul>

<p>La migración la hacemos sin interrumpir vuestra actividad y con formación incluida para el equipo.</p>

<p>Si quieres, puedo prepararte un análisis rápido de lo que os costaría y lo que os ahorraría. ¿Te parece bien esta semana?</p>

<p>Un saludo,<br/>
<strong>Alex</strong><br/>
Novitic · <a href="https://novitic.com">novitic.com</a> · info@novitic.com</p>`,
    },
    {
      label: "Ciberseguridad — empresa expuesta",
      subject: "He encontrado algo en {{empresa}} que deberías saber",
      body: `<p>Hola {{nombre}},</p>

<p>Soy Alex de <strong>Novitic</strong> y te escribo porque hacemos análisis de seguridad básicos de forma rutinaria, y {{empresa}} ha salido en nuestro radar con algunos puntos de atención.</p>

<p>No quiero alarmarte — no es nada grave de momento — pero sí quería avisarte antes de que lo sea:</p>
<ul>
  <li>⚠️ Dominio o servicios expuestos sin protección adecuada</li>
  <li>⚠️ Ausencia de filtros antiphishing en el correo corporativo</li>
  <li>⚠️ Posible uso de software sin actualizar (vector de entrada habitual en ransomware)</li>
</ul>

<p>Los ataques a pymes han subido un 40% en el último año. La mayoría no vienen de hackers sofisticados — vienen de empleados que hacen clic en un email falso o de sistemas sin parchear.</p>

<p>En <strong>Novitic</strong> ofrecemos una <strong>auditoría de seguridad gratuita</strong> para que sepas exactamente en qué punto estáis. Sin coste, sin compromiso.</p>

<p>¿Te interesa? Con una videollamada de 30 minutos tenemos suficiente.</p>

<p>Un saludo,<br/>
<strong>Alex</strong><br/>
Novitic · <a href="https://novitic.com">novitic.com</a> · info@novitic.com</p>`,
    },
  ],
  clientes: [
    {
      label: "Servicio adicional — ampliar lo que ya tienen",
      subject: "{{nombre}}, ¿hablamos de lo que podemos añadir en {{empresa}}?",
      body: `<p>Hola {{nombre}},</p>

<p>¿Qué tal todo por <strong>{{empresa}}</strong>? Espero que todo vaya bien.</p>

<p>Te escribo porque llevamos un tiempo trabajando juntos y creo que hay un paso más que podría interesarte. Dependiendo de cómo estéis ahora mismo, podría tener sentido ampliar lo que tenemos en marcha con:</p>
<ul>
  <li>🔄 <strong>Mantenimiento y actualizaciones</strong> — para que todo siga funcionando sin que tengas que preocuparte</li>
  <li>📈 <strong>Mejoras de rendimiento o diseño</strong> — pequeños cambios que marcan diferencia</li>
  <li>📧 <strong>Email corporativo profesional</strong> — si aún usáis correos genéricos</li>
  <li>🔐 <strong>Copias de seguridad automáticas</strong> — protección ante cualquier imprevisto</li>
</ul>

<p>No es una propuesta genérica — es algo que he pensado específicamente para {{empresa}} según lo que ya conozco de vosotros.</p>

<p>¿Tienes 15 minutos esta semana para hacer una llamada rápida?</p>

<p>Un saludo,<br/>
<strong>Alex</strong><br/>
Novitic · <a href="https://novitic.com">novitic.com</a> · info@novitic.com</p>`,
    },
    {
      label: "Revisión anual — seguimiento del servicio",
      subject: "{{nombre}}, revisión de lo que llevamos hecho en {{empresa}}",
      body: `<p>Hola {{nombre}},</p>

<p>Han pasado unos meses desde que empezamos a trabajar con <strong>{{empresa}}</strong> y quería hacer un pequeño repaso de cómo está todo.</p>

<p>Antes de escribirte he revisado el estado de vuestros servicios y en general todo está funcionando bien. Aun así, siempre hay cosas que se pueden optimizar o que conviene revisar.</p>

<p>Me gustaría hacer contigo una llamada de 20 minutos para:</p>
<ul>
  <li>✅ Revisar que todo sigue funcionando como esperabais</li>
  <li>💡 Contarte novedades que han salido y pueden ser relevantes para vosotros</li>
  <li>🗓️ Planificar lo que tiene sentido hacer en los próximos meses</li>
</ul>

<p>También aprovecho para preguntarte: <strong>¿hay algo que os esté dando problemas o que queráis mejorar?</strong> Cuéntame y lo miramos.</p>

<p>¿Cuándo tienes un hueco?</p>

<p>Un saludo,<br/>
<strong>Alex</strong><br/>
Novitic · <a href="https://novitic.com">novitic.com</a> · info@novitic.com</p>`,
    },
    {
      label: "Referidos — pedir recomendación",
      subject: "{{nombre}}, una petición personal",
      body: `<p>Hola {{nombre}},</p>

<p>Espero que todo vaya genial en <strong>{{empresa}}</strong>. Ha sido un placer trabajar con vosotros y espero que sigamos haciéndolo durante mucho tiempo.</p>

<p>Te escribo para pedirte algo directamente: <strong>¿conoces a algún empresario o directivo que pueda necesitar lo que hacemos?</strong></p>

<p>No te pido que vendas nada — simplemente, si en algún momento alguien de tu entorno te comenta que tiene un problema con su web, con sus ordenadores o con cualquier tema de tecnología, estaría muy agradecido si nos mencionas.</p>

<p>Como forma de agradecerte cualquier presentación que nos hagas, te invitamos a <strong>un mes de servicio gratuito</strong> si el contacto que nos presentes acaba siendo cliente.</p>

<p>Gracias por confiar en nosotros, {{nombre}}. Lo valoramos de verdad.</p>

<p>Un saludo,<br/>
<strong>Alex</strong><br/>
Novitic · <a href="https://novitic.com">novitic.com</a> · info@novitic.com</p>`,
    },
  ],
  upsell: [
    {
      label: "Upsell SEO — clientes con web",
      subject: "{{nombre}}, vuestra web está bien — ahora hay que hacer que os encuentren",
      body: `<p>Hola {{nombre}},</p>

<p>Llevamos un tiempo trabajando con <strong>{{empresa}}</strong> y la web está funcionando bien. Pero hay algo en lo que todavía no hemos entrado y que creo que podría marcar una diferencia real para vosotros: <strong>el posicionamiento en Google (SEO)</strong>.</p>

<p>Tener una buena web es el primer paso. El segundo es que los clientes te encuentren cuando buscan lo que ofreces. Ahora mismo, sin SEO, dependéis de que alguien ya os conozca o de que os lleguen por recomendación.</p>

<p>Lo que incluiría el servicio SEO para <strong>{{empresa}}</strong>:</p>
<ul>
  <li>🔍 <strong>Auditoría de palabras clave</strong> — qué busca vuestro cliente ideal en Google</li>
  <li>📝 <strong>Optimización de contenido</strong> — textos, títulos y estructura pensados para posicionar</li>
  <li>📍 <strong>SEO local</strong> — aparecer en Google Maps y búsquedas de vuestra zona</li>
  <li>📊 <strong>Informes mensuales</strong> — para que veáis la evolución y el impacto real</li>
</ul>

<p>Los primeros resultados se ven normalmente entre 2 y 4 meses. Es una inversión que crece con el tiempo — no un gasto puntual.</p>

<p>¿Te parece bien que hablemos esta semana? Puedo prepararte un análisis inicial gratuito de cómo está {{empresa}} ahora mismo en Google.</p>

<p>Un saludo,<br/>
<strong>Alex</strong><br/>
Novitic · <a href="https://novitic.com">novitic.com</a> · info@novitic.com</p>`,
    },
    {
      label: "Upsell IT — clientes sin soporte informático",
      subject: "{{nombre}}, una cosa que no hemos hablado aún en {{empresa}}",
      body: `<p>Hola {{nombre}},</p>

<p>¿Qué tal todo por <strong>{{empresa}}</strong>? Espero que bien.</p>

<p>Te escribo porque llevamos tiempo colaborando en la parte de web y quería comentarte algo que suele pasar desapercibido hasta que hay un problema: <strong>¿cómo tenéis gestionado el tema informático del día a día?</strong></p>

<p>Me refiero a los ordenadores, el correo corporativo, los backups, la seguridad... Muchas empresas van tirando sin un proveedor IT de confianza y lo gestionan ellos mismos o esperan a que algo falle. El problema es que cuando algo falla de verdad — un ransomware, un disco duro, una cuenta hackeada — el coste en tiempo y dinero es mucho mayor que el de tener un servicio preventivo.</p>

<p>Lo que ofrecería a <strong>{{empresa}}</strong> como cliente existente:</p>
<ul>
  <li>⏱️ <strong>Soporte IT remoto y presencial</strong> — respuesta en menos de 2 horas</li>
  <li>🔒 <strong>Copias de seguridad automáticas</strong> — todo protegido sin que tengáis que hacer nada</li>
  <li>🖥️ <strong>Gestión de equipos</strong> — actualizaciones, antivirus y mantenimiento preventivo</li>
  <li>💰 <strong>Cuota mensual fija</strong> — sin sorpresas, con prioridad al ser cliente nuestro</li>
</ul>

<p>Si ya contáis con alguien para esto, perfecto. Pero si no es el caso o si estáis contentos con lo que hacemos y queréis ampliar la colaboración, creo que tiene todo el sentido hablarlo.</p>

<p>¿Tienes 15 minutos esta semana?</p>

<p>Un saludo,<br/>
<strong>Alex</strong><br/>
Novitic · <a href="https://novitic.com">novitic.com</a> · info@novitic.com</p>`,
    },
    {
      label: "Upsell pack IT + SEO — oferta combinada",
      subject: "{{nombre}}, una propuesta pensada para {{empresa}}",
      body: `<p>Hola {{nombre}},</p>

<p>Llevamos un tiempo trabajando bien juntos y quería aprovechar esa confianza para hacerte una propuesta que creo que encaja con el momento en el que está <strong>{{empresa}}</strong>.</p>

<p>He estado pensando en cómo podríamos ayudaros a crecer de forma más completa — no solo con la web, sino con todo lo que la rodea. Y hay dos áreas concretas donde creo que tenéis mucho margen:</p>

<p><strong>1. SEO — que os encuentren en Google</strong></p>
<p>Tener una buena web es el punto de partida. El siguiente paso es que vuestros clientes potenciales os encuentren cuando buscan lo que ofrecéis. Con un trabajo de posicionamiento bien hecho, {{empresa}} puede aparecer en los primeros resultados para las búsquedas clave de vuestro sector y zona.</p>

<p><strong>2. Soporte IT — tecnología sin interrupciones</strong></p>
<p>Ordenadores, correo, backups, seguridad... son cosas que cuando funcionan no se notan, pero cuando fallan paralizan el negocio. Con nuestro servicio IT mensual tenéis un equipo detrás que se ocupa de todo esto de forma proactiva.</p>

<p>La ventaja de contratar ambas cosas con nosotros es que lo coordinamos todo — web, posicionamiento e infraestructura — y vosotros os centráis en lo que sabéis hacer.</p>

<p>Para clientes existentes tenemos condiciones preferentes. ¿Te parece bien que preparemos una propuesta específica para {{empresa}} y la revisamos juntos?</p>

<p>Un saludo,<br/>
<strong>Alex</strong><br/>
Novitic · <a href="https://novitic.com">novitic.com</a> · info@novitic.com</p>`,
    },
  ],
  otro: [
    {
      label: "Primer contacto — propuesta abierta",
      subject: "{{nombre}}, una idea para {{empresa}}",
      body: `<p>Hola {{nombre}},</p>

<p>Me llamo Alex y soy de <strong>Novitic</strong>, una empresa de tecnología con sede en España.</p>

<p>Te escribo porque he estado mirando {{empresa}} y creo que hay cosas en las que podríamos ayudaros — ya sea en tecnología, presencia online o ambas.</p>

<p>No quiero enviarte un catálogo de servicios sin más. Prefiero preguntarte directamente: <strong>¿cuál es el mayor dolor de cabeza tecnológico que tienes ahora mismo en el negocio?</strong></p>

<p>Puede ser la web, los ordenadores, el correo, los backups, la facturación... lo que sea. Si está en nuestra mano, te damos una solución. Y si no, te lo digo igualmente.</p>

<p>¿Tienes 10 minutos esta semana para contarme?</p>

<p>Un saludo,<br/>
<strong>Alex</strong><br/>
Novitic · <a href="https://novitic.com">novitic.com</a> · info@novitic.com</p>`,
    },
  ],
};

interface CampaignFormProps {
  initial?: {
    name?: string;
    subject?: string;
    body?: string;
    status?: string;
    categoria?: string;
    tags?: string[];
    startDate?: string;
    endDate?: string;
  };
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  submitLabel: string;
}

export default function CampaignForm({ initial = {}, onSubmit, submitLabel }: CampaignFormProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: initial.name ?? "",
    subject: initial.subject ?? "",
    body: initial.body ?? "",
    status: initial.status ?? "borrador",
    categoria: initial.categoria ?? "otro",
    startDate: initial.startDate ? initial.startDate.slice(0, 10) : "",
    endDate: initial.endDate ? initial.endDate.slice(0, 10) : "",
  });
  const [tags, setTags] = useState<string[]>(initial.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [plantillaOpen, setPlantillaOpen] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function aplicarPlantilla(p: Plantilla) {
    setForm((prev) => ({ ...prev, subject: p.subject, body: p.body }));
    setPlantillaOpen(false);
  }

  function addTag() {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t)) setTags((prev) => [...prev, t]);
    setTagInput("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await onSubmit({ ...form, tags });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al guardar.");
    }
    setLoading(false);
  }

  const plantillasDisponibles = PLANTILLAS[form.categoria] ?? [];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {/* Nombre + Estado */}
      <div className="grid grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">Nombre de la campaña *</label>
          <input
            name="name" required value={form.name} onChange={handleChange}
            className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Ej: Campaña Mayo 2026"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">Estado</label>
          <select
            name="status" value={form.status} onChange={handleChange}
            className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
          >
            <option value="borrador">Borrador</option>
            <option value="programada">Programada</option>
            <option value="enviada">Enviada</option>
          </select>
        </div>
      </div>

      {/* Fechas de campaña */}
      <div className="grid grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">Fecha inicio</label>
          <input
            type="date" name="startDate" value={form.startDate} onChange={handleChange}
            className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">Fecha fin</label>
          <input
            type="date" name="endDate" value={form.endDate} onChange={handleChange}
            className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
          />
        </div>
      </div>

      {/* Categoría */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-2">Categoría de campaña</label>
        <div className="flex items-center gap-3 flex-wrap">
          {CATEGORIAS.map((cat) => (
            <label
              key={cat.value}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 cursor-pointer text-sm font-medium transition-colors ${
                form.categoria === cat.value
                  ? "border-purple-500 bg-purple-50 text-purple-700"
                  : "border-zinc-200 text-zinc-600 hover:border-zinc-300"
              }`}
            >
              <input
                type="radio" name="categoria" value={cat.value}
                checked={form.categoria === cat.value}
                onChange={handleChange} className="sr-only"
              />
              {cat.label}
            </label>
          ))}

          {/* Dropdown de plantillas */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setPlantillaOpen(!plantillaOpen)}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              <Wand2 size={14} />
              Usar ejemplo
              <ChevronDown size={13} className={`transition-transform ${plantillaOpen ? "rotate-180" : ""}`} />
            </button>
            {plantillaOpen && (
              <div className="absolute left-0 top-full mt-1 w-72 bg-white border border-zinc-200 rounded-xl shadow-lg z-10 overflow-hidden">
                {plantillasDisponibles.map((p, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => aplicarPlantilla(p)}
                    className="w-full text-left px-4 py-3 text-sm hover:bg-purple-50 transition-colors border-b border-zinc-100 last:border-0"
                  >
                    <p className="font-medium text-zinc-800">{p.label}</p>
                    <p className="text-xs text-zinc-500 truncate mt-0.5">{p.subject}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Asunto */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">Asunto del email *</label>
        <input
          name="subject" required value={form.subject} onChange={handleChange}
          className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Ej: ¡Descubre las novedades de Novitic!"
        />
      </div>

      {/* Cuerpo */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">Cuerpo del email *</label>
        <textarea
          name="body" required value={form.body} onChange={handleChange} rows={16}
          className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-y font-mono"
          placeholder="Escribe el contenido del email aquí (HTML permitido)..."
        />
        <div className="flex flex-wrap gap-2 mt-1.5">
          <span className="text-xs text-zinc-400">Variables disponibles:</span>
          {["{{nombre}}", "{{empresa}}", "{{web}}"].map((v) => (
            <code
              key={v}
              className="text-xs bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded cursor-pointer hover:bg-purple-100"
              onClick={() => setForm((p) => ({ ...p, body: p.body + v }))}
            >
              {v}
            </code>
          ))}
          <span className="text-xs text-zinc-400 ml-1">— se sustituyen automáticamente al enviar</span>
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">Tags</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag) => (
            <span key={tag} className="flex items-center gap-1 text-xs bg-purple-50 text-purple-600 px-2.5 py-1 rounded-full">
              {tag}
              <button type="button" onClick={() => setTags((p) => p.filter((t) => t !== tag))}>
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Añadir tag y pulsar Enter"
          />
          <button type="button" onClick={addTag} className="px-3 py-2 text-sm bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors">
            Añadir
          </button>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">{error}</p>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit" disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? "Guardando..." : submitLabel}
        </button>
        <button
          type="button" onClick={() => router.back()}
          className="text-zinc-600 hover:text-zinc-900 text-sm font-medium px-5 py-2.5 rounded-lg border border-zinc-300 hover:bg-zinc-50 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
