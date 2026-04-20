import { connectToDatabase } from "@/lib/mongodb";
import Campaign from "@/models/Campaign";
import EmailLog from "@/models/EmailLog";
import Link from "next/link";
import { ArrowLeft, Mail, MailOpen } from "lucide-react";

type Params = { params: Promise<{ id: string }> };

export default async function EnviadoDetallePage({ params }: Params) {
  const { id } = await params;
  await connectToDatabase();

  const campaign = await Campaign.findById(id).lean();
  if (!campaign) return <div className="p-8 text-zinc-500">Campaña no encontrada.</div>;

  const logs = await EmailLog.find({ campaignId: id }).sort({ sentAt: -1 }).lean();

  const totalSent = logs.length;
  const totalOpened = logs.filter((l) => l.opened).length;
  const openRate = totalSent > 0 ? Math.round((totalOpened / totalSent) * 100) : 0;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/dashboard/enviados"
          className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-800 transition-colors mb-4"
        >
          <ArrowLeft size={15} />
          Volver a Enviados
        </Link>
        <h2 className="text-2xl font-bold text-zinc-900">{campaign.name as string}</h2>
        <p className="text-zinc-500 mt-1 text-sm">{campaign.subject as string}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-5 mb-8">
        <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-5">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1">Enviados</p>
          <p className="text-3xl font-bold text-zinc-900">{totalSent}</p>
        </div>
        <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-5">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1">Abiertos</p>
          <p className="text-3xl font-bold text-green-600">{totalOpened}</p>
        </div>
        <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-5">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1">Tasa de apertura</p>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-bold text-zinc-900">{openRate}%</p>
          </div>
          <div className="mt-2 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all"
              style={{ width: `${openRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tabla de destinatarios */}
      <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100">
          <h3 className="text-sm font-semibold text-zinc-800">Destinatarios</h3>
        </div>
        <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-zinc-100 text-xs font-semibold text-zinc-500 uppercase tracking-wide">
          <span className="col-span-3">Contacto</span>
          <span className="col-span-4">Email</span>
          <span className="col-span-3">Enviado</span>
          <span className="col-span-2 text-center">Estado</span>
        </div>

        {logs.length === 0 ? (
          <div className="py-16 text-center text-sm text-zinc-400">Sin registros.</div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {logs.map((log) => (
              <div key={String(log._id)} className="grid grid-cols-12 gap-4 px-6 py-3.5 items-center hover:bg-zinc-50 transition-colors">
                <span className="col-span-3 text-sm font-medium text-zinc-900 truncate">{log.contactName}</span>
                <span className="col-span-4 text-sm text-zinc-500 truncate">{log.email}</span>
                <span className="col-span-3 text-sm text-zinc-400">
                  {new Date(log.sentAt).toLocaleDateString("es-ES", {
                    day: "2-digit", month: "short", year: "numeric",
                    hour: "2-digit", minute: "2-digit",
                  })}
                </span>
                <span className="col-span-2 flex justify-center">
                  {log.opened ? (
                    <span className="flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-100 px-2.5 py-1 rounded-full">
                      <MailOpen size={12} />
                      Abierto
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 bg-zinc-100 px-2.5 py-1 rounded-full">
                      <Mail size={12} />
                      No abierto
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
