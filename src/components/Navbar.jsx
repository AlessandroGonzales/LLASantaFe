import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/aguila.webp";
import AccountMenu from "./account/AccountMenu.jsx";
import { account } from "../lib/backend.js";
import { useAccountAction } from "../hooks/useAccountAction.js";

const desktopLinkBase =
  "relative inline-flex min-h-11 items-center px-2 py-2 text-[13px] font-bold tracking-wide transition-colors duration-200 after:absolute after:inset-x-2 after:bottom-1 after:h-0.5 after:origin-left after:bg-liberty-primary after:transition-transform after:duration-300 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white";

const mobileLinkBase =
  "group flex min-h-14 w-full items-center gap-4 border-b border-white/10 py-3 text-left text-xl font-black uppercase tracking-[0.08em] transition-colors hover:text-liberty-primary focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:text-2xl";

function desktopLinkClass(isActive) {
  return `${desktopLinkBase} ${
    isActive
      ? "text-white after:scale-x-100"
      : "text-liberty-text-secondary after:scale-x-0 hover:text-white hover:after:scale-x-100"
  }`;
}

function mobileLinkClass(isActive) {
  return `${mobileLinkBase} ${
    isActive ? "text-liberty-primary" : "text-white"
  }`;
}

function MobileIndex({ children }) {
  return (
    <span
      aria-hidden="true"
      className="w-7 shrink-0 text-xs font-black tracking-[0.18em] text-liberty-primary"
    >
      {children}
    </span>
  );
}

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate(), logout = useAccountAction();
  const logoutFromMenu = () => logout.run(async signal => {
    let notice = "Se cerraron todas las sesiones de tu cuenta.";
    try { await account.logout(signal); }
    catch { notice = "Cerraste la sesión en este navegador. No pudimos confirmar el cierre en otros dispositivos."; }
    if (!signal.aborted) navigate("/ingresar", { replace: true, state: { notice } });
  });
  const [isScrolled, setIsScrolled] = useState(
    () => typeof window !== "undefined" && window.scrollY > 12,
  );
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const [isDesktopDropdownOpen, setIsDesktopDropdownOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const desktopDropdownRef = useRef(null);

  const isHomeSection = (hash) =>
    location.pathname === "/" && location.hash === hash;

  const representativesAreActive =
    location.pathname === "/diputados" ||
    location.pathname === "/representantes" ||
    location.pathname === "/presidentes-comunales" ||
    isHomeSection("#presidentes-comunales") ||
    isHomeSection("#diputados") ||
    isHomeSection("#representantes");

  const closeMobileMenu = () => {
    setIsOpen(false);
    setIsMobileDropdownOpen(false);
  };

  const toggleMobileMenu = () => {
    if (isOpen) setIsMobileDropdownOpen(false);
    setIsOpen((current) => !current);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 12;
      setIsScrolled((current) => (current === scrolled ? current : scrolled));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isDesktopDropdownOpen) return undefined;

    const handlePointerDown = (event) => {
      if (!desktopDropdownRef.current?.contains(event.target)) {
        setIsDesktopDropdownOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsDesktopDropdownOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDesktopDropdownOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusFrame = window.requestAnimationFrame(() => {
      mobileMenuRef.current?.querySelector("a")?.focus();
    });

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeMobileMenu();
        menuButtonRef.current?.focus();
        return;
      }

      if (event.key !== "Tab") return;

      const menuItems = Array.from(
        mobileMenuRef.current?.querySelectorAll(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      ).filter((element) => element.getClientRects().length > 0);
      const focusableItems = [menuButtonRef.current, ...menuItems].filter(
        Boolean,
      );

      if (focusableItems.length === 0) return;

      const firstItem = focusableItems[0];
      const lastItem = focusableItems[focusableItems.length - 1];

      if (event.shiftKey && document.activeElement === firstItem) {
        event.preventDefault();
        lastItem.focus();
      } else if (!event.shiftKey && document.activeElement === lastItem) {
        event.preventDefault();
        firstItem.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 h-14 border-b transition-[background-color,border-color,box-shadow] duration-300 ${
        isScrolled || isOpen || ["/registro", "/mi-cuenta", "/propone", "/privacidad"].includes(location.pathname) || location.pathname.startsWith("/encuestas")
          ? "border-liberty-border/80 bg-liberty-bg/95 shadow-[0_12px_40px_rgba(10,2,18,0.28)] backdrop-blur-xl"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav
        aria-label="Navegación principal"
        className="flex h-full w-full items-center justify-between px-4 sm:px-6 lg:px-8 2xl:grid 2xl:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] 2xl:gap-4"
      >
        <Link
          to="/"
          onClick={closeMobileMenu}
          aria-label="La Libertad Avanza Santa Fe, ir al inicio"
          className="group relative z-50 flex min-h-11 items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white shrink-0 2xl:justify-self-start"
        >
          <img
            src={logo}
            alt=""
            aria-hidden="true"
            width="539"
            height="545"
            decoding="async"
            className="h-12 w-12 object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,0.28)] transition-transform duration-300 group-hover:scale-105"
          />

          <span className="ml-2 flex flex-col justify-center leading-none">
            <span className="text-xs font-black uppercase tracking-tight text-white transition-colors group-hover:text-liberty-primary sm:text-[0.82rem]">
              La Libertad Avanza
            </span>
            <span className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-liberty-text-secondary">
              Santa Fe
            </span>
          </span>
        </Link>

        {/* Links centrados en Desktop */}
        <div className="hidden h-full items-center justify-center gap-2 2xl:flex">
          <Link
            to="/#noticias"
            aria-current={isHomeSection("#noticias") ? "location" : undefined}
            className={desktopLinkClass(isHomeSection("#noticias"))}
          >
            Noticias
          </Link>
          <Link
            to="/propuestas"
            aria-current={
              location.pathname === "/propuestas" ? "page" : undefined
            }
            className={desktopLinkClass(
              location.pathname === "/propuestas" ||
                location.pathname.startsWith("/propuesta/"),
            )}
          >
            Propuestas
          </Link>
          <Link
            to="/nosotros"
            aria-current={location.pathname === "/nosotros" ? "page" : undefined}
            className={desktopLinkClass(location.pathname === "/nosotros")}
          >
            Nosotros
          </Link>

          <div
            ref={desktopDropdownRef}
            className="relative flex h-full items-center"
            onMouseEnter={() => setIsDesktopDropdownOpen(true)}
            onMouseLeave={() => setIsDesktopDropdownOpen(false)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) {
                setIsDesktopDropdownOpen(false);
              }
            }}
          >
            <button
              type="button"
              aria-haspopup="true"
              aria-expanded={isDesktopDropdownOpen}
              aria-controls="desktop-representatives-menu"
              onClick={() =>
                setIsDesktopDropdownOpen((current) => !current)
              }
              className={`${desktopLinkClass(representativesAreActive)} gap-1.5 cursor-pointer`}
            >
              Representantes
              <ChevronDown
                aria-hidden="true"
                className={`h-4 w-4 transition-transform duration-300 ${
                  isDesktopDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              id="desktop-representatives-menu"
              aria-hidden={!isDesktopDropdownOpen}
              className={`absolute left-1/2 top-full w-56 -translate-x-1/2 pt-2 transition-all duration-200 ${
                isDesktopDropdownOpen
                  ? "visible translate-y-0 opacity-100"
                  : "invisible translate-y-2 opacity-0"
              }`}
            >
              <div className="overflow-hidden rounded-2xl border border-liberty-border bg-liberty-bg/98 p-2 shadow-[0_18px_50px_rgba(8,2,14,0.45)] backdrop-blur-xl">
                <Link
                  to="/diputados"
                  tabIndex={isDesktopDropdownOpen ? 0 : -1}
                  onClick={() => setIsDesktopDropdownOpen(false)}
                  className="flex min-h-11 items-center rounded-xl px-4 text-sm font-bold text-white transition-colors hover:bg-liberty-primary/15 hover:text-liberty-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  Diputados nacionales
                </Link>
                <Link
                  to="/representantes"
                  tabIndex={isDesktopDropdownOpen ? 0 : -1}
                  onClick={() => setIsDesktopDropdownOpen(false)}
                  className="flex min-h-11 items-center rounded-xl px-4 text-sm font-bold text-white transition-colors hover:bg-liberty-primary/15 hover:text-liberty-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  Concejales
                </Link>
                <Link
                  to="/presidentes-comunales"
                  tabIndex={isDesktopDropdownOpen ? 0 : -1}
                  aria-current={location.pathname === "/presidentes-comunales" ? "page" : undefined}
                  onClick={() => setIsDesktopDropdownOpen(false)}
                  className="flex min-h-11 items-center rounded-xl px-4 text-sm font-bold text-white transition-colors hover:bg-liberty-primary/15 hover:text-liberty-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  Presidentes comunales
                </Link>
              </div>
            </div>
          </div>

          <Link
            to="/propone"
            aria-current={location.pathname === "/propone" ? "page" : undefined}
            className={desktopLinkClass(location.pathname === "/propone")}
          >
            Proponé
          </Link>
          <Link
            to="/sedes"
            aria-current={location.pathname === "/sedes" ? "page" : undefined}
            className={desktopLinkClass(location.pathname === "/sedes")}
          >
            Sedes
          </Link>
          <Link
            to="/reclamos"
            aria-current={location.pathname === "/reclamos" ? "page" : undefined}
            className={desktopLinkClass(location.pathname === "/reclamos")}
          >
            Reclamos
          </Link>
          <Link to="/encuestas" aria-current={location.pathname.startsWith("/encuestas") ? "page" : undefined} className={desktopLinkClass(location.pathname.startsWith("/encuestas"))}>Encuestas</Link>
        </div>

        <div className="relative z-50 flex items-center gap-2 shrink-0 2xl:justify-self-end">
          <Link to="/sumate" onClick={closeMobileMenu} aria-current={location.pathname === "/sumate" ? "page" : undefined}
            className="hidden sm:inline-flex min-h-8 items-center justify-center rounded-full border border-liberty-primary/50 px-3 text-[11px] font-bold uppercase tracking-[0.08em] text-white/90 transition-colors hover:border-liberty-primary hover:bg-liberty-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">Afiliate</Link>
          <AccountMenu key={location.key} onOpen={closeMobileMenu} onLogout={logoutFromMenu} logoutBusy={logout.busy} />
        <button
          ref={menuButtonRef}
          type="button"
          onClick={toggleMobileMenu}
          aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          className="relative z-50 flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-liberty-bg/70 text-white backdrop-blur-md transition-colors hover:border-liberty-primary hover:text-liberty-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white 2xl:hidden"
        >
          <span
            aria-hidden="true"
            className={`absolute h-0.5 w-5 bg-current transition-transform duration-300 ${
              isOpen ? "rotate-45" : "-translate-y-1.5"
            }`}
          />
          <span
            aria-hidden="true"
            className={`absolute h-0.5 w-5 bg-current transition-opacity duration-200 ${
              isOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            aria-hidden="true"
            className={`absolute h-0.5 w-5 bg-current transition-transform duration-300 ${
              isOpen ? "-rotate-45" : "translate-y-1.5"
            }`}
          />
        </button>
        </div>

        <div
          ref={mobileMenuRef}
          id="mobile-navigation"
          role="dialog"
          aria-modal={isOpen ? "true" : undefined}
          aria-label="Menú principal"
          aria-hidden={!isOpen}
          className={`fixed inset-0 z-40 h-[100dvh] overflow-y-auto bg-liberty-bg px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-24 transition-[opacity,transform,visibility] duration-300 sm:px-10 2xl:hidden ${
            isOpen
              ? "visible translate-x-0 opacity-100"
              : "invisible translate-x-full opacity-0"
          }`}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/4 h-72 w-72 -translate-x-1/2 rounded-full bg-liberty-primary/10 blur-[90px]"
          />

          <div className="relative mx-auto flex min-h-full w-full max-w-xl flex-col">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-liberty-text-secondary">
              Navegación
            </p>

            <div className="flex flex-col">
              <Link
                to="/#noticias"
                onClick={closeMobileMenu}
                aria-current={
                  isHomeSection("#noticias") ? "location" : undefined
                }
                className={mobileLinkClass(isHomeSection("#noticias"))}
              >
                <MobileIndex>01</MobileIndex>
                Noticias
              </Link>
              <Link
                to="/propuestas"
                onClick={closeMobileMenu}
                aria-current={
                  location.pathname === "/propuestas" ? "page" : undefined
                }
                className={mobileLinkClass(
                  location.pathname === "/propuestas" ||
                    location.pathname.startsWith("/propuesta/"),
                )}
              >
                <MobileIndex>02</MobileIndex>
                Propuestas
              </Link>
              <Link
                to="/nosotros"
                onClick={closeMobileMenu}
                aria-current={
                  location.pathname === "/nosotros" ? "page" : undefined
                }
                className={mobileLinkClass(location.pathname === "/nosotros")}
              >
                <MobileIndex>03</MobileIndex>
                Nosotros
              </Link>

              <div className="border-b border-white/10">
                <button
                  type="button"
                  onClick={() =>
                    setIsMobileDropdownOpen((current) => !current)
                  }
                  aria-expanded={isMobileDropdownOpen}
                  aria-controls="mobile-representatives-menu"
                  className={`group flex min-h-14 w-full items-center gap-4 py-3 text-left text-xl font-black uppercase tracking-[0.08em] transition-colors hover:text-liberty-primary focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:text-2xl ${
                    representativesAreActive
                      ? "text-liberty-primary"
                      : "text-white"
                  }`}
                >
                  <MobileIndex>04</MobileIndex>
                  <span className="flex-1">Representantes</span>
                  <ChevronDown
                    aria-hidden="true"
                    className={`h-5 w-5 shrink-0 transition-transform duration-300 ${
                      isMobileDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  id="mobile-representatives-menu"
                  aria-hidden={!isMobileDropdownOpen}
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ${
                    isMobileDropdownOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="mb-3 ml-11 flex flex-col border-l border-liberty-primary/50 pl-5">
                      <Link
                        to="/diputados"
                        tabIndex={isMobileDropdownOpen ? 0 : -1}
                        onClick={closeMobileMenu}
                        className="flex min-h-11 items-center text-base font-bold uppercase tracking-[0.08em] text-liberty-text-secondary hover:text-liberty-primary focus-visible:outline-none focus-visible:text-white"
                      >
                        Diputados nacionales
                      </Link>
                      <Link
                        to="/representantes"
                        tabIndex={isMobileDropdownOpen ? 0 : -1}
                        onClick={closeMobileMenu}
                        className="flex min-h-11 items-center text-base font-bold uppercase tracking-[0.08em] text-liberty-text-secondary hover:text-liberty-primary focus-visible:outline-none focus-visible:text-white"
                      >
                        Concejales
                      </Link>
                      <Link
                        to="/presidentes-comunales"
                        tabIndex={isMobileDropdownOpen ? 0 : -1}
                        aria-current={location.pathname === "/presidentes-comunales" ? "page" : undefined}
                        onClick={closeMobileMenu}
                        className="flex min-h-11 items-center text-base font-bold uppercase tracking-[0.08em] text-liberty-text-secondary hover:text-liberty-primary focus-visible:outline-none focus-visible:text-white"
                      >
                        Presidentes comunales
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <Link
                to="/propone"
                onClick={closeMobileMenu}
                aria-current={
                  location.pathname === "/propone" ? "page" : undefined
                }
                className={mobileLinkClass(location.pathname === "/propone")}
              >
                <MobileIndex>05</MobileIndex>
                Proponé
              </Link>
              <Link
                to="/sedes"
                onClick={closeMobileMenu}
                aria-current={
                  location.pathname === "/sedes" ? "page" : undefined
                }
                className={mobileLinkClass(location.pathname === "/sedes")}
              >
                <MobileIndex>06</MobileIndex>
                Sedes
              </Link>
              <Link
                to="/reclamos"
                onClick={closeMobileMenu}
                aria-current={
                  location.pathname === "/reclamos" ? "page" : undefined
                }
                className={mobileLinkClass(location.pathname === "/reclamos")}
              >
                <MobileIndex>07</MobileIndex>
                Reclamos
              </Link>
              <Link to="/encuestas" onClick={closeMobileMenu} aria-current={location.pathname.startsWith("/encuestas") ? "page" : undefined} className={mobileLinkClass(location.pathname.startsWith("/encuestas"))}><MobileIndex>08</MobileIndex>Encuestas</Link>
            </div>

            <div className="mt-auto pt-8">
              <Link
                to="/sumate"
                onClick={closeMobileMenu}
                aria-current={
                  location.pathname === "/sumate" ? "page" : undefined
                }
                className="inline-flex min-h-13 w-full items-center justify-center rounded-full border border-liberty-primary bg-liberty-primary px-7 py-4 text-sm font-black uppercase tracking-[0.12em] text-liberty-text transition-colors hover:border-liberty-primary-hover hover:bg-liberty-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-liberty-bg"
              >
                Sumate a La Libertad Avanza
              </Link>
              <p className="mt-5 text-center text-xs font-bold uppercase tracking-[0.2em] text-liberty-text-secondary">
                La Libertad Avanza · Santa Fe
              </p>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
