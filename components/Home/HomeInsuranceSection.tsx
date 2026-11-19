"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type React from "react";
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
   BONE is the section background and the colour of the carved notch. */
const BONE = "#EEF2E6";
const NOTCH = 24;

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface ExtraData {
  url: string;
  type: string;
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

// Concave joins for the notch in each card's bottom-right corner
const fillet: React.CSSProperties = {
  width: NOTCH,
  height: NOTCH,
  background: `radial-gradient(circle at 0 0, transparent ${NOTCH}px, ${BONE} ${NOTCH + 0.5}px)`,
};

const HomeInsuranceSection: React.FC = () => {
  const [products, setProducts] = useState<BaseCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const rootRef = useRef<HTMLElement>(null);

  /* ---------- data ---------- */
  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL;

    const fetchCards = async (categoryId: string) => {
      const res = await fetch(
        `${base}/base-category/${categoryId}/base-cards/`,
      );
      const result: BaseCardApiResponse = await res.json();
      if (result.status === "success") setProducts(result.data);
    };

    const load = async () => {
      try {
        const res = await fetch(`${base}/base-categories/`);
        const result: BaseCategoryApiResponse = await res.json();
        if (result.status === "success") {
          const category = result.data.find(
            (c) => c.name === "Insurance Preview Section",
          );
          if (category) await fetchCards(category.id);
        }
      } catch (error) {
        console.error("Error fetching insurance section:", error);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  /* ---------- one scroll moment: headline rises, cards wipe in from the left (plays once) ---------- */
  useIsoLayoutEffect(() => {
    if (isLoading || products.length === 0 || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 70%",
            once: true,
          },
        })
        .from("[data-fade]", {
          y: 16,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
        })
        .fromTo(
          "[data-word]",
          { yPercent: 115 },
          { yPercent: 0, duration: 0.9, ease: "expo.out", stagger: 0.05 },
          "-=0.4",
        )
        .fromTo(
          "[data-card]",
          { clipPath: "inset(0% 100% 0% 0% round 28px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 28px)",
            duration: 1.1,
            ease: "expo.inOut",
            stagger: 0.14,
          },
          "-=0.6",
        );
    }, rootRef);

    return () => ctx.revert();
  }, [isLoading, products]);

  /* ---------- states ---------- */
  if (isLoading) {
    return (
      <section
        aria-busy="true"
        className="px-5 py-20 md:px-10 lg:px-16 lg:py-28"
        style={{ background: BONE }}
      >
        <div className="mx-auto max-w-[1450px] animate-pulse">
          <div className="h-10 w-64 rounded-full bg-[#1F4D36]/10" />
          <div className="mt-6 h-16 w-full max-w-3xl rounded-lg bg-[#1F4D36]/10" />
          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {[0, 1, 2].map((n) => (
              <div
                key={n}
                className="h-[420px] rounded-[28px] bg-[#1F4D36]/10 lg:h-[520px]"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section
      ref={rootRef}
      aria-label="Digital insurance solutions"
      className={`${display.className} px-5 py-20 text-[#07140F] md:px-10 lg:px-16 lg:py-28`}
      style={{ background: BONE }}
    >
      <div className="mx-auto max-w-[1450px]">
        {/* ---------- Header ---------- */}
        <div data-fade className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F2B84B] text-[#07140F]">
            <GiBullHorns className="text-xl" aria-hidden />
          </span>
          <span className="text-base font-medium text-[#1F4D36]">
            Digital insurance solutions
          </span>
        </div>

        <h2 className="mt-6 max-w-4xl text-[clamp(2.25rem,5vw,4.5rem)] font-bold leading-[1.04] tracking-[-0.03em] text-left">
          {"Simply compare, order, and get covered"
            .split(" ")
            .map((word, i) => (
              <span
                key={i}
                className="mr-[0.22em] inline-block overflow-hidden pb-[0.12em] align-bottom"
              >
                <span data-word className="inline-block will-change-transform">
                  {word}
                </span>
              </span>
            ))}
        </h2>

        {/* ---------- Products ---------- */}
        <div className="mt-14 grid grid-cols-[repeat(auto-fit,minmax(min(100%,290px),1fr))] gap-4 lg:mt-20 lg:gap-5">
          {products.map((item) => (
            <Link
              key={item.id}
              data-card
              href={item.extra_data?.url || "#"}
              className="group relative block h-[420px] overflow-hidden rounded-[28px] bg-[#1F4D36]/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1F4D36] lg:h-[520px]"
            >
              <Image
                src={item.image_url || "/placeholder.svg"}
                alt=""
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                className="object-cover object-center transition-transform duration-[1200ms] ease-out group-hover:scale-105 motion-reduce:transition-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07140F]/85 via-[#07140F]/15 to-[#07140F]/25" />

              {/* Product type */}
              {item.extra_data?.type && (
                <span className="absolute left-5 top-5 rounded-full border border-white/25 bg-[#07140F]/40 px-4 py-1.5 text-sm font-medium text-[#EEF2E6] backdrop-blur-md">
                  {item.extra_data.type}
                </span>
              )}

              {/* Name: always visible, sits above the notch row */}
              <h3 className="absolute inset-x-0 bottom-0 px-6 pb-[88px] text-2xl font-bold leading-tight tracking-[-0.02em] text-[#EEF2E6] lg:text-3xl">
                {item.name}
              </h3>

              {/* Notch: the arrow grows into a "Learn more" pill on hover / focus (always open on touch) */}
              <div
                aria-hidden
                className="absolute bottom-0 right-0 rounded-tl-[24px] p-2.5"
                style={{ background: BONE }}
              >
                <span
                  className="pointer-events-none absolute bottom-0 right-full"
                  style={fillet}
                />
                <span
                  className="pointer-events-none absolute bottom-full right-0"
                  style={fillet}
                />

                <span className="grid grid-cols-[0fr_auto] items-center rounded-full bg-[#07140F] text-[#EEF2E6] transition-[grid-template-columns] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:grid-cols-[1fr_auto] group-focus-visible:grid-cols-[1fr_auto] motion-reduce:transition-none [@media(hover:none)]:grid-cols-[1fr_auto]">
                  <span className="min-w-0 overflow-hidden">
                    <span className="block whitespace-nowrap pl-5 pr-3 text-[15px] font-medium">
                      Learn more
                    </span>
                  </span>
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F2B84B] text-[#07140F]">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M3 8h10m0 0L9 4m4 4-4 4"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeInsuranceSection;
