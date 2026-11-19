"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import Image from "next/image";
import Link from "next/link";
import { GiBullHorns } from "react-icons/gi";
import { CiLocationOn } from "react-icons/ci";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Bricolage_Grotesque } from "next/font/google";
import { formatToBDT } from "@/utils/currencyFormatter";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const display = Bricolage_Grotesque({ subsets: ["latin"], display: "swap" });

/* Palette (same as the rest of the site)
   pine #07140F · moss #1F4D36 · bone #EEF2E6 · tag (amber) #F2B84B
   BONE = page background around the panel; PINE = the panel colour AND the
   carved CTA notch inside each (bone) card. Keep both equal to the other files. */
const BONE = "#EEF2E6";
const PINE = "#07140F";
const NOTCH = 24;

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface ExtraData {
  isSold: boolean;
}

interface Portfolio {
  id: string;
  name: string;
  location: string;
  investment_value: string;
  currency: string;
  investment_period: string;
  expected_return_min: string;
  expected_return_max: string;
  total_return_min: string;
  total_return_max: string;
  image_url: string;
  description: string;
  extra_data: ExtraData;
  created_at: string;
  updated_at: string;
}

interface ApiResponse {
  status: string;
  message: string;
  data: Portfolio[];
}

interface Category {
  id: string;
  name: string;
  description: string;
}

interface CategoryApiResponse {
  status: string;
  message: string;
  data: Category[];
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const fillet: React.CSSProperties = {
  width: NOTCH,
  height: NOTCH,
  background: `radial-gradient(circle at 0 0, transparent ${NOTCH}px, ${PINE} ${NOTCH + 0.5}px)`,
};

const money = (v: string) => formatToBDT(parseInt(v, 10));

const Stat = ({ label, value, wide }: { label: string; value: string; wide?: boolean }) => (
  <div className={wide ? "col-span-2" : ""}>
    <dt className="text-sm text-[#07140F]/55">{label}</dt>
    <dd className="mt-1 text-base font-medium">{value}</dd>
  </div>
);

const Arrow = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path d="M3 8h10m0 0L9 4m4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const InvestmentSection = () => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [edges, setEdges] = useState({ begin: true, end: false, locked: false });

  const rootRef = useRef<HTMLElement>(null);
  const swiperRef = useRef<SwiperType | null>(null);

  /* ---------- data (runs once; the old version re-fetched whenever isLoading changed) ---------- */
  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL;

    const fetchPortfolios = async (categoryId: string) => {
      const res = await fetch(`${base}/portfolio/category/${categoryId}/portfolios/`);
      const result: ApiResponse = await res.json();
      if (result.status === "success") setPortfolios(result.data);
    };

    const load = async () => {
      try {
        const res = await fetch(`${base}/portfolio/categories/`);
        const result: CategoryApiResponse = await res.json();
        if (result.status === "success") {
          const category = result.data.find((c) => c.name === "Short Term Investment");
          if (category) await fetchPortfolios(category.id);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  const syncEdges = (s: SwiperType) =>
    setEdges({ begin: s.isBeginning, end: s.isEnd, locked: s.isLocked });

  /* ---------- one scroll moment: headline rises, cards wipe in from the right (plays once) ---------- */
  useIsoLayoutEffect(() => {
    if (isLoading || portfolios.length === 0 || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline({ scrollTrigger: { trigger: rootRef.current, start: "top 70%", once: true } })
        .from("[data-fade]", { y: 16, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.1 })
        .fromTo(
          "[data-word]",
          { yPercent: 115 },
          { yPercent: 0, duration: 0.9, ease: "expo.out", stagger: 0.06 },
          "-=0.5"
        )
        .fromTo(
          "[data-card]",
          { clipPath: "inset(0% 0% 0% 100% round 28px)" },
          { clipPath: "inset(0% 0% 0% 0% round 28px)", duration: 1.1, ease: "expo.inOut", stagger: 0.12 },
          "-=0.6"
        );
    }, rootRef);

    return () => ctx.revert();
  }, [isLoading, portfolios]);

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
            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {[0, 1, 2].map((n) => (
                <div key={n} className="h-[560px] rounded-[28px] bg-white/10" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (portfolios.length === 0) return null;

  return (
    <section
      ref={rootRef}
      aria-label="Our projects"
      className={`${display.className} p-2 sm:p-3 lg:p-4`}
      style={{ background: BONE }}
    >
      <div
        className="overflow-hidden rounded-[28px] px-5 py-16 text-[#EEF2E6] md:px-10 lg:px-16 lg:py-24"
        style={{ background: PINE }}
      >
        <div className="mx-auto max-w-[1450px]">
          {/* ---------- Header + carousel controls ---------- */}
          <div className="flex items-end justify-between gap-6">
            <div>
              <div data-fade className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F2B84B] text-[#07140F]">
                  <GiBullHorns className="text-xl" aria-hidden />
                </span>
                <span className="text-base font-medium text-[#EEF2E6]/70">Invest now</span>
              </div>
              <h2 className="mt-6 text-[clamp(2.25rem,4.6vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.03em] text-left">
                {"Our projects".split(" ").map((word, i) => (
                  <span key={i} className="mr-[0.22em] inline-block overflow-hidden pb-[0.12em] align-bottom">
                    <span data-word className="inline-block will-change-transform">
                      {word}
                    </span>
                  </span>
                ))}
              </h2>
            </div>

            {!edges.locked && (
              <div data-fade className="flex gap-2">
                <button
                  type="button"
                  onClick={() => swiperRef.current?.slidePrev()}
                  disabled={edges.begin}
                  aria-label="Previous projects"
                  className="flex h-12 w-12 rotate-180 items-center justify-center rounded-full border border-white/25 text-[#EEF2E6] transition-colors duration-300 hover:bg-[#F2B84B] hover:text-[#07140F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2B84B] disabled:pointer-events-none disabled:opacity-30"
                >
                  <Arrow />
                </button>
                <button
                  type="button"
                  onClick={() => swiperRef.current?.slideNext()}
                  disabled={edges.end}
                  aria-label="Next projects"
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-white/25 text-[#EEF2E6] transition-colors duration-300 hover:bg-[#F2B84B] hover:text-[#07140F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2B84B] disabled:pointer-events-none disabled:opacity-30"
                >
                  <Arrow />
                </button>
              </div>
            )}
          </div>

          {/* ---------- Cards ---------- */}
          <Swiper
            className="!overflow-visible mt-12 lg:mt-16"
            grabCursor
            watchOverflow
            slidesPerView={1.08}
            spaceBetween={16}
            breakpoints={{
              768: { slidesPerView: 2.1, spaceBetween: 20 },
              1280: { slidesPerView: 3, spaceBetween: 20 },
            }}
            onSwiper={(s) => {
              swiperRef.current = s;
              syncEdges(s);
            }}
            onSlideChange={syncEdges}
            onResize={syncEdges}
            onLock={syncEdges}
            onUnlock={syncEdges}
          >
            {portfolios.map((p) => {
              const sold = !!p.extra_data?.isSold;
              return (
                <SwiperSlide key={p.id} className="!h-auto">
                  <article
                    data-card
                    className="group relative flex h-full flex-col rounded-[28px] bg-[#EEF2E6] p-3 text-[#07140F]"
                  >
                    {/* Image */}
                    <div className="relative h-[220px] overflow-hidden rounded-[20px] bg-[#1F4D36]/20">
                      <Image
                        src={p.image_url}
                        alt={p.name}
                        fill
                        sizes="(min-width: 1280px) 33vw, (min-width: 768px) 48vw, 90vw"
                        className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105 motion-reduce:transition-none"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#07140F]/60 via-transparent to-transparent" />

                      <span className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full border border-white/25 bg-[#07140F]/40 py-1.5 pl-2.5 pr-3.5 text-sm text-[#EEF2E6] backdrop-blur-md">
                        <CiLocationOn size={18} aria-hidden />
                        {p.location}
                      </span>

                      {sold && (
                        <span className="absolute right-3 top-3 rounded-full bg-[#F2B84B] px-3.5 py-1.5 text-sm font-medium text-[#07140F]">
                          Completed
                        </span>
                      )}
                    </div>

                    {/* Body */}
                    <div className={`flex flex-1 flex-col px-3 pt-5 ${sold ? "pb-4" : "pb-[84px]"}`}>
                      <h3 className="text-2xl font-bold leading-tight tracking-[-0.02em]">{p.name}</h3>

                      <div className="mt-5">
                        <p className="text-sm text-[#07140F]/55">Investment ({p.currency})</p>
                        <p className="mt-1 text-4xl font-bold leading-none tracking-[-0.03em] text-[#1F4D36]">
                          {money(p.investment_value)}
                        </p>
                      </div>

                      <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5 border-t border-[#07140F]/10 pt-5">
                        <Stat label="Expected return" value={`${p.expected_return_min}% – ${p.expected_return_max}%`} />
                        <Stat label="Period" value={p.investment_period} />
                        <Stat label="Total return" value={`${money(p.total_return_min)} – ${money(p.total_return_max)}`} wide />
                      </dl>
                    </div>

                    {/* CTA: whole card is the link; the notch pill is its visual */}
                    {!sold && (
                      <>
                        <Link
                          href={`/project/project_details/${p.id}`}
                          aria-label={`View project: ${p.name}`}
                          className="absolute inset-0 z-10 rounded-[28px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F2B84B]"
                        />
                        <div
                          aria-hidden
                          className="absolute bottom-0 right-0 rounded-tl-[24px] p-2.5"
                          style={{ background: PINE }}
                        >
                          <span className="pointer-events-none absolute bottom-0 right-full" style={fillet} />
                          <span className="pointer-events-none absolute bottom-full right-0" style={fillet} />
                          <span className="flex items-center rounded-full bg-[#EEF2E6] py-1.5 pl-5 pr-1.5 text-[15px] font-medium text-[#07140F]">
                            View project
                            <span className="ml-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#F2B84B] transition-transform duration-300 group-hover:translate-x-1">
                              <Arrow />
                            </span>
                          </span>
                        </div>
                      </>
                    )}
                  </article>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default InvestmentSection;