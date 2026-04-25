import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Novitic · Diseño Web & Servicios IT en Barcelona | Sant Boi de Llobregat",
  description: "Empresa de diseño web y servicios informáticos en Barcelona y Sant Boi de Llobregat. Páginas web profesionales, tiendas online, mantenimiento informático y consultoría IT para empresas del Baix Llobregat.",
  keywords: "diseño web Barcelona, servicios IT Barcelona, mantenimiento informático Sant Boi de Llobregat, páginas web empresas Barcelona, desarrollo web Baix Llobregat, empresa informática Barcelona",
  openGraph: {
    title: "Novitic · Diseño Web & Servicios IT en Barcelona",
    description: "Páginas web profesionales y servicios informáticos para empresas en Barcelona, Sant Boi de Llobregat y Baix Llobregat.",
    locale: "es_ES",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      {/* suppressHydrationWarning: evita que React loguee warnings de "hydration mismatch"
          cuando extensiones del navegador u otros factores inyectan atributos en el DOM
          que no están presentes en el HTML servidor. Seguiremos investigando la causa. */}
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
