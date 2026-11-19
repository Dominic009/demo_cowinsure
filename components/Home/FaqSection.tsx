"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
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
const WHATSAPP_URL = "https://wa.me/8801999467873";

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface Faq {
  question: string;
  answer: string;
}

interface ApiResponse {
  status: string;
  message: string;
  data: Faq[];
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const FaqSection: React.FC = () => {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState<number | null>(0); // first answer is open so the section never looks empty
  const rootRef = useRef<HTMLElement>(null);

  /* ---------- data ---------- */
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/faqs/`);
        const result: ApiResponse = await res.json();
        if (result.status === "success") setFaqs(result.data);
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  /* ---------- scroll: headline rises, divider lines draw in, questions follow (plays once) ---------- */
  useIsoLayoutEffect(() => {
    if (isLoading || faqs.length === 0 || prefersReducedMotion()) return;

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
          "[data-line]",
          { scaleX: 0 },
          { scaleX: 1, duration: 1, ease: "expo.out", stagger: 0.08, transformOrigin: "left center" },
          "-=0.6"
        )
        .from("[data-q]", { y: 14, opacity: 0, duration: 0.6, ease: "power3.out", stagger: 0.08 }, "-=0.9");
    }, rootRef);

    return () => ctx.revert();
  }, [isLoading, faqs]);

  /* ---------- states ---------- */
  if (isLoading) {
    return (
      <section aria-busy="true" className="px-5 py-20 md:px-10 lg:px-16 lg:py-28" style={{ background: BONE }}>
        <div className="mx-auto grid max-w-[1450px] animate-pulse gap-12 lg:grid-cols-[5fr_7fr]">
          <div className="space-y-4">
            <div className="h-10 w-32 rounded-full bg-[#1F4D36]/10" />
            <div className="h-20 w-full rounded-lg bg-[#1F4D36]/10" />
          </div>
          <div className="space-y-5">
            {[0, 1, 2, 3].map((n) => (
              <div key={n} className="h-14 rounded-lg bg-[#1F4D36]/10" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (faqs.length === 0) return null;

  return (
    <section
      ref={rootRef}
      aria-label="Frequently asked questions"
      className={`${display.className} px-5 py-20 text-[#07140F] md:px-10 lg:px-16 lg:py-28`}
      style={{ background: BONE }}
    >
      <div className="mx-auto grid max-w-[1450px] gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        {/* ---------- Left: headline + a way to reach you ---------- */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div data-fade className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F2B84B] text-[#07140F]">
              <GiBullHorns className="text-xl" aria-hidden />
            </span>
            <span className="text-base font-medium text-[#1F4D36]">FAQ</span>
          </div>

          <h2 className="mt-6 text-[clamp(2.25rem,4.6vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.03em] text-left">
            {"Frequently asked questions".split(" ").map((word, i) => (
              <span key={i} className="mr-[0.22em] inline-block overflow-hidden pb-[0.12em] align-bottom">
                <span data-word className="inline-block will-change-transform">
                  {word}
                </span>
              </span>
            ))}
          </h2>

          <p data-fade className="mt-6 max-w-[34ch] text-lg leading-snug text-[#07140F]/70 text-left">
            Can’t find what you’re looking for? Message us on WhatsApp and we’ll help.
          </p>

          <div data-fade className="mt-8 text-left">
            <Link
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 rounded-full bg-[#07140F] py-1.5 pl-6 pr-1.5 text-base font-medium text-[#EEF2E6] transition-colors duration-300 hover:bg-[#1F4D36] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F2B84B]"
            >
              Ask on WhatsApp
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F2B84B] text-[#07140F]">
                <FaWhatsapp size={20} aria-hidden />
              </span>
            </Link>
          </div>
        </div>

        {/* ---------- Right: accordion ---------- */}
        <ul className="relative border-b border-[#07140F]/10">
          {faqs.map((faq, index) => {
            const isOpen = open === index;
            return (
              <li key={index} className="relative">
                <span
                  data-line
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-px origin-left bg-[#07140F]/10"
                />
                <h3 data-q>
                  <button
                    type="button"
                    id={`faq-button-${index}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${index}`}
                    onClick={() => setOpen(isOpen ? null : index)}
                    className="group flex w-full items-center justify-between gap-6 py-6 text-left text-xl font-bold leading-snug tracking-[-0.01em] transition-colors duration-300 hover:text-[#1F4D36] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#1F4D36] lg:text-2xl"
                  >
                    <span>{faq.question}</span>
                    <span
                      aria-hidden
                      className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
                        isOpen
                          ? "border-[#F2B84B] bg-[#F2B84B]"
                          : "border-[#07140F]/20 group-hover:border-[#1F4D36]"
                      }`}
                    >
                      <span className="absolute h-[2px] w-4 rounded bg-[#07140F]" />
                      <span
                        className={`absolute h-4 w-[2px] rounded bg-[#07140F] transition-transform duration-300 motion-reduce:transition-none ${
                          isOpen ? "rotate-90" : ""
                        }`}
                      />
                    </span>
                  </button>
                </h3>

                {/* Height animates with the grid-rows trick: no measuring, no JS */}
                <div
                  id={`faq-panel-${index}`}
                  role="region"
                  aria-labelledby={`faq-button-${index}`}
                  aria-hidden={!isOpen}
                  className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-[62ch] whitespace-pre-line pb-7 pr-16 text-base leading-relaxed text-[#07140F]/70 lg:text-lg text-left">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default FaqSection;