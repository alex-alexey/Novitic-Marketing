import { connectToDatabase } from "@/lib/mongodb";
import Contact from "@/models/Contact";
import Campaign from "@/models/Campaign";
import { Users, Megaphone, Send } from "lucide-react";

export default async function DashboardPage() {
  await connectToDatabase();

  const [totalContacts, totalCampaigns, totalSent, emailsSent] = await Promise.all([
    Contact.countDocuments(),
    Campaign.countDocuments(),
    Campaign.countDocuments({ status: "enviada" }),
    Campaign.aggregate([{ $group: { _id: null, total: { $sum: "$recipientCount" } } }]),
  ]);

  const stats = [
    { label: "Contactos", value: totalContacts, icon: Users, color: "bg-blue-50 text-blue-600" },
    { label: "Campañas", value: totalCampaigns, icon: Megaphone, color: "bg-purple-50 text-purple-600" },
    { label: "Campañas enviadas", value: totalSent, icon: Send, color: "bg-green-50 text-green-600" },
    { label: "Emails enviados", value: emailsSent[0]?.total ?? 0, icon: Send, color: "bg-amber-50 text-amber-600" },
  ];
  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900">Dashboard</h2>
        <p className="text-zinc-500 mt-1">Bienvenido a Novitic Marketing</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${color}`}>
              <Icon size={20} />
            </div>
            <p className="text-3xl font-bold text-zinc-900">{value}</p>
            <p className="text-sm text-zinc-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100">
        <h3 className="text-base font-semibold text-zinc-900 mb-4">Acciones rápidas</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <a
            href="/contactos/nuevo"
            className="flex items-center gap-3 p-4 rounded-xl border border-zinc-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
          >
            <Users size={18} className="text-blue-600" />
            <span className="text-sm font-medium text-zinc-700 group-hover:text-blue-700">
              Añadir contacto
            </span>
          </a>
          <a
            href="/campanas/nueva"
            className="flex items-center gap-3 p-4 rounded-xl border border-zinc-200 hover:border-purple-300 hover:bg-purple-50 transition-colors group"
          >
            <Megaphone size={18} className="text-purple-600" />
            <span className="text-sm font-medium text-zinc-700 group-hover:text-purple-700">
              Nueva campaña
            </span>
          </a>
          <a
            href="/enviados"
            className="flex items-center gap-3 p-4 rounded-xl border border-zinc-200 hover:border-green-300 hover:bg-green-50 transition-colors group"
          >
            <Send size={18} className="text-green-600" />
            <span className="text-sm font-medium text-zinc-700 group-hover:text-green-700">
              Ver enviados
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
