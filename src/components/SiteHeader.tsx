"use client";

import { useState, useEffect } from "react";

const NAV_LINKS = [
  { href: "/servicios-it",    label: "Servicios IT" },
  { href: "/desarrollo-web",  label: "Desarrollo Web" },
  { href: "/portafolio",       label: "Portafolio" },
  { href: "/#equipo",         label: "Equipo" },
  { href: "/blog",             label: "Blog" },
];

export default function SiteHeader() {
  const [scrolled, setScrolled]       = useState(false);
  const [mobileMenu, setMobileMenu]   = useState(false);
  const [time, setTime]               = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const update = () => {
      setTime(new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }));
    };
    update();
    const iv = setInterval(update, 1000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenu ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenu]);

  return (
    <>
      {/* SVG glow filter */}
      <svg aria-hidden="true" style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <filter id="hdr-glow" x="-.25" y="-.25" width="1.5" height="1.5">
            <feComponentTransfer><feFuncA type="table" tableValues="0 2 0" /></feComponentTransfer>
            <feGaussianBlur stdDeviation="2" />
            <feComponentTransfer result="rond"><feFuncA type="table" tableValues="-2 3" /></feComponentTransfer>
            <feMorphology operator="dilate" radius="3" />
            <feGaussianBlur stdDeviation="6" />
            <feBlend in="rond" result="glow" />
            <feComponentTransfer in="SourceGraphic"><feFuncA type="table" tableValues="0 0 1" /></feComponentTransfer>
            <feBlend in2="glow" />
          </filter>
        </defs>
      </svg>

      {/* Header */}
      <header className={`hdr-wrap${scrolled ? " scrolled" : ""}`}>
        <div className="hdr-inner">
          <div className="hdr-left hdr-glow-border">
            <div className="hdr-left-inner">
              <a href="/" className="hdr-logo">
                <img src="/novitic-logo.png" alt="Novitic" width={52} height={52} />
              </a>
              <nav className="hdr-nav hdr-nav-visible">
                {NAV_LINKS.map((item) => (
                  <a key={item.href} href={item.href} className="hdr-nav-link">
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          </div>

          <div className="hdr-right hdr-right-visible">
            <div className="hdr-time">
              Barcelona, España <span>{time}</span>
            </div>

            <a href="tel:+34600000000" className="hdr-phone-btn" aria-label="Teléfono">
              <svg viewBox="0 0 21 21" fill="none">
                <path d="M12.77 4.63a5.37 5.37 0 0 1 3.59 3.59M12.77 1a8.21 8.21 0 0 1 7.23 7.21M19.09 15.45v2.73a1.82 1.82 0 0 1-1.98 1.82 18.02 18.02 0 0 1-7.86-2.79 17.75 17.75 0 0 1-5.46-5.46 18.02 18.02 0 0 1-2.79-7.9A1.82 1.82 0 0 1 2.82 1.9H5.55a1.82 1.82 0 0 1 1.82 1.57c.115.875.33 1.734.64 2.56a1.82 1.82 0 0 1-.41 1.92L6.44 9.09a14.56 14.56 0 0 0 5.46 5.46l1.04-1.04a1.82 1.82 0 0 1 1.92-.41c.826.31 1.685.525 2.56.64a1.82 1.82 0 0 1 1.57 1.75z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>

            <a href="/#contacto" className="hdr-special-btn hdr-glow-border">
              <span style={{ fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.04em" }}>
                contacto rápido
              </span>
              <span className="hdr-btn-circle">
                <svg className="hdr-btn-icon" viewBox="0 0 14 15" fill="none">
                  <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor"/>
                </svg>
                <svg className="hdr-btn-icon hdr-btn-icon-copy" viewBox="0 0 14 15" fill="none">
                  <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor"/>
                </svg>
              </span>
            </a>

            <button
              className={`hdr-hamburger${mobileMenu ? " open" : ""}`}
              onClick={() => setMobileMenu(!mobileMenu)}
              aria-label="Toggle menu"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      <div
        className={`hdr-mobile-overlay${mobileMenu ? " active" : ""}`}
        onClick={() => setMobileMenu(false)}
      />

      {/* Mobile menu */}
      <div className={`hdr-mobile-menu${mobileMenu ? " active" : ""}`}>
        {NAV_LINKS.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="hdr-mobile-nav-link"
            onClick={() => setMobileMenu(false)}
          >
            {item.label}
          </a>
        ))}
        <a href="/#contacto" className="hdr-mobile-cta" onClick={() => setMobileMenu(false)}>
          Contacto rápido
        </a>
        <a href="tel:+34600000000" className="hdr-mobile-tel" onClick={() => setMobileMenu(false)}>
          <svg viewBox="0 0 21 21" fill="none">
            <path d="M12.77 4.63a5.37 5.37 0 0 1 3.59 3.59M12.77 1a8.21 8.21 0 0 1 7.23 7.21M19.09 15.45v2.73a1.82 1.82 0 0 1-1.98 1.82 18.02 18.02 0 0 1-7.86-2.79 17.75 17.75 0 0 1-5.46-5.46 18.02 18.02 0 0 1-2.79-7.9A1.82 1.82 0 0 1 2.82 1.9H5.55a1.82 1.82 0 0 1 1.82 1.57c.115.875.33 1.734.64 2.56a1.82 1.82 0 0 1-.41 1.92L6.44 9.09a14.56 14.56 0 0 0 5.46 5.46l1.04-1.04a1.82 1.82 0 0 1 1.92-.41c.826.31 1.685.525 2.56.64a1.82 1.82 0 0 1 1.57 1.75z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          +34 600 000 000
        </a>
      </div>
    </>
  );
}
