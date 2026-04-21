import { connectToDatabase } from '@/lib/mongodb';
import Cliente from '@/models/Cliente';
import Incidencia from '@/models/Incidencia';

export default async function ZonaClientePage({ params }: { params: { email: string } }) {
  const email = decodeURIComponent(params.email);
  await connectToDatabase();
  const cliente = await Cliente.findOne({ email }).lean();
  const incidencias = await Incidencia.find({ email }).sort({ createdAt: -1 }).lean();

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold">Zona cliente</h2>
      <p className="text-zinc-500 mb-4">Vista para {email}</p>

      <div className="bg-white rounded-2xl border p-6 mb-6">
        <h3 className="text-lg font-semibold mb-2">Servicios contratados</h3>
        {cliente?.serviciosContratados?.length ? (
          <ul className="space-y-2">
            {cliente.serviciosContratados.map((s: any, i: number) => (
              <li key={i} className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{s.nombre}</div>
                  <div className="text-sm text-zinc-500">{s.precio}€ {s.notas?` · ${s.notas}`:''}</div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-zinc-500">No hay servicios registrados para este email.</p>
        )}
      </div>

      <div className="bg-white rounded-2xl border p-6">
        <h3 className="text-lg font-semibold mb-2">Incidencias</h3>
        {incidencias.length === 0 ? (
          <p className="text-zinc-500">Sin incidencias</p>
        ) : (
          <ul className="space-y-3">
            {(incidencias as any[]).map((inc: any) => (
              <li key={String(inc._id)} className="border rounded p-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{inc.asunto || "Sin asunto"}</div>
                  <div className="text-sm text-zinc-500">{new Date(inc.createdAt).toLocaleString()}</div>
                </div>
                <div className="text-sm text-zinc-700 mt-2">{inc.descripcion}</div>
                <div className="text-xs text-zinc-500 mt-2">Estado: {inc.estado}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
