import { FileText, Plus } from "lucide-react";
import Link from "next/link";

export default function PlantillasPage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">Plantillas</h2>
          <p className="text-zinc-500 mt-1">Diseña plantillas de email reutilizables para tus campañas</p>
        </div>
        <Link
          href="/dashboard/plantillas/nueva"
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus size={16} />
          Crear plantilla
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-zinc-100">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mb-4">
            <FileText size={24} className="text-amber-600" />
          </div>
          <h3 className="text-base font-semibold text-zinc-900 mb-1">Sin plantillas aún</h3>
          <p className="text-sm text-zinc-500 max-w-xs">
            Crea plantillas HTML reutilizables para agilizar el envío de tus campañas.
          </p>
        </div>
      </div>
    </div>
  );
}
