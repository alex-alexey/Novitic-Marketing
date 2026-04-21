"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  Megaphone,
  Send,
  LogOut,
  ChevronRight,
  Package,
  Building2,
  Receipt,
  AlertCircle,
  LayoutGrid,
} from "lucide-react";

const clientesItems = [
  { href: "/clientes/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/clientes", label: "Clientes", icon: Building2, exact: true },
  { href: "/facturacion", label: "Facturación", icon: Receipt },
  { href: "/incidencias", label: "Incidencias", icon: AlertCircle },
];

const marketingItems = [
  { href: "/", label: "Inicio", icon: LayoutDashboard, exact: true },
  { href: "/contactos", label: "Contactos", icon: Users },
  { href: "/campanas", label: "Campañas", icon: Megaphone },
  { href: "/enviados", label: "Enviados", icon: Send },
];

const otherItems = [
  { href: "/servicios", label: "Servicios", icon: Package },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  function NavLink({ href, label, icon: Icon, exact }: { href: string; label: string; icon: React.ElementType; exact?: boolean }) {
    return (
      <Link
        href={href}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group ${
          isActive(href, exact)
            ? "bg-blue-600 text-white"
            : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
        }`}
      >
        <Icon size={18} />
        <span className="flex-1">{label}</span>
        {isActive(href, exact) && <ChevronRight size={14} />}
      </Link>
    );
  }

  return (
    <aside className="w-64 min-h-screen bg-zinc-900 flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-zinc-800">
        <h1 className="text-white font-bold text-lg tracking-tight">
          Novitic <span className="text-blue-400">Marketing</span>
        </h1>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4">
        {/* Gestión de Clientes */}
        <p className="px-3 mb-1 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Gestión de Clientes</p>
        <div className="space-y-1 mb-4">
          {clientesItems.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </div>
        {/* Marketing section */}
        <p className="px-3 mb-1 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Marketing</p>
        <div className="space-y-1 mb-4">
          {marketingItems.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </div>
        {/* Other */}
        <p className="px-3 mb-1 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Catálogo</p>
        <div className="space-y-1">
          {otherItems.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </div>
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-zinc-800">
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
            {session?.user?.name?.[0]?.toUpperCase() ?? "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{session?.user?.name}</p>
            <p className="text-zinc-500 text-xs truncate">{session?.user?.email}</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white text-sm font-medium transition-colors"
        >
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
