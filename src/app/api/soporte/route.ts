import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Incidencia from "@/models/Incidencia";
import Cliente from "@/models/Cliente";
import { sendTicketConfirmacion, sendTicketNotificacionInterna } from "@/lib/mailer";

// Simple in-memory rate limiter: max 5 requests per IP per 10 minutes
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= LIMIT) return false;
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Demasiadas solicitudes. Inténtalo más tarde." }, { status: 429 });
  }
  await connectToDatabase();
  const { email, nombre, titulo, descripcion, prioridad } = await req.json();

  if (!email?.trim() || !titulo?.trim()) {
    return NextResponse.json({ error: "Email y título son obligatorios" }, { status: 400 });
  }

  // Buscar cliente por email para enlazarlo automáticamente
  const cliente = await Cliente.findOne({ email: email.trim().toLowerCase() });

  const incidencia = await Incidencia.create({
    clienteId: cliente?._id ?? undefined,
    emailContacto: email.trim().toLowerCase(),
    titulo: titulo.trim(),
    descripcion: descripcion?.trim() ?? "",
    prioridad: prioridad ?? "media",
    estado: "abierta",
  });

  const ticketOpts = {
    ticketId: String(incidencia._id),
    titulo: titulo.trim(),
    descripcion: descripcion?.trim(),
    prioridad: prioridad ?? "media",
    emailCliente: email.trim().toLowerCase(),
    nombreCliente: nombre?.trim() || undefined,
  };

  // Enviar emails en paralelo — si falla el envío el ticket ya está creado
  await Promise.allSettled([
    sendTicketConfirmacion(ticketOpts),
    sendTicketNotificacionInterna(ticketOpts),
  ]);

  return NextResponse.json({ ok: true, ticketId: String(incidencia._id) });
}
