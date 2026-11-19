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

/* Palette (same as hero + nav)
   pine #07140F · moss #1F4D36 · bone #EEF2E6 · tag (amber) #F2B84B
   BONE paints this section's background AND the carved notch, so the two
   always match. Keep it equal to the BONE constant in the hero and nav. */
const BONE = "#EEF2E6";
const NOTCH = 28;

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface ExtraData {
  url: string;
  heading: string;
  description: string;
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

// Concave joins for a notch in the bottom-right corner of the frame
const fillet: React.CSSProperties = {
  width: NOTCH,
  height: NOTCH,
  background: `radial-gradient(circle at 0 0, transparent ${NOTCH}px, ${BONE} ${NOTCH + 0.5}px)`,
};

const AboutUsSection: React.FC = () => {
  const [items, setItems] = useState<BaseCard[]>([]);
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
      if (result.status === "success") setItems(result.data);
    };

    const load = async () => {
      try {
        const res = await fetch(`${base}/base-categories/`);
        const result: BaseCategoryApiResponse = await res.json();
        if (result.status === "success") {
          const category = result.data.find(
            (c) => c.name === "About Us - Home Section",
          );
          if (category) await fetchCards(category.id);
        }
      } catch (error) {
        console.error("Error fetching about us data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  /* ---------- scroll sequence: frame opens, headline rises, copy settles ---------- */
  useIsoLayoutEffect(() => {
    if (isLoading || items.length === 0 || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      rootRef.current
        ?.querySelectorAll<HTMLElement>("[data-about-item]")
        .forEach((item) => {
          const q = gsap.utils.selector(item);

          // Parallax: the photo drifts slightly inside its frame
          gsap.fromTo(
            q("[data-parallax]"),
            { yPercent: -5 },
            {
              yPercent: 5,
              ease: "none",
              scrollTrigger: {
                trigger: item,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );

          // Entrance plays once; no replay on scroll-up
          const tl = gsap.timeline({
            scrollTrigger: { trigger: item, start: "top 75%", once: true },
          });

          tl.fromTo(
            q("[data-frame]"),
            { clipPath: "inset(12% 14% 12% 14% round 56px)" },
            {
              clipPath: "inset(0% 0% 0% 0% round 28px)",
              duration: 1.3,
              ease: "expo.inOut",
            },
          )
            .fromTo(
              q("[data-word]"),
              { yPercent: 115 },
              { yPercent: 0, duration: 0.9, ease: "expo.out", stagger: 0.06 },
              "-=0.7",
            )
            .from(
              q("[data-fade]"),
              {
                y: 20,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out",
                stagger: 0.1,
              },
              "-=0.6",
            )
            .from(
              q("[data-cta]"),
              { scale: 0.85, opacity: 0, duration: 0.6, ease: "back.out(1.6)" },
              "-=0.5",
            );
        });
    }, rootRef);

    return () => ctx.revert();
  }, [isLoading, items]);

  /* ---------- states ---------- */
  if (isLoading) {
    return (
      <section
        aria-busy="true"
        className="px-5 py-20 md:px-10 lg:px-16 lg:py-28"
        style={{ background: BONE }}
      >
        <div className="mx-auto grid max-w-[1450px] animate-pulse gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <div className="h-[460px] rounded-[28px] bg-[#1F4D36]/10 lg:h-[620px]" />
          <div className="flex flex-col justify-center gap-4">
            <div className="h-10 w-10 rounded-full bg-[#1F4D36]/10" />
            <div className="h-12 w-3/4 rounded-lg bg-[#1F4D36]/10" />
            <div className="h-6 w-full rounded-lg bg-[#1F4D36]/10" />
            <div className="h-6 w-5/6 rounded-lg bg-[#1F4D36]/10" />
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0) return null;

  return (
    <section
      ref={rootRef}
      aria-label="About us"
      className={`${display.className} px-5 py-20 text-[#07140F] md:px-10 lg:px-16 lg:py-28`}
      style={{ background: BONE }}
    >
      <div className="mx-auto flex flex-col gap-24 lg:gap-32">
        {items.map((item) => (
          <article
            key={item.id}
            data-about-item
            className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16"
          >
            {/* ---------- Image frame with the CTA notch ---------- */}
            <div
              data-frame
              className="group relative h-[460px] overflow-hidden rounded-[28px] bg-[#1F4D36]/15 sm:h-[560px] lg:h-[clamp(520px,78svh,700px)]"
            >
              <div
                data-parallax
                className="absolute inset-x-0 -top-[8%] h-[116%]"
              >
                <Image
                  src={"/homecover1.jpg"}
                  alt={item.name}
                  fill
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  unoptimized
                />
                <div className="absolute inset-0 z-10 bg-black/20" />
              </div>

              {/* Notch: bone panel carved into the bottom-right corner */}
              <div
                className="absolute bottom-0 right-0 rounded-tl-[28px] p-3 lg:p-4"
                style={{ background: BONE }}
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute bottom-0 right-full"
                  style={fillet}
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute bottom-full right-0"
                  style={fillet}
                />

                <Link
                  data-cta
                  href="/about_us_section"
                  scroll
                  className="group/cta inline-flex items-center gap-3 rounded-full bg-[#07140F] py-1.5 pl-6 pr-1.5 text-base font-medium text-[#EEF2E6] transition-colors duration-300 hover:bg-[#1F4D36] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F2B84B]"
                >
                  Learn more
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F2B84B] text-[#07140F] transition-transform duration-300 group-hover/cta:translate-x-1">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      aria-hidden
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
                </Link>
              </div>
            </div>

            {/* ---------- Copy ---------- */}
            <div className="lg:pr-6">
              <div data-fade className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F2B84B] text-[#07140F]">
                  <GiBullHorns className="text-xl" aria-hidden />
                </span>
                <span className="text-base font-medium text-[#1F4D36]">
                  About us
                </span>
              </div>

              {/* Main heading */}
              <h2 className="mt-6 text-[clamp(2.25rem,4.6vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.03em] text-left">
                {item.name.split(" ").map((word, i) => (
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
              </h2>

              {/* Secondary heading */}
              {item.extra_data?.heading && (
                <p
                  data-fade
                  className="mt-6 max-w-[34ch] text-xl font-medium leading-snug text-[#1F4D36] lg:text-2xl text-left"
                >
                  {item.extra_data.heading}
                </p>
              )}

              {/* Description */}
              {item.extra_data?.description && (
                <p
                  data-fade
                  className="mt-5 max-w-[58ch] whitespace-pre-line text-base leading-loose tracking-wide text-[#07140F]/75 lg:text-lg text-left"
                >
                  {item.extra_data.description}
                </p>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default AboutUsSection;
