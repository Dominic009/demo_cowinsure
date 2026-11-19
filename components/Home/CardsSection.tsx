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

/* Palette (same as hero, nav, about)
   pine #07140F · moss #1F4D36 · bone #EEF2E6 · tag (amber) #F2B84B
   BONE = page background around the panel (match the other files).
   PINE = the panel colour AND the carved notches inside the cards. */
const BONE = "#EEF2E6";
const PINE = "#07140F";
const NOTCH = 24;

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface ExtraData {
  url: string;
  heading: string;
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

// Concave joins for a notch in the bottom-right corner of a card
const fillet: React.CSSProperties = {
  width: NOTCH,
  height: NOTCH,
  background: `radial-gradient(circle at 0 0, transparent ${NOTCH}px, ${PINE} ${NOTCH + 0.5}px)`,
};

const CardsSection: React.FC = () => {
  const [services, setServices] = useState<BaseCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [active, setActive] = useState(0); // which card is expanded (desktop)
  const rootRef = useRef<HTMLElement>(null);

  /* ---------- data ---------- */
  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL;

    const fetchCards = async (categoryId: string) => {
      const res = await fetch(
        `${base}/base-category/${categoryId}/base-cards/`,
      );
      const result: BaseCardApiResponse = await res.json();
      if (result.status === "success") setServices(result.data);
    };

    const load = async () => {
      try {
        const res = await fetch(`${base}/base-categories/`);
        const result: BaseCategoryApiResponse = await res.json();
        if (result.status === "success") {
          const category = result.data.find(
            (c) => c.name === "What We Offer - Home Section",
          );
          if (category) await fetchCards(category.id);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  /* ---------- one scroll moment: headline rises, cards unfold in turn (plays once) ---------- */
  useIsoLayoutEffect(() => {
    if (isLoading || services.length === 0 || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 70%",
          once: true,
        },
      });

      tl.from("[data-fade]", {
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
          "[data-card]",
          { clipPath: "inset(100% 0% 0% 0% round 28px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 28px)",
            duration: 1.1,
            ease: "expo.inOut",
            stagger: 0.12,
          },
          "-=0.6",
        );
    }, rootRef);

    return () => ctx.revert();
  }, [isLoading, services]);

  /* ---------- states ---------- */
  if (isLoading) {
    return (
      <section
        aria-busy="true"
        className="p-2 sm:p-3 lg:p-4"
        style={{ background: BONE }}
      >
        <div
          className="animate-pulse rounded-[28px] px-5 py-16 md:px-10 lg:px-16 lg:py-24"
          style={{ background: PINE }}
        >
          <div className="mx-auto max-w-[1450px]">
            <div className="h-12 w-72 rounded-lg bg-white/10" />
            <div className="mt-12 grid gap-4 lg:grid-cols-3">
              {[0, 1, 2].map((n) => (
                <div
                  key={n}
                  className="h-[340px] rounded-[28px] bg-white/10 lg:h-[520px]"
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (services.length === 0) return null;

  return (
    <section
      ref={rootRef}
      aria-label="What we offer"
      className={`${display.className} p-2 sm:p-3 lg:p-4`}
      // style={{ background: BONE }}
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
            <span className="text-base font-medium text-[#EEF2E6]/70">
              Services
            </span>
          </div>

          <h2 className="mt-6 text-[clamp(2.25rem,4.6vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.03em] text-left text-left">
            {"What we offer".split(" ").map((word, i) => (
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

          {/* ---------- Cards: stacked on mobile, expanding accordion on desktop ---------- */}
          <div className="mt-12 flex flex-col gap-3 lg:mt-16 lg:h-[clamp(480px,72svh,620px)] lg:flex-row lg:gap-4">
            {services.map((item, index) => {
              const isActive = index === active;
              return (
                <Link
                  key={item.id}
                  data-card
                  href={item.extra_data?.url || "/about_us#about-us"}
                  onMouseEnter={() => setActive(index)}
                  onFocus={() => setActive(index)}
                  style={
                    {
                      ["--grow" as string]: isActive ? 3.4 : 1,
                    } as React.CSSProperties
                  }
                  className="group relative block h-[340px] overflow-hidden rounded-[28px] bg-[#1F4D36]/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F2B84B] motion-reduce:transition-none lg:h-auto lg:min-w-0 lg:basis-0 lg:[flex-grow:var(--grow)] lg:transition-[flex-grow] lg:duration-700 lg:ease-[cubic-bezier(0.22,1,0.36,1)]"
                >
                  <Image
                    src={item.image_url || "/placeholder.svg"}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className={`object-cover transition-transform duration-[1200ms] ease-out ${
                      isActive ? "lg:scale-100" : "lg:scale-110"
                    }`}
                  />

                  {/* Readability + focus: collapsed cards dim, the open card is full strength */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07140F]/90 via-[#07140F]/20 to-transparent" />
                  <div
                    className={`absolute inset-0 bg-[#07140F] opacity-0 transition-opacity duration-700 ${
                      isActive ? "" : "lg:opacity-40"
                    }`}
                  />

                  {/* Text */}
                  <div className="absolute inset-x-0 bottom-0 p-6 pr-24 lg:p-8 lg:pr-24">
                    {item.extra_data?.heading && (
                      <p
                        className={`text-base text-[#EEF2E6]/80 transition-all duration-500 ${
                          isActive
                            ? "lg:translate-y-0 lg:opacity-100"
                            : "lg:translate-y-2 lg:opacity-0"
                        }`}
                      >
                        {item.extra_data.heading}
                      </p>
                    )}
                    <h3 className="mt-2 text-2xl font-bold leading-tight tracking-[-0.02em] lg:text-3xl">
                      {item.name}
                    </h3>
                  </div>

                  {/* Notch with the arrow: same carved-corner device as the rest of the site */}
                  <div
                    aria-hidden
                    className="absolute bottom-0 right-0 rounded-tl-[24px] p-2.5"
                    style={{ background: PINE }}
                  >
                    <span
                      className="pointer-events-none absolute bottom-0 right-full"
                      style={fillet}
                    />
                    <span
                      className="pointer-events-none absolute bottom-full right-0"
                      style={fillet}
                    />
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-full bg-[#F2B84B] text-[#07140F] transition-colors duration-500 ${
                        isActive ? "" : "lg:bg-white/10 lg:text-[#EEF2E6]"
                      }`}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        className={`transition-transform duration-500 ${isActive ? "lg:-rotate-45" : ""}`}
                      >
                        <path
                          d="M3 8h10m0 0L9 4m4 4-4 4"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </div>

                  <span className="sr-only">Learn more about {item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CardsSection;
