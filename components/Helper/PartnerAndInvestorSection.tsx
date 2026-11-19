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

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

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

const PartnerAndInvestorSection = () => {
  const [partners, setPartners] = useState<BaseCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const rootRef = useRef<HTMLElement>(null);

  /* ---------- data (the old version stayed on "Loading" if the category was missing) ---------- */
  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL;

    const fetchCards = async (categoryId: string) => {
      const res = await fetch(
        `${base}/base-category/${categoryId}/base-cards/`,
      );
      const result: BaseCardApiResponse = await res.json();
      if (result.status === "success") setPartners(result.data);
    };

    const load = async () => {
      try {
        const res = await fetch(`${base}/base-categories/`);
        const result: BaseCategoryApiResponse = await res.json();
        if (result.status === "success") {
          const category = result.data.find((c) => c.name === "Partners");
          if (category) await fetchCards(category.id);
        }
      } catch (error) {
        console.error("Error fetching partners:", error);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  /* ---------- one scroll moment: headline rises, logo tiles open from their centre (plays once) ---------- */
  useIsoLayoutEffect(() => {
    if (isLoading || partners.length === 0 || prefersReducedMotion()) return;

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
          { yPercent: 0, duration: 0.9, ease: "expo.out", stagger: 0.06 },
          "-=0.4",
        )
        .fromTo(
          "[data-tile]",
          { clipPath: "inset(50% 50% 50% 50% round 28px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 28px)",
            duration: 0.9,
            ease: "expo.out",
            stagger: { each: 0.06, from: "start" },
          },
          "-=0.5",
        );
    }, rootRef);

    return () => ctx.revert();
  }, [isLoading, partners]);

  /* ---------- states ---------- */
  if (isLoading) {
    return (
      <section
        aria-busy="true"
        className="px-5 py-20 md:px-10 lg:px-16 lg:py-28"
        style={{ background: BONE }}
      >
        <div className="mx-auto max-w-[1450px] animate-pulse">
          <div className="h-10 w-48 rounded-full bg-[#1F4D36]/10" />
          <div className="mt-6 h-14 w-full max-w-xl rounded-lg bg-[#1F4D36]/10" />
          <div className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[0, 1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-[180px] rounded-[28px] bg-[#1F4D36]/10"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (partners.length === 0) return null;

  return (
    <section
      ref={rootRef}
      aria-label="Partners and investors"
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
            Association
          </span>
        </div>

        <h2 className="mt-6 text-[clamp(2.25rem,4.6vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.03em] text-left">
          {"Partners & investors".split(" ").map((word, i) => (
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

        {/* ---------- Logo wall: static, so every partner is always visible ---------- */}
        <ul className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:mt-16 lg:grid-cols-4 xl:grid-cols-5">
          {partners.map((partner) => {
            const url = partner.extra_data?.url;
            const tile = (
              <>
                <div className="relative h-[90px] w-full lg:h-[110px]">
                  <Image
                    src={partner.image_url || "/placeholder.svg"}
                    alt={partner.name}
                    fill
                    sizes="(min-width: 1280px) 18vw, (min-width: 1024px) 22vw, (min-width: 640px) 30vw, 45vw"
                    className="object-contain"
                  />
                </div>

                {url && (
                  <span
                    aria-hidden
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#F2B84B] text-[#07140F] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:opacity-0"
                  >
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M4 12 12 4m0 0H6m6 0v6"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                )}
              </>
            );

            const tileClass =
              "group relative flex h-[170px] items-center justify-center rounded-[28px] border border-[#07140F]/10 bg-[#F8FAF3] p-6 transition-colors duration-300 lg:h-[200px] lg:p-8";

            return (
              <li key={partner.id} data-tile>
                {url ? (
                  <Link
                    href={url}
                    target={isExternal(url) ? "_blank" : undefined}
                    rel={isExternal(url) ? "noopener noreferrer" : undefined}
                    aria-label={partner.name}
                    className={`${tileClass} hover:border-[#1F4D36]/40 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1F4D36]`}
                  >
                    {tile}
                  </Link>
                ) : (
                  <div className={tileClass}>{tile}</div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default PartnerAndInvestorSection;
