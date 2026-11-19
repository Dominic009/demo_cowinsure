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
   BONE is the section background; keep it equal to the other files. */
const BONE = "#EEF2E6";

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface ExtraData {
  heading: string;
  short_description: string;
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

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const WhyInvestWithUs: React.FC = () => {
  const [reasons, setReasons] = useState<BaseCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const rootRef = useRef<HTMLElement>(null);

  /* ---------- data ---------- */
  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL;

    const fetchCards = async (categoryId: string) => {
      const res = await fetch(`${base}/base-category/${categoryId}/base-cards/`);
      const result: BaseCardApiResponse = await res.json();
      if (result.status === "success") setReasons(result.data);
    };

    const load = async () => {
      try {
        const res = await fetch(`${base}/base-categories/`);
        const result: BaseCategoryApiResponse = await res.json();
        if (result.status === "success") {
          const category = result.data.find((c) => c.name === "why Invest With Us");
          if (category) await fetchCards(category.id);
        }
      } catch (error) {
        console.error("Error fetching reasons to invest:", error);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  /* ---------- scroll: headline rises once; each reason reveals as it comes into view ---------- */
  useIsoLayoutEffect(() => {
    if (isLoading || reasons.length === 0 || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline({ scrollTrigger: { trigger: rootRef.current, start: "top 70%", once: true } })
        .from("[data-fade]", { y: 16, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.1 })
        .fromTo(
          "[data-word]",
          { yPercent: 115 },
          { yPercent: 0, duration: 0.9, ease: "expo.out", stagger: 0.06 },
          "-=0.5"
        );

      rootRef.current?.querySelectorAll<HTMLElement>("[data-row]").forEach((row) => {
        const q = gsap.utils.selector(row);
        gsap
          .timeline({ scrollTrigger: { trigger: row, start: "top 85%", once: true } })
          .fromTo(
            q("[data-img]"),
            { clipPath: "inset(0% 100% 0% 0% round 20px)" },
            { clipPath: "inset(0% 0% 0% 0% round 20px)", duration: 1, ease: "expo.inOut" }
          )
          .from(q("[data-text]"), { y: 20, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.08 }, "-=0.6");
      });
    }, rootRef);

    return () => ctx.revert();
  }, [isLoading, reasons]);

  /* ---------- states ---------- */
  if (isLoading) {
    return (
      <section aria-busy="true" className="px-5 py-20 md:px-10 lg:px-16 lg:py-28" style={{ background: BONE }}>
        <div className="mx-auto grid max-w-[1450px] animate-pulse gap-12 lg:grid-cols-[5fr_7fr] lg:gap-16">
          <div className="space-y-4">
            <div className="h-10 w-40 rounded-full bg-[#1F4D36]/10" />
            <div className="h-16 w-full rounded-lg bg-[#1F4D36]/10" />
            <div className="h-6 w-3/4 rounded-lg bg-[#1F4D36]/10" />
          </div>
          <div className="space-y-6">
            {[0, 1, 2].map((n) => (
              <div key={n} className="h-36 rounded-[20px] bg-[#1F4D36]/10" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (reasons.length === 0) return null;

  return (
    <section
      ref={rootRef}
      aria-label="Why invest with us"
      className={`${display.className} px-5 py-20 text-[#07140F] md:px-10 lg:px-16 lg:py-28`}
      style={{ background: BONE }}
    >
      <div className="mx-auto grid max-w-[1450px] gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        {/* ---------- Left: headline stays in view while the reasons scroll ---------- */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div data-fade className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F2B84B] text-[#07140F]">
              <GiBullHorns className="text-xl" aria-hidden />
            </span>
            <span className="text-base font-medium text-[#1F4D36]">Our goal</span>
          </div>

          <h2 className="mt-6 text-[clamp(2.25rem,4.6vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.03em] text-left">
            {"Why invest with us".split(" ").map((word, i) => (
              <span key={i} className="mr-[0.22em] inline-block overflow-hidden pb-[0.12em] align-bottom">
                <span data-word className="inline-block will-change-transform">
                  {word}
                </span>
              </span>
            ))}
          </h2>

          <p data-fade className="mt-6 max-w-[36ch] text-xl leading-snug text-[#1F4D36] lg:text-2xl text-left">
            Our end-to-end value-chain approach unlocks concrete growth opportunities.
          </p>

          <div data-fade className="mt-8 text-left">
            <Link
              href="/project"
              className="group inline-flex items-center gap-3 rounded-full bg-[#07140F] py-1.5 pl-6 pr-1.5 text-base font-medium text-[#EEF2E6] transition-colors duration-300 hover:bg-[#1F4D36] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F2B84B]"
            >
              Explore our projects
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F2B84B] text-[#07140F] transition-transform duration-300 group-hover:translate-x-1">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M3 8h10m0 0L9 4m4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
          </div>
        </div>

        {/* ---------- Right: the reasons ---------- */}
        <ul className="border-b border-[#07140F]/10">
          {reasons.map((item) => (
            <li
              key={item.id}
              data-row
              className="group grid gap-5 border-t border-[#07140F]/10 py-8 sm:grid-cols-[200px_1fr] sm:gap-8 lg:grid-cols-[220px_1fr]"
            >
              <div
                data-img
                className="relative h-[190px] overflow-hidden rounded-[20px] bg-[#1F4D36]/15 sm:h-[160px] lg:h-[170px]"
              >
                <Image
                  src={item.image_url || "/placeholder.svg"}
                  alt={item.name}
                  fill
                  sizes="(min-width: 1024px) 220px, (min-width: 640px) 200px, 100vw"
                  className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105 motion-reduce:transition-none"
                />
              </div>

              <div className="flex flex-col justify-center text-left">
                <h3 data-text className="text-2xl font-bold leading-tight tracking-[-0.02em] lg:text-[1.75rem]">
                  {item.extra_data?.heading}
                </h3>
                <p data-text className="mt-3 max-w-[52ch] text-base leading-relaxed text-[#07140F]/70 lg:text-lg">
                  {item.extra_data?.short_description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default WhyInvestWithUs;