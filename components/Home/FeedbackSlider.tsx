"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import Image from "next/image";
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
   BONE is the section background AND the colour of the carved notch. */
const BONE = "#EEF2E6";
const NOTCH = 24;

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface Testimonial {
  id: number;
  name: string;
  designation: string;
  quotes: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

interface TestimonialApiResponse {
  status: string;
  message: string;
  data: Testimonial[];
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Concave joins for a notch in the bottom-left corner of the card
const fillet: React.CSSProperties = {
  width: NOTCH,
  height: NOTCH,
  background: `radial-gradient(circle at 100% 0, transparent ${NOTCH}px, ${BONE} ${NOTCH + 0.5}px)`,
};

const Arrow = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path d="M3 8h10m0 0L9 4m4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const pad = (n: number) => String(n).padStart(2, "0");

const FeedbackSlider = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [active, setActive] = useState(0);

  const rootRef = useRef<HTMLElement>(null);
  const swiperRef = useRef<SwiperType | null>(null);

  /* ---------- data ---------- */
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/testimonials/`);
        const result: TestimonialApiResponse = await res.json();
        if (result.status === "success") setTestimonials(result.data);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  /* ---------- one scroll moment (plays once) ---------- */
  useIsoLayoutEffect(() => {
    if (isLoading || testimonials.length === 0 || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline({ scrollTrigger: { trigger: rootRef.current, start: "top 70%", once: true } })
        .from("[data-fade]", { y: 16, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.1 })
        .fromTo(
          "[data-word]",
          { yPercent: 115 },
          { yPercent: 0, duration: 0.9, ease: "expo.out", stagger: 0.05 },
          "-=0.5"
        )
        .fromTo(
          "[data-stage]",
          { clipPath: "inset(0% 100% 0% 0% round 28px)" },
          { clipPath: "inset(0% 0% 0% 0% round 28px)", duration: 1.2, ease: "expo.inOut" },
          "-=0.9"
        );
    }, rootRef);

    return () => ctx.revert();
  }, [isLoading, testimonials]);

  /* ---------- states ---------- */
  if (isLoading) {
    return (
      <section aria-busy="true" className="px-5 py-20 md:px-10 lg:px-16 lg:py-28" style={{ background: BONE }}>
        <div className="mx-auto grid max-w-[1450px] animate-pulse gap-10 lg:grid-cols-[5fr_7fr]">
          <div className="space-y-4">
            <div className="h-10 w-48 rounded-full bg-[#1F4D36]/10" />
            <div className="h-24 w-full rounded-lg bg-[#1F4D36]/10" />
          </div>
          <div className="h-[420px] rounded-[28px] bg-[#1F4D36]/10" />
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) return null;

  const headline = "What they’re talking about InsureCow";

  return (
    <section
      ref={rootRef}
      aria-label="Testimonials"
      className={`${display.className} px-5 py-20 text-[#07140F] md:px-10 lg:px-16 lg:py-28`}
      style={{ background: BONE }}
    >
      <div className="mx-auto grid max-w-[1450px] gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        {/* ---------- Left: headline + controls ---------- */}
        <div className="flex flex-col justify-between gap-10">
          <div>
            <div data-fade className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F2B84B] text-[#07140F]">
                <GiBullHorns className="text-xl" aria-hidden />
              </span>
              <span className="text-base font-medium text-[#1F4D36]">Our testimonials</span>
            </div>

            <h2 className="mt-6 text-[clamp(2.25rem,4.4vw,3.75rem)] font-bold leading-[1.05] tracking-[-0.03em] text-left">
              {headline.split(" ").map((word, i) => (
                <span key={i} className="mr-[0.22em] inline-block overflow-hidden pb-[0.12em] align-bottom">
                  <span data-word className="inline-block will-change-transform">
                    {word}
                  </span>
                </span>
              ))}
            </h2>
          </div>

          <div data-fade className="flex items-center gap-5">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => swiperRef.current?.slidePrev()}
                aria-label="Previous testimonial"
                className="flex h-12 w-12 rotate-180 items-center justify-center rounded-full border border-[#07140F]/20 transition-colors duration-300 hover:bg-[#F2B84B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F4D36]"
              >
                <Arrow />
              </button>
              <button
                type="button"
                onClick={() => swiperRef.current?.slideNext()}
                aria-label="Next testimonial"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-[#07140F]/20 transition-colors duration-300 hover:bg-[#F2B84B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F4D36]"
              >
                <Arrow />
              </button>
            </div>
            <p className="text-base tabular-nums text-[#07140F]/60" aria-live="polite">
              {pad(active + 1)} of {pad(testimonials.length)}
            </p>
          </div>
        </div>

        {/* ---------- Right: the quote ---------- */}
        <div data-stage className="min-w-0 overflow-hidden rounded-[28px]">
          <Swiper
            modules={[Autoplay]}
            slidesPerView={1}
            rewind
            autoHeight
            speed={700}
            grabCursor
            autoplay={{ delay: 9000, pauseOnMouseEnter: true, disableOnInteraction: true }}
            onSwiper={(s) => (swiperRef.current = s)}
            onSlideChange={(s) => setActive(s.realIndex)}
          >
            {testimonials.map((t) => (
              <SwiperSlide key={t.id}>
                <figure className="relative m-0 flex min-h-[440px] flex-col rounded-[28px] bg-[#1F4D36] p-8 pb-32 text-[#EEF2E6] lg:p-12 lg:pb-36">
                  <span aria-hidden className="block text-[7rem] font-bold leading-[0.7] text-[#F2B84B]">
                    “
                  </span>
                  <blockquote className="mt-4 text-[clamp(1.25rem,2.1vw,1.85rem)] font-medium leading-snug">
                    {t.quotes}
                  </blockquote>

                  {/* The person sits in a notch carved into the corner */}
                  <figcaption
                    className="absolute bottom-0 left-0 flex items-center gap-4 rounded-tr-[24px] p-3 pr-7 text-[#07140F]"
                    style={{ background: BONE }}
                  >
                    <span aria-hidden className="pointer-events-none absolute bottom-0 left-full" style={fillet} />
                    <span aria-hidden className="pointer-events-none absolute bottom-full left-0" style={fillet} />

                    <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-[#1F4D36]/15">
                      {t.image_url && (
                        <Image src={t.image_url} alt={t.name} fill sizes="56px" className="object-cover" unoptimized />
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-base font-bold">{t.name}</span>
                      <span className="block truncate text-sm text-[#07140F]/60">{t.designation}</span>
                    </span>
                  </figcaption>
                </figure>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default FeedbackSlider;