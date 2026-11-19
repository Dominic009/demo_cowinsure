"use client";

import React, { useEffect, useLayoutEffect, useRef } from "react";
import HerosSectionCommon from "@/components/common/HerosSectionCommon";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Bricolage_Grotesque } from "next/font/google";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const display = Bricolage_Grotesque({ subsets: ["latin"], display: "swap" });

const BONE = "#EEF2E6";
const PINE = "#07140F";
// const MOSS = "#1F4D36";
// const TAG = "#F2B84B";
const FRAME_NOTCH = 28;
const CARD_NOTCH = 24;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const cardFillet: React.CSSProperties = {
  width: CARD_NOTCH,
  height: CARD_NOTCH,
  background: `radial-gradient(circle at 0 0, transparent ${CARD_NOTCH}px, ${PINE} ${CARD_NOTCH + 0.5}px)`,
};

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const VetService = () => {
  const aboutRef = useRef<HTMLElement>(null);
  const importanceRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // About section
      gsap.timeline({
        scrollTrigger: {
          trigger: aboutRef.current,
          start: "top 75%",
          once: true,
        },
      })
        .fromTo(
          "[data-frame]",
          { clipPath: "inset(12% 14% 12% 14% round 56px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 28px)",
            duration: 1.3,
            ease: "expo.inOut",
          },
        )
        .fromTo(
          "[data-word]",
          { yPercent: 115 },
          { yPercent: 0, duration: 0.9, ease: "expo.out", stagger: 0.06 },
          "-=0.7",
        )
        .from(
          "[data-fade]",
          {
            y: 20,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.1,
          },
          "-=0.6",
        );

      // Importance section
      gsap.timeline({
        scrollTrigger: {
          trigger: importanceRef.current,
          start: "top 75%",
          once: true,
        },
      })
        .fromTo(
          "[data-word]",
          { yPercent: 115 },
          { yPercent: 0, duration: 0.9, ease: "expo.out", stagger: 0.06 },
        )
        .from(
          "[data-fade]",
          {
            y: 20,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.1,
          },
          "-=0.6",
        )
        .fromTo(
          "[data-feature-card]",
          { clipPath: "inset(100% 0% 0% 0% round 28px)", opacity: 0 },
          {
            clipPath: "inset(0% 0% 0% 0% round 28px)",
            opacity: 1,
            duration: 1.1,
            ease: "expo.inOut",
            stagger: 0.12,
          },
          "-=0.4",
        );

      // Features section
      gsap.timeline({
        scrollTrigger: {
          trigger: featuresRef.current,
          start: "top 75%",
          once: true,
        },
      })
        .fromTo(
          "[data-word]",
          { yPercent: 115 },
          { yPercent: 0, duration: 0.9, ease: "expo.out", stagger: 0.06 },
        )
        .from(
          "[data-fade]",
          {
            y: 20,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.1,
          },
          "-=0.6",
        )
        .fromTo(
          "[data-service-card]",
          { clipPath: "inset(100% 0% 0% 0% round 28px)", opacity: 0 },
          {
            clipPath: "inset(0% 0% 0% 0% round 28px)",
            opacity: 1,
            duration: 1.1,
            ease: "expo.inOut",
            stagger: 0.12,
          },
          "-=0.4",
        );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className={`${display.className} h-auto overflow-hidden`} style={{ background: BONE }}>
      {/* Hero Banner */}
      <HerosSectionCommon
        title="Veterinary Services"
        bannerUrl="/Vet.jpeg"
        description="Comprehensive health checkups and vaccination support for your livestock"
        link="/contact"
      />

      {/* About Vet Services Section */}
      <section
        ref={aboutRef}
        aria-label="About veterinary services"
        className="px-5 py-20 md:px-10 lg:px-16 lg:py-28"
        style={{ background: BONE }}
      >
        <div className="mx-auto max-w-[1450px]">
          <div data-frame className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
            {/* Image frame with notch */}
            <div
              className="group relative h-[460px] overflow-hidden rounded-[28px] bg-[#1F4D36]/15 sm:h-[560px] lg:h-[clamp(520px,78svh,700px)]"
            >
              <div
                data-parallax
                className="absolute inset-x-0 -top-[8%] h-[116%]"
              >
                <img
                  src="/trusted_vet_serv.jpeg"
                  alt="Trusted Veterinary Services"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 z-10 bg-black/20" />
              </div>

              {/* Notch: BONE panel carved into the bottom-right corner */}
              <div
                className="absolute bottom-0 right-0 rounded-tl-[28px] p-3 lg:p-4"
                style={{ background: BONE }}
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute bottom-0 right-full"
                  style={{
                    width: FRAME_NOTCH,
                    height: FRAME_NOTCH,
                    background: `radial-gradient(circle at 0 0, transparent ${FRAME_NOTCH}px, ${BONE} ${FRAME_NOTCH + 0.5}px)`,
                  }}
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute bottom-full right-0"
                  style={{
                    width: FRAME_NOTCH,
                    height: FRAME_NOTCH,
                    background: `radial-gradient(circle at 0 0, transparent ${FRAME_NOTCH}px, ${BONE} ${FRAME_NOTCH + 0.5}px)`,
                  }}
                />

                <a
                  href="/contact"
                  className="group/cta inline-flex items-center gap-3 rounded-full bg-[#07140F] py-1.5 pl-6 pr-1.5 text-base font-medium text-[#EEF2E6] transition-colors duration-300 hover:bg-[#1F4D36] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F2B84B]"
                >
                  Get vet service
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
                </a>
              </div>
            </div>

            {/* Copy */}
            <div className="lg:pr-6">
              <div data-fade className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F2B84B] text-[#07140F]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <span className="text-base font-medium text-[#1F4D36]">
                  Our services
                </span>
              </div>

              <h2 className="mt-6 text-[clamp(2.25rem,4.6vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.03em] text-[#07140F]">
                {"Trusted veterinary care".split(" ").map((word, i) => (
                  <span key={i} className="mr-[0.22em] inline-block overflow-hidden pb-[0.12em] align-bottom">
                    <span data-word className="inline-block will-change-transform">{word}</span>
                  </span>
                ))}
              </h2>

              <p
                data-fade
                className="mt-6 max-w-[58ch] whitespace-pre-line text-base leading-loose tracking-wide text-[#07140F]/75 lg:text-lg"
              >
                At <span className="font-semibold text-[#07140F]">InsureCow</span>, we are committed to providing reliable, professional, and compassionate veterinary services to ensure the health, productivity, and well-being of your livestock. Our expert team focuses on preventive care, disease management, and long-term animal welfare.
              </p>

              <ul data-fade className="mt-6 space-y-4 text-[#07140F]/75">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-[#F2B84B]/20 text-[#F2B84B]">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                      <path d="M13.333 8L8 13.333 2.667 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  Regular health check-ups to prevent diseases early
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-[#F2B84B]/20 text-[#F2B84B]">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                      <path d="M13.333 8L8 13.333 2.667 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  Professional vaccination programs for livestock safety
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-[#F2B84B]/20 text-[#F2B84B]">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                      <path d="M13.333 8L8 13.333 2.667 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  Emergency care and treatment support
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-[#F2B84B]/20 text-[#F2B84B]">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                      <path d="M13.333 8L8 13.333 2.667 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  Nutritional guidance for healthy growth and productivity
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-[#F2B84B]/20 text-[#F2B84B]">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                      <path d="M13.333 8L8 13.333 2.667 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  Disease prevention and biosecurity consultation
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why Veterinary Services Matter Section */}
      <section
        ref={importanceRef}
        aria-label="Why veterinary services matter"
        className="px-5 py-20 md:px-10 lg:px-16 lg:py-28"
        style={{ background: BONE }}
      >
        <div className="mx-auto max-w-[1450px]">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
            {/* Left: Content */}
            <div className="lg:pr-6">
              <div data-fade className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F2B84B] text-[#07140F]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <span className="text-base font-medium text-[#1F4D36]">
                  Importance
                </span>
              </div>

              <h2 className="mt-6 text-[clamp(2.25rem,4.6vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.03em] text-[#07140F]">
                {"Why veterinary services matter".split(" ").map((word, i) => (
                  <span key={i} className="mr-[0.22em] inline-block overflow-hidden pb-[0.12em] align-bottom">
                    <span data-word className="inline-block will-change-transform">{word}</span>
                  </span>
                ))}
              </h2>

              <p
                data-fade
                className="mt-6 max-w-[58ch] whitespace-pre-line text-base leading-loose tracking-wide text-[#07140F]/75 lg:text-lg"
              >
                Veterinary services play a vital role in sustainable livestock management. With proper care, farmers can prevent diseases, improve productivity, and protect their livelihoods. <span className="font-semibold text-[#07140F]">InsureCow</span> supports farmers through expert veterinary guidance and awareness programs.
              </p>

              <ul data-fade className="mt-6 space-y-4 text-[#07140F]/75">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-[#F2B84B]/20 text-[#F2B84B]">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                      <path d="M13.333 8L8 13.333 2.667 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  Prevents the spread of contagious animal diseases
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-[#F2B84B]/20 text-[#F2B84B]">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                      <path d="M13.333 8L8 13.333 2.667 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  Improves milk, meat, and reproduction performance
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-[#F2B84B]/20 text-[#F2B84B]">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                      <path d="M13.333 8L8 13.333 2.667 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  Reduces financial losses caused by illness
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-[#F2B84B]/20 text-[#F2B84B]">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                      <path d="M13.333 8L8 13.333 2.667 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  Promotes animal welfare and ethical farming
                </li>
              </ul>

              <p
                data-fade
                className="mt-6 max-w-[58ch] whitespace-pre-line text-base leading-loose tracking-wide text-[#07140F]/75 lg:text-lg"
              >
                By raising awareness and providing access to veterinary care, InsureCow helps farmers build stronger, healthier, and more sustainable agricultural communities.
              </p>
            </div>

            {/* Right: Feature Cards */}
            <div data-frame className="grid gap-6 lg:grid-cols-2 lg:grid-rows-3">
              {[
                {
                  title: "Disease Prevention",
                  desc: "Routine health checks and vaccination programs help prevent the spread.",
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  ),
                },
                {
                  title: "Higher Productivity",
                  desc: "Healthy animals grow faster, reproduce better, and deliver higher milk and meat yields.",
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  ),
                },
                {
                  title: "Economic Security",
                  desc: "Preventive veterinary care minimizes medical costs and protects farmers from financial losses.",
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  ),
                },
              ].map((card, index) => (
                <article
                  key={index}
                  data-feature-card
                  className="group relative h-[280px] overflow-hidden rounded-[28px] bg-[#1F4D36]/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F2B84B]"
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F2B84B]/20 text-[#F2B84B] mb-6 group-hover:bg-[#F2B84B] group-hover:text-[#07140F] transition-colors duration-300">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                        {card.icon}
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold leading-tight tracking-[-0.02em] lg:text-2xl text-[#07140F]">
                      {card.title}
                    </h3>
                    <p className="mt-4 text-base text-[#07140F]/75 leading-relaxed">
                      {card.desc}
                    </p>
                  </div>

                  {/* Card notch: PINE panel (24px radius) with PINE fillets */}
                  <div
                    aria-hidden
                    className="absolute bottom-0 right-0 rounded-tl-[24px] p-2.5"
                    style={{ background: PINE }}
                  >
                    <span
                      className="pointer-events-none absolute bottom-0 right-full"
                      style={cardFillet}
                    />
                    <span
                      className="pointer-events-none absolute bottom-full right-0"
                      style={cardFillet}
                    />
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F2B84B] text-[#07140F] transition-transform duration-300 group-hover:translate-x-1">
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
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Service Highlights */}
      <section
        ref={featuresRef}
        aria-label="Veterinary service highlights"
        className="px-5 py-20 md:px-10 lg:px-16 lg:py-28"
        style={{ background: BONE }}
      >
        <div className="mx-auto max-w-[1450px]">
          <div data-fade className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F2B84B] text-[#07140F]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <span className="text-base font-medium text-[#1F4D36]">
              Service highlights
            </span>
          </div>

          <h2 className="mt-6 text-[clamp(2.25rem,4.6vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.03em] text-[#07140F]">
            {"Our veterinary services".split(" ").map((word, i) => (
              <span key={i} className="mr-[0.22em] inline-block overflow-hidden pb-[0.12em] align-bottom">
                <span data-word className="inline-block will-change-transform">{word}</span>
              </span>
            ))}
          </h2>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {[
              {
                title: "Health Check-ups",
                desc: "Comprehensive routine examinations to catch issues early.",
                image: "/trusted_vet_serv.jpeg",
                url: "/service/vet_services#checkup",
              },
              {
                title: "Vaccination Programs",
                desc: "Professional vaccination schedules for disease prevention.",
                image: "/Vet.jpeg",
                url: "/service/vet_services#vaccination",
              },
              {
                title: "Emergency Care",
                desc: "24/7 emergency veterinary support when you need it most.",
                image: "/farmerimg.jpg",
                url: "/service/vet_services#emergency",
              },
            ].map((service, index) => (
              <article
                key={index}
                data-service-card
                className="group relative h-[380px] overflow-hidden rounded-[28px] bg-[#1F4D36]/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F2B84B]"
              >
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#07140F]/90 via-[#07140F]/20 to-transparent" />
                <div className="absolute inset-0 bg-[#07140F] opacity-40" />

                <div className="absolute inset-x-0 bottom-0 p-6 lg:p-8">
                  <h3 className="text-xl font-bold leading-tight tracking-[-0.02em] lg:text-2xl text-[#EEF2E6]">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-sm text-[#EEF2E6]/80">
                    {service.desc}
                  </p>
                </div>

                <a href={service.url} className="absolute inset-0" aria-label={`Learn more about ${service.title}`} />

                {/* Card notch */}
                <div
                  aria-hidden
                  className="absolute bottom-0 right-0 rounded-tl-[24px] p-2.5"
                  style={{ background: PINE }}
                >
                  <span
                    className="pointer-events-none absolute bottom-0 right-full"
                    style={cardFillet}
                  />
                  <span
                    className="pointer-events-none absolute bottom-full right-0"
                    style={cardFillet}
                  />
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F2B84B] text-[#07140F] transition-transform duration-300 group-hover:translate-x-1">
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
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ & Contact */}
      <div className="px-5 py-20 md:px-10 lg:px-16 lg:py-28" style={{ background: BONE }}>
        <div className="mx-auto max-w-[1450px]">
          <div data-fade className="flex items-center gap-3 justify-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F2B84B] text-[#07140F]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <span className="text-base font-medium text-[#1F4D36]">
              Questions?
            </span>
          </div>

          <h2 className="mt-6 text-center text-[clamp(2.25rem,4.6vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.03em] text-[#07140F]">
            {"Frequently asked questions".split(" ").map((word, i) => (
              <span key={i} className="mr-[0.22em] inline-block overflow-hidden pb-[0.12em] align-bottom">
                <span data-word className="inline-block will-change-transform">{word}</span>
              </span>
            ))}
          </h2>

          <div className="mt-12 max-w-3xl mx-auto space-y-4 text-left">
            {[
              { q: "What services does InsureCow provide?", a: "We provide a full range of veterinary services including routine check-ups, vaccinations, emergency care, and nutritional advice for your livestock." },
              { q: "How do I book an appointment?", a: "You can book an appointment by calling our clinic directly or using the online booking form available on our website." },
              { q: "Do you provide on-site veterinary services?", a: "Yes, our veterinarians can visit your farm or location to provide treatment and check-ups as needed." },
              { q: "What are your operating hours?", a: "Our clinic is open Monday to Friday from 8:00 AM to 6:00 PM, and Saturday from 9:00 AM to 2:00 PM." },
              { q: "What should I bring to my pet's appointment?", a: "Please bring any previous medical records, vaccination history, and a list of current medications your animal is taking." },
              { q: "How can I get advice in an emergency?", a: "For urgent situations, please call our emergency hotline. Our team is trained to provide immediate guidance and assistance." },
            ].map((faq, i) => (
              <details
                key={i}
                className="group bg-white/50 rounded-[16px] p-6 transition-colors duration-300 hover:bg-white/80"
              >
                <summary className="flex items-center justify-between cursor-pointer list-none text-[#07140F] font-medium text-lg">
                  {faq.q}
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F2B84B]/20 text-[#F2B84B] transition-transform duration-300 group-open:rotate-45">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                      <path d="M4 8h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M8 4v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-4 text-[#07140F]/75 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>

      <div className="px-5 py-10 md:px-10 lg:px-16" style={{ background: BONE }}>
        <div className="mx-auto max-w-[1450px]">
          <a
            href="/contact"
            className="group inline-flex items-center gap-3 rounded-full bg-[#07140F] py-3 px-8 text-base font-medium text-[#EEF2E6] transition-colors duration-300 hover:bg-[#1F4D36] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F2B84B]"
          >
            Contact us
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F2B84B] text-[#07140F] transition-transform duration-300 group-hover:translate-x-1">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M3 8h10m0 0L9 4m4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default VetService;