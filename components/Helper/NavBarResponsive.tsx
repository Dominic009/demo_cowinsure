"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import { Bricolage_Grotesque } from "next/font/google";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
});

/* Palette (same as the hero)
   pine #07140F · moss #1F4D36 · bone #EEF2E6 · tag (amber) #F2B84B
   BONE must match the hero's BONE constant: the logo notch and the hero's
   stats notch are the same material. */
const BONE = "#EEF2E6";
const NOTCH = 28; // px radius of the carved corner (same as hero)
const WHATSAPP_URL = "https://wa.me/8801999467873";

interface LogoData {
  id: number;
  name: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

interface MenuItem {
  title: string;
  link: string;
  sub_menu: MenuItem[];
}

interface ApiResponse {
  status: string;
  message: string;
  data: MenuItem[];
}

const fillet: React.CSSProperties = {
  width: NOTCH,
  height: NOTCH,
  background: `radial-gradient(circle at 100% 100%, transparent ${NOTCH}px, ${BONE} ${NOTCH + 0.5}px)`,
};

function NavBarResponsive() {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  const [isOpen, setOpen] = useState(false);
  const [logoData, setLogoData] = useState<LogoData | null>(null);
  const [menuData, setMenuData] = useState<MenuItem[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null); // mobile submenu

  /* ---------- scroll state ---------- */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ---------- data ---------- */
  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL;
    (async () => {
      try {
        const res = await fetch(`${base}/logo/`);
        const result = await res.json();
        if (result.status === "success") setLogoData(result.data);
      } catch (err) {
        console.error(err);
      }
    })();
    (async () => {
      try {
        const res = await fetch(`${base}/menu/`);
        const result: ApiResponse = await res.json();
        if (result.status === "success") setMenuData(result.data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  /* ---------- close mobile menu on navigation / Escape ---------- */
  useEffect(() => {
    setOpen(false);
    setExpanded(null);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  const spring = reduce
    ? { duration: 0 }
    : ({ type: "spring", stiffness: 260, damping: 28, mass: 0.9 } as const);

  const isActive = (link: string) =>
    link === "/" ? pathname === "/" : pathname?.startsWith(link);

  const logo = logoData && (
    <Image
      src={logoData.image_url}
      alt={logoData.name}
      width={120}
      height={60}
      className="h-10 w-auto object-contain lg:h-12"
      priority
      unoptimized
    />
  );

  return (
    <motion.header
      className={`${display.className} pointer-events-none fixed inset-x-0 top-0 z-50 px-2 pt-2 sm:px-3 sm:pt-3 lg:px-4 lg:pt-4`}
    >
      {/* Same padding as the hero frame, so everything lines up with its edges */}
      <div className="relative">
        {/* ---------- Logo notch: carved into the frame's top-left corner ---------- */}
        <motion.div
          animate={{ y: scrolled ? -160 : 0 }}
          transition={
            reduce
              ? { duration: 0 }
              : { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
          }
          className="pointer-events-auto absolute left-0 top-0 flex h-16 w-[132px] items-center justify-center rounded-br-[28px] lg:h-20 lg:w-[190px]"
          style={{ background: BONE }}
          aria-hidden={scrolled}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute left-full top-0"
            style={fillet}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute left-0 top-full"
            style={fillet}
          />
          <Link
            href="/"
            tabIndex={scrolled ? -1 : 0}
            aria-label="Home"
            className="flex items-center"
          >
            {logo}
          </Link>
        </motion.div>

        {/* ---------- Bar: transparent over the hero, morphs into a capsule on scroll ---------- */}
        <motion.nav
          aria-label="Main"
          animate={{
            maxWidth: scrolled ? 1120 : 2400,
            paddingLeft: scrolled ? 20 : 0,
            paddingRight: scrolled ? 8 : 16,
          }}
          transition={spring}
          className={`pointer-events-auto relative mx-auto w-full rounded-full border transition-[background-color,box-shadow,border-color,backdrop-filter] duration-500 ${
            scrolled
              ? "border-[#07140F]/10 bg-[#EEF2E6]/80 shadow-[0_20px_40px_rgba(7,20,15,0.12)] backdrop-blur-xl"
              : "border-transparent bg-transparent shadow-none"
          }`}
        >
          <div
            className={`flex items-center justify-between transition-[height] duration-500 ${
              scrolled ? "h-14 lg:h-16" : "h-16 lg:h-20"
            }`}
          >
            {/* Capsule logo (the notch logo takes over when at the top) */}
            <Link
              href="/"
              aria-label="Home"
              tabIndex={scrolled ? 0 : -1}
              className={`flex items-center transition-opacity duration-300 ${
                scrolled ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              {logo}
            </Link>

            {/* Desktop menu: dark glass plate at the top, plain inside the capsule */}
            {menuData.length > 0 && (
              <ul
                className={`absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full p-1.5 transition-colors duration-500 lg:flex ${
                  scrolled
                    ? "border border-transparent bg-transparent"
                    : "border border-white/15 bg-[#07140F]/35 backdrop-blur-md"
                }`}
              >
                {menuData.map((item) => {
                  const active = isActive(item.link);
                  return (
                    <li key={item.title} className="group relative">
                      <Link
                        href={item.link}
                        aria-current={active ? "page" : undefined}
                        className={`relative flex items-center gap-1 rounded-full px-4 py-2 text-[15px] font-medium transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#F2B84B] ${
                          scrolled
                            ? "text-[#1F4D36] hover:bg-[#07140F]/5 hover:text-[#07140F]"
                            : "text-[#EEF2E6]/85 hover:bg-white/10 hover:text-white"
                        } ${active ? (scrolled ? "!text-[#07140F]" : "!text-white") : ""}`}
                      >
                        {item.title}
                        {item.sub_menu.length > 0 && (
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 10 10"
                            fill="none"
                            aria-hidden
                            className="transition-transform duration-300 group-hover:rotate-180 group-focus-within:rotate-180"
                          >
                            <path
                              d="M2 3.5 5 6.5l3-3"
                              stroke="currentColor"
                              strokeWidth="1.4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                        {active && (
                          <span
                            aria-hidden
                            className="absolute bottom-0.5 left-1/2 h-[2px] w-4 -translate-x-1/2 rounded-full bg-[#F2B84B]"
                          />
                        )}
                      </Link>

                      {item.sub_menu.length > 0 && (
                        <div className="invisible absolute left-1/2 top-full z-10 -translate-x-1/2 translate-y-2 pt-4 opacity-0 transition-all duration-300 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                          <div className="min-w-[280px] rounded-2xl border border-[#07140F]/10 bg-[#EEF2E6] p-2 shadow-[0_24px_48px_rgba(7,20,15,0.18)]">
                            {item.sub_menu.map((sub) => (
                              <Link
                                key={sub.title}
                                href={sub.link}
                                className="block rounded-xl px-4 py-3 text-sm font-medium text-[#1F4D36] transition-colors duration-200 hover:bg-[#07140F]/5 hover:text-[#07140F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1F4D36]"
                              >
                                {sub.title}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}

            {/* Right side: WhatsApp CTA (desktop) + menu toggle (mobile) */}
            <div className="flex items-center gap-3">
              <Link
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden items-center gap-2 rounded-full bg-[#F2B84B] px-5 py-2.5 text-sm font-medium text-[#07140F] transition-colors duration-300 hover:bg-[#07140F] hover:text-[#EEF2E6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2B84B] lg:inline-flex"
              >
                <FaWhatsapp size={18} aria-hidden />
                Get in touch
              </Link>

              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={isOpen}
                aria-controls="mobile-menu"
                aria-label={isOpen ? "Close menu" : "Open menu"}
                className={`flex h-11 w-11 items-center justify-center rounded-full border transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#F2B84B] lg:hidden ${
                  scrolled
                    ? "border-[#07140F]/10 text-[#07140F]"
                    : "border-white/15 bg-[#07140F]/35 text-[#EEF2E6] backdrop-blur-md"
                }`}
              >
                <span className="relative block h-[14px] w-5">
                  <span
                    className={`absolute left-0 h-[2px] w-5 rounded bg-current transition-all duration-300 ${isOpen ? "top-[6px] rotate-45" : "top-0"}`}
                  />
                  <span
                    className={`absolute left-0 h-[2px] w-5 rounded bg-current transition-all duration-300 ${isOpen ? "top-[6px] -rotate-45" : "top-[12px]"}`}
                  />
                </span>
              </button>
            </div>
          </div>

          {/* ---------- Mobile menu: a bone card that drops below the bar ---------- */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                id="mobile-menu"
                initial={{ opacity: 0, y: -12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.98 }}
                transition={{
                  duration: reduce ? 0 : 0.3,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="absolute inset-x-0 top-full mt-3 max-h-[calc(100svh-110px)] overflow-y-auto rounded-3xl border border-[#07140F]/10 bg-[#EEF2E6] p-5 shadow-[0_24px_48px_rgba(7,20,15,0.2)] lg:hidden"
              >
                <ul className="divide-y divide-[#07140F]/10">
                  {menuData.map((item) => {
                    const hasSub = item.sub_menu.length > 0;
                    const open = expanded === item.title;
                    return (
                      <li key={item.title} className="py-1">
                        <div className="flex items-center justify-between">
                          <Link
                            href={item.link}
                            aria-current={
                              isActive(item.link) ? "page" : undefined
                            }
                            className="flex-1 py-3 text-lg font-medium text-[#07140F]"
                          >
                            {item.title}
                          </Link>
                          {hasSub && (
                            <button
                              type="button"
                              onClick={() =>
                                setExpanded(open ? null : item.title)
                              }
                              aria-expanded={open}
                              aria-label={`${open ? "Collapse" : "Expand"} ${item.title}`}
                              className="flex h-10 w-10 items-center justify-center rounded-full text-[#1F4D36] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1F4D36]"
                            >
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 10 10"
                                fill="none"
                                aria-hidden
                                className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                              >
                                <path
                                  d="M2 3.5 5 6.5l3-3"
                                  stroke="currentColor"
                                  strokeWidth="1.4"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </button>
                          )}
                        </div>

                        <AnimatePresence initial={false}>
                          {hasSub && open && (
                            <motion.ul
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: reduce ? 0 : 0.25 }}
                              className="overflow-hidden"
                            >
                              {item.sub_menu.map((sub) => (
                                <li key={sub.title}>
                                  <Link
                                    href={sub.link}
                                    className="block py-2.5 pl-4 text-[15px] text-[#1F4D36]"
                                  >
                                    {sub.title}
                                  </Link>
                                </li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </li>
                    );
                  })}
                </ul>

                <Link
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 flex items-center justify-center gap-2 rounded-full bg-[#F2B84B] py-3.5 text-base font-medium text-[#07140F]"
                >
                  <FaWhatsapp size={20} aria-hidden />
                  Get in touch
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      </div>
    </motion.header>
  );
}

export default NavBarResponsive;
