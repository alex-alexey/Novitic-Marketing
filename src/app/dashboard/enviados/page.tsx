import { connectToDatabase } from "@/lib/mongodb";
import Campaign from "@/models/Campaign";
import EmailLog from "@/models/EmailLog";
import Link from "next/link";
import { Send } from "lucide-react";

export default async function EnviadosPage() {
  await connectToDatabase();

  const campaigns = await Campaign.find({ status: "enviada" })
    .sort({ sentAt: -1 })
    .lean();

  // Obtener stats de apertura para todas las campañas a la vez
  const campaignIds = campaigns.map((c) => c._id);
  const openStats = await EmailLog.aggregate([
    { $match: { campaignId: { $in: campaignIds } } },
    {
      $group: {
        _id: "$campaignId",
        total: { $sum: 1 },
        opened: { $sum: { $cond: ["$opened", 1, 0] } },
      },
    },
  ]);
  const statsMap = new Map(
    openStats.map((s) => [String(s._id), { total: s.total, opened: s.opened }])
  );

  const categoriaLabels: Record<string, string> = {
    "pagina-web": "🌐 Página Web",
    "servicios-informaticos": "💻 Servicios IT",
    "clientes": "⭐ Clientes",
    otro: "📋 Otro",
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900">Enviados</h2>
        <p className="text-zinc-500 mt-1">
          {campaigns.length} campaña{campaigns.length !== 1 ? "s" : ""} enviada{campaigns.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-zinc-100 text-xs font-semibold text-zinc-500 uppercase tracking-wide">
          <span className="col-span-3">Campaña</span>
          <span className="col-span-3">Asunto</span>
          <span className="col-span-2">Categoría</span>
          <span className="col-span-1 text-center">Enviados</span>
          <span className="col-span-1 text-center">Abiertos</span>
          <span className="col-span-2">Periodo</span>
        </div>

        {campaigns.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-4">
              <Send size={24} className="text-green-600" />
            </div>
            <h3 className="text-base font-semibold text-zinc-900 mb-1">Sin emails enviados aún</h3>
            <p className="text-sm text-zinc-500 max-w-xs">
              Aquí aparecerán todas las campañas enviadas.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {campaigns.map((c) => {
              const stats = statsMap.get(String(c._id));
              const openRate = stats && stats.total > 0
                ? Math.round((stats.opened / stats.total) * 100)
                : 0;
              return (
                <div key={String(c._id)} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-zinc-50 transition-colors">
                  <span className="col-span-3 text-sm font-medium text-zinc-900 truncate">
                    <Link href={`/dashboard/enviados/${c._id}`} className="hover:text-blue-600 hover:underline">
                      {c.name}
                    </Link>
                  </span>
                  <span className="col-span-3 text-sm text-zinc-500 truncate">{c.subject}</span>
                  <span className="col-span-2 text-sm text-zinc-500">
                    {categoriaLabels[c.categoria as string] ?? "—"}
                  </span>
                  <span className="col-span-1 text-center">
                    <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                      {c.recipientCount}
                    </span>
                  </span>
                  <span className="col-span-1 text-center">
                    {stats ? (
                      <span className={`inline-flex flex-col items-center text-xs font-semibold px-2 py-1 rounded-full ${
                        openRate >= 30 ? "bg-green-100 text-green-700" :
                        openRate > 0 ? "bg-yellow-100 text-yellow-700" :
                        "bg-zinc-100 text-zinc-500"
                      }`}>
                        {stats.opened}/{stats.total}
                        <span className="font-normal">{openRate}%</span>
                      </span>
                    ) : (
                      <span className="text-zinc-300 text-xs">—</span>
                    )}
                  </span>
                  <span className="col-span-2 text-sm text-zinc-500">
                    {(c as unknown as { startDate?: string; endDate?: string }).startDate ? (
                      <span>
                        {new Date((c as unknown as { startDate: string }).startDate).toLocaleDateString("es-ES", { day: "2-digit", month: "short" })}
                        {(c as unknown as { endDate?: string }).endDate && (
                          <> → {new Date((c as unknown as { endDate: string }).endDate).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" })}</>
                        )}
                      </span>
                    ) : c.sentAt ? (
                      new Date(c.sentAt).toLocaleDateString("es-ES", {
                        day: "2-digit", month: "short", year: "numeric",
                      })
                    ) : "—"}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
