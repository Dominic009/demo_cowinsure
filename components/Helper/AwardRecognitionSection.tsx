"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
   BONE = page background around the panel; PINE = the panel colour.
   Keep both equal to the other files. */
const BONE = "#EEF2E6";
const PINE = "#07140F";

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface BaseCategory {
  id: string;
  name: string;
  description: string;
}

interface BaseCategoryApiResponse {
  status: string;
  message: string;
  data: BaseCategory[];
}

interface ExtraData {
  status?: string;
  event?: string;
  prize?: string;
  url: string;
}

interface BaseCard {
  id: number;
  name: string;
  category: string;
  image_url: string;
  extra_data: ExtraData;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface BaseCardApiResponse {
  status: string;
  message: string;
  data: BaseCard[];
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const isExternal = (url: string) => /^https?:\/\//i.test(url);

const AwardRecognitionSection = () => {
  const [awards, setAwards] = useState<BaseCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const rootRef = useRef<HTMLElement>(null);

  /* ---------- data ---------- */
  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL;

    const fetchCards = async (categoryId: string) => {
      const res = await fetch(`${base}/base-category/${categoryId}/base-cards/`);
      const result: BaseCardApiResponse = await res.json();
      if (result.status === "success") setAwards(result.data);
    };

    const load = async () => {
      try {
        const res = await fetch(`${base}/base-categories/`);
        const result: BaseCategoryApiResponse = await res.json();
        if (result.status === "success") {
          const category = result.data.find((c) => c.name === "Award");
          if (category) await fetchCards(category.id);
        }
      } catch (error) {
        console.error("Error fetching awards:", error);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  /* ---------- one scroll moment: headline rises, cards unfold upward in turn (plays once) ---------- */
  useIsoLayoutEffect(() => {
    if (isLoading || awards.length === 0 || prefersReducedMotion()) return;

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
          "[data-card]",
          { clipPath: "inset(100% 0% 0% 0% round 28px)" },
          { clipPath: "inset(0% 0% 0% 0% round 28px)", duration: 1.1, ease: "expo.inOut", stagger: 0.1 },
          "-=0.6"
        );
    }, rootRef);

    return () => ctx.revert();
  }, [isLoading, awards]);

  /* ---------- states ---------- */
  if (isLoading) {
    return (
      <section aria-busy="true" className="p-2 sm:p-3 lg:p-4" style={{ background: BONE }}>
        <div
          className="animate-pulse rounded-[28px] px-5 py-16 md:px-10 lg:px-16 lg:py-24"
          style={{ background: PINE }}
        >
          <div className="mx-auto max-w-[1450px]">
            <div className="h-12 w-80 rounded-lg bg-white/10" />
            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {[0, 1, 2].map((n) => (
                <div key={n} className="h-[460px] rounded-[28px] bg-white/10" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (awards.length === 0) return null;

  return (
    <section
      ref={rootRef}
      aria-label="Awards and recognitions"
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
            <span className="text-base font-medium text-[#EEF2E6]/70">Achievements</span>
          </div>

          <h2 className="mt-6 text-[clamp(2.25rem,4.6vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.03em] text-left">
            {"Awards & recognitions".split(" ").map((word, i) => (
              <span key={i} className="mr-[0.22em] inline-block overflow-hidden pb-[0.12em] align-bottom">
                <span data-word className="inline-block will-change-transform">
                  {word}
                </span>
              </span>
            ))}
          </h2>

          {/* ---------- Awards: details are always visible (no hover needed) ---------- */}
          <ul className="mt-12 grid grid-cols-[repeat(auto-fit,minmax(min(100%,270px),1fr))] gap-4 lg:mt-16 lg:gap-5">
            {awards.map((award) => {
              const { status, event, prize, url } = award.extra_data ?? ({} as Partial<ExtraData>);
              return (
                <li
                  key={award.id}
                  data-card
                  className="group relative flex flex-col rounded-[28px] border border-white/10 bg-white/[0.06] p-3"
                >
                  <div className="relative h-[280px] overflow-hidden rounded-[20px] bg-white/5">
                    <Image
                      src={award.image_url || "/placeholder.svg"}
                      alt={award.name}
                      fill
                      sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 100vw"
                      className="object-cover object-center transition-transform duration-[1200ms] ease-out group-hover:scale-105 motion-reduce:transition-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#07140F]/50 via-transparent to-transparent" />

                    {status && (
                      <span className="absolute left-3 top-3 rounded-full bg-[#F2B84B] px-3.5 py-1.5 text-sm font-medium text-[#07140F]">
                        {status}
                      </span>
                    )}

                    {url && (
                      <span
                        aria-hidden
                        className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-[#07140F]/40 text-[#EEF2E6] opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100 [@media(hover:none)]:opacity-100"
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M4 12 12 4m0 0H6m6 0v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col px-3 pb-3 pt-5">
                    <h3 className="text-xl font-bold leading-tight tracking-[-0.01em]">{award.name}</h3>
                    {event && <p className="mt-2 text-base leading-snug text-[#EEF2E6]/70">{event}</p>}
                    {prize && (
                      <p className="mt-4 inline-flex items-center gap-2 self-start rounded-full border border-white/15 px-3.5 py-1.5 text-sm text-[#EEF2E6]">
                        <span aria-hidden className="h-2 w-2 rounded-full bg-[#F2B84B]" />
                        {prize}
                      </p>
                    )}
                  </div>

                  {url && (
                    <Link
                      href={url}
                      target={isExternal(url) ? "_blank" : undefined}
                      rel={isExternal(url) ? "noopener noreferrer" : undefined}
                      aria-label={`Read more: ${award.name}`}
                      className="absolute inset-0 z-10 rounded-[28px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F2B84B]"
                    />
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default AwardRecognitionSection;