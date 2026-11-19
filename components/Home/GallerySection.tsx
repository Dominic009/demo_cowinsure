"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { GiBullHorns } from "react-icons/gi";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Bricolage_Grotesque } from "next/font/google";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const display = Bricolage_Grotesque({ subsets: ["latin"], display: "swap" });

/* Palette (same as the rest of the site)
   pine #07140F · moss #1F4D36 · bone #EEF2E6 · tag (amber) #F2B84B
   BONE = page background around the panel; PINE = the panel colour. */
const BONE = "#EEF2E6";
const PINE = "#07140F";
const PAGE_SIZE = 9;

// Repeating bento pattern: a big tile, small tiles, a tall one, a wide one
const SPANS = ["col-span-2 row-span-2", "", "", "row-span-2", "", "col-span-2"];

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface GalleryData {
  id: number;
  title: string;
  image_url: string;
  description: string;
  created_at: string;
  updated_at: string;
}

interface ApiResponse {
  status: string;
  message: string;
  data: GalleryData[];
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const Arrow = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path d="M3 8h10m0 0L9 4m4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const GallerySection = () => {
  const [items, setItems] = useState<GalleryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  /* ---------- data ---------- */
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/gallery/`);
        const result: ApiResponse = await res.json();
        if (result.status === "success") setItems(result.data);
      } catch (error) {
        console.error("Error fetching gallery data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  /* ---------- one scroll moment: headline rises, photos reveal diagonally (plays once) ---------- */
  useIsoLayoutEffect(() => {
    if (isLoading || items.length === 0 || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline({ scrollTrigger: { trigger: rootRef.current, start: "top 70%", once: true } })
        .from("[data-fade]", { y: 16, opacity: 0, duration: 0.7, ease: "power3.out" })
        .fromTo(
          "[data-word]",
          { yPercent: 115 },
          { yPercent: 0, duration: 0.9, ease: "expo.out", stagger: 0.06 },
          "-=0.4"
        )
        .fromTo(
          "[data-tile]",
          { clipPath: "inset(0% 100% 100% 0% round 24px)" },
          { clipPath: "inset(0% 0% 0% 0% round 24px)", duration: 1, ease: "expo.inOut", stagger: 0.08 },
          "-=0.5"
        );
    }, rootRef);

    return () => ctx.revert();
  }, [isLoading, items]);

  /* ---------- lightbox: Escape, arrows, focus trap, scroll lock, focus return ---------- */
  const isOpen = openIndex !== null;

  useEffect(() => {
    if (!isOpen) return;

    const trigger = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIndex(null);
      else if (e.key === "ArrowRight") setOpenIndex((i) => (i === null ? i : (i + 1) % items.length));
      else if (e.key === "ArrowLeft") setOpenIndex((i) => (i === null ? i : (i - 1 + items.length) % items.length));
      else if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>("button");
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      trigger?.focus();
    };
  }, [isOpen, items.length]);

  /* ---------- states ---------- */
  if (isLoading) {
    return (
      <section aria-busy="true" className="p-2 sm:p-3 lg:p-4" style={{ background: BONE }}>
        <div
          className="animate-pulse rounded-[28px] px-5 py-16 md:px-10 lg:px-16 lg:py-24"
          style={{ background: PINE }}
        >
          <div className="mx-auto max-w-[1450px]">
            <div className="h-12 w-72 rounded-lg bg-white/10" />
            <div className="mt-12 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {[0, 1, 2, 3].map((n) => (
                <div key={n} className="h-[200px] rounded-3xl bg-white/10" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0) return null;

  const current = openIndex !== null ? items[openIndex] : null;
  const shown = items.slice(0, visible);

  return (
    <section
      ref={rootRef}
      aria-label="Gallery"
      className={`${display.className} p-2 sm:p-3 lg:p-4`}
      style={{ background: BONE }}
    >
      <div
        className="rounded-[28px] px-5 py-16 text-[#EEF2E6] md:px-10 lg:px-16 lg:py-24"
        style={{ background: PINE }}
      >
        <div className="mx-auto max-w-[1450px]">
          {/* ---------- Header ---------- */}
          <div data-fade className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F2B84B] text-[#07140F]">
              <GiBullHorns className="text-xl" aria-hidden />
            </span>
            <span className="text-base font-medium text-[#EEF2E6]/70">Organic food</span>
          </div>

          <h2 className="mt-6 text-[clamp(2.25rem,4.6vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.03em] text-left">
            {"Watch our gallery".split(" ").map((word, i) => (
              <span key={i} className="mr-[0.22em] inline-block overflow-hidden pb-[0.12em] align-bottom">
                <span data-word className="inline-block will-change-transform">
                  {word}
                </span>
              </span>
            ))}
          </h2>

          {/* ---------- Bento grid ---------- */}
          <ul className="mt-12 grid auto-rows-[170px] grid-flow-dense grid-cols-2 gap-3 sm:auto-rows-[200px] lg:mt-16 lg:auto-rows-[230px] lg:grid-cols-4 lg:gap-4">
            {shown.map((item, index) => (
              <li key={item.id} data-tile className={SPANS[index % SPANS.length]}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(index)}
                  aria-haspopup="dialog"
                  aria-label={`Open photo: ${item.title}`}
                  className="group relative block h-full w-full overflow-hidden rounded-3xl bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2B84B]"
                >
                  <Image
                    src={item.image_url}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    unoptimized
                    className="object-cover object-center transition-transform duration-[1200ms] ease-out group-hover:scale-105 motion-reduce:transition-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07140F]/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:opacity-100" />
                  <span className="absolute bottom-3 left-3 right-3 line-clamp-1 rounded-full border border-white/25 bg-[#07140F]/40 px-3.5 py-1.5 text-left text-sm text-[#EEF2E6] opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:hidden">
                    {item.title}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          {visible < items.length && (
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
                className="group inline-flex items-center gap-3 rounded-full border border-white/25 py-1.5 pl-6 pr-1.5 text-base font-medium transition-colors duration-300 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F2B84B]"
              >
                Show more photos
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F2B84B] text-[#07140F]">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path d="M8 3v10m0 0L4 9m4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ---------- Lightbox ---------- */}
      <AnimatePresence>
        {current && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Photo viewer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.3 }}
            onClick={() => setOpenIndex(null)}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-[#07140F]/90 p-4 backdrop-blur-md sm:p-8"
          >
            <motion.div
              ref={dialogRef}
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: reduce ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl text-[#EEF2E6]"
            >
              <div className="relative h-[62svh] w-full overflow-hidden rounded-[28px] bg-black/40">
                <Image
                  key={current.id}
                  src={current.image_url}
                  alt={current.title}
                  fill
                  sizes="100vw"
                  unoptimized
                  className="object-contain"
                />
              </div>

              <button
                ref={closeRef}
                type="button"
                onClick={() => setOpenIndex(null)}
                aria-label="Close photo viewer"
                className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#EEF2E6] text-[#07140F] transition-colors duration-300 hover:bg-[#F2B84B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2B84B]"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>

              <div className="mt-5 flex items-start justify-between gap-6">
                <div className="min-w-0">
                  <h3 className="text-xl font-bold lg:text-2xl">{current.title}</h3>
                  {current.description && (
                    <p className="mt-2 max-w-[60ch] text-base text-[#EEF2E6]/70">{current.description}</p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="hidden text-sm tabular-nums text-[#EEF2E6]/60 sm:block">
                    {openIndex! + 1} of {items.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => setOpenIndex((i) => (i! - 1 + items.length) % items.length)}
                    aria-label="Previous photo"
                    className="flex h-11 w-11 rotate-180 items-center justify-center rounded-full border border-white/25 transition-colors duration-300 hover:bg-[#F2B84B] hover:text-[#07140F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2B84B]"
                  >
                    <Arrow />
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpenIndex((i) => (i! + 1) % items.length)}
                    aria-label="Next photo"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 transition-colors duration-300 hover:bg-[#F2B84B] hover:text-[#07140F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2B84B]"
                  >
                    <Arrow />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default GallerySection;