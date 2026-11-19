"use client";

import type React from "react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { GiBullHorns } from "react-icons/gi";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Bricolage_Grotesque } from "next/font/google";
import AppBranding from "@/components/Project/AppBranding";
import banner from "@/public/field-cow.png";
import { CATEGORIES, CATEGORY_NAME, GALLERY_DATA, GalleryCategory } from "@/components/GalleryData";
import GalleryLightbox from "@/components/GalleryLightbox";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const display = Bricolage_Grotesque({ subsets: ["latin"], display: "swap" });

/* Palette (same as the rest of the site)
   pine #07140F · moss #1F4D36 · bone #EEF2E6 · tag (amber) #F2B84B */
const BONE = "#EEF2E6";
const PINE = "#07140F";
const PAGE_SIZE = 9;

type Filter = "all" | GalleryCategory;

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const Arrow = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path
      d="M3 8h10m0 0L9 4m4 4-4 4"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const pageBtn =
  "flex h-11 min-w-11 items-center justify-center rounded-full border px-3 text-base font-medium transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2B84B] disabled:pointer-events-none disabled:opacity-30";

const GalleryPage: React.FC = () => {
  const [filter, setFilter] = useState<Filter>("all");
  const [page, setPage] = useState(1);
  const [openIndex, setOpenIndex] = useState<number | null>(null); // index within the filtered list

  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLUListElement>(null);
  const hasMounted = useRef(false);

  /* ---------- derived data (no effects, no mirrored state) ---------- */
  const filtered = useMemo(
    () =>
      filter === "all"
        ? GALLERY_DATA
        : GALLERY_DATA.filter((i) => i.category === filter),
    [filter],
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const offset = (page - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(offset, offset + PAGE_SIZE);

  const filters: { id: Filter; name: string; count: number }[] = [
    { id: "all", name: "All", count: GALLERY_DATA.length },
    ...CATEGORIES.map((c) => ({
      id: c.id as Filter,
      name: c.name,
      count: GALLERY_DATA.filter((i) => i.category === c.id).length,
    })),
  ];

  const lightboxItems = useMemo(
    () => filtered.map((i) => ({ ...i, tag: CATEGORY_NAME[i.category] })),
    [filtered],
  );

  /* ---------- motion: first view reveals on scroll, later changes fade the new photos in ---------- */
  useIsoLayoutEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      if (!hasMounted.current) {
        hasMounted.current = true;

        gsap
          .timeline({
            scrollTrigger: {
              trigger: "[data-intro]",
              start: "top 80%",
              once: true,
            },
          })
          .from("[data-fade]", {
            y: 16,
            opacity: 0,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.1,
          })
          .fromTo(
            "[data-word]",
            { yPercent: 115 },
            { yPercent: 0, duration: 0.9, ease: "expo.out", stagger: 0.05 },
            "-=0.5",
          );

        gsap.fromTo(
          "[data-card]",
          { clipPath: "inset(100% 0% 0% 0% round 28px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 28px)",
            duration: 1,
            ease: "expo.inOut",
            stagger: 0.08,
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 80%",
              once: true,
            },
          },
        );
      } else {
        gsap.fromTo(
          "[data-card]",
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power3.out",
            stagger: 0.05,
          },
        );
      }
    }, rootRef);

    return () => ctx.revert();
  }, [filter, page]);

  const changeFilter = (next: Filter) => {
    if (next === filter) return;
    setFilter(next);
    setPage(1);
  };

  const changePage = (next: number) => {
    setPage(next);
    panelRef.current?.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <div
      ref={rootRef}
      className={`${display.className} text-[#07140F]`}
      style={{ background: BONE }}
    >
      <AppBranding
        title="Visual Journey of Rural Transformation"
        bannerUrl={banner}
      />

      {/* ================= INTRO ================= */}
      <section
        data-intro
        aria-label="About the gallery"
        className="px-5 py-20 md:px-10 lg:px-16 lg:py-28"
      >
        <div className="mx-auto grid max-w-[1450px] items-end gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
          <div>
            <div data-fade className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F2B84B] text-[#07140F]">
                <GiBullHorns className="text-xl" aria-hidden />
              </span>
              <span className="text-base font-medium text-[#1F4D36]">
                Our gallery
              </span>
            </div>

            <h1 className="mt-6 text-[clamp(2.25rem,5.2vw,4.75rem)] font-bold leading-[1.04] tracking-[-0.03em]">
              {"Capturing impact through images".split(" ").map((word, i) => (
                <span
                  key={i}
                  className="mr-[0.22em] inline-block overflow-hidden pb-[0.12em] align-bottom"
                >
                  <span
                    data-word
                    className="inline-block will-change-transform"
                  >
                    {word}
                  </span>
                </span>
              ))}
            </h1>
          </div>

          <p
            data-fade
            className="max-w-[44ch] text-lg leading-relaxed text-[#07140F]/70"
          >
            Explore our visual story of transforming rural economies, empowering
            farmers, and building sustainable agricultural communities through
            innovative technology and partnerships.
          </p>
        </div>
      </section>

      {/* ================= FILTERS + GRID ================= */}
      <section
        ref={panelRef}
        aria-label="Photos"
        className="scroll-mt-4 p-2 sm:p-3 lg:p-4"
      >
        <div
          className="rounded-[28px] px-5 py-12 text-[#EEF2E6] md:px-10 lg:px-16 lg:py-20"
          style={{ background: PINE }}
        >
          <div className="mx-auto max-w-[1450px]">
            {/* Filters */}
            <div
              role="group"
              aria-label="Filter photos by category"
              className="flex flex-wrap gap-3"
            >
              {filters.map((f) => {
                const active = filter === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => changeFilter(f.id)}
                    aria-pressed={active}
                    className={`flex items-center gap-2 rounded-full border px-5 py-2.5 text-base font-medium transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2B84B] ${
                      active
                        ? "border-[#F2B84B] bg-[#F2B84B] text-[#07140F]"
                        : "border-white/25 hover:bg-white/10"
                    }`}
                  >
                    {f.name}
                    <span
                      className={`text-sm tabular-nums ${active ? "text-[#07140F]/70" : "text-[#EEF2E6]/55"}`}
                    >
                      {f.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Grid */}
            <ul
              ref={gridRef}
              className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-5"
            >
              {pageItems.map((item, i) => {
                const isLogo = item.category === "partnerships";
                return (
                  <li key={item.id} data-card className="h-full">
                    <button
                      type="button"
                      onClick={() => setOpenIndex(offset + i)}
                      aria-haspopup="dialog"
                      aria-label={`Open photo: ${item.title}`}
                      className="group flex h-full w-full flex-col rounded-[28px] bg-[#EEF2E6] p-3 text-left text-[#07140F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F2B84B]"
                    >
                      <span
                        className={`relative block h-[250px] overflow-hidden rounded-[20px] ${
                          isLogo ? "bg-[#F8FAF3]" : "bg-[#1F4D36]/15"
                        }`}
                      >
                        <Image
                          src={item.image_url || "/placeholder.svg"}
                          alt=""
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          unoptimized
                          className={`transition-transform duration-[1200ms] ease-out group-hover:scale-105 motion-reduce:transition-none ${
                            isLogo
                              ? "object-contain p-8"
                              : "object-cover object-center"
                          }`}
                        />
                        <span
                          aria-hidden
                          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#07140F]/60 text-[#EEF2E6] opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:opacity-100"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                          >
                            <path
                              d="M4 12 12 4m0 0H6m6 0v6"
                              stroke="currentColor"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                      </span>

                      <span className="block px-3 pb-3 pt-5">
                        <span className="inline-block rounded-full bg-[#1F4D36]/10 px-3 py-1 text-sm font-medium text-[#1F4D36]">
                          {CATEGORY_NAME[item.category]}
                        </span>
                        <span className="mt-3 block text-xl font-bold leading-tight tracking-[-0.01em]">
                          {item.title}
                        </span>
                        {item.description && (
                          <span className="mt-2 block text-base leading-relaxed text-[#07140F]/65">
                            {item.description}
                          </span>
                        )}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav
                aria-label="Gallery pages"
                className="mt-12 flex flex-wrap items-center justify-center gap-2"
              >
                <button
                  type="button"
                  onClick={() => changePage(page - 1)}
                  disabled={page === 1}
                  aria-label="Previous page"
                  className={`${pageBtn} rotate-180 border-white/25 hover:bg-[#F2B84B] hover:text-[#07140F]`}
                >
                  <Arrow />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => changePage(p)}
                      aria-label={`Page ${p}`}
                      aria-current={p === page ? "page" : undefined}
                      className={`${pageBtn} tabular-nums ${
                        p === page
                          ? "border-[#F2B84B] bg-[#F2B84B] text-[#07140F]"
                          : "border-white/25 hover:bg-white/10"
                      }`}
                    >
                      {p}
                    </button>
                  ),
                )}

                <button
                  type="button"
                  onClick={() => changePage(page + 1)}
                  disabled={page === totalPages}
                  aria-label="Next page"
                  className={`${pageBtn} border-white/25 hover:bg-[#F2B84B] hover:text-[#07140F]`}
                >
                  <Arrow />
                </button>
              </nav>
            )}
          </div>
        </div>
      </section>

      <GalleryLightbox
        items={lightboxItems}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onChange={setOpenIndex}
      />
    </div>
  );
};

export default GalleryPage;
