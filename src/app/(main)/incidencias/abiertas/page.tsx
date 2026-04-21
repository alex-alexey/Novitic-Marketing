import { redirect } from "next/navigation";

export default function IncidenciasAbiertasRedirect() {
  redirect("/incidencias?estado=abierta");
}
