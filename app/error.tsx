"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { GiBullHorns } from "react-icons/gi";
import { gsap } from "gsap";
import { Bricolage_Grotesque } from "next/font/google";

if (typeof window !== "undefined") {
  gsap.registerPlugin();
}

const display = Bricolage_Grotesque({ subsets: ["latin"], display: "swap" });

const BONE = "#EEF2E6";
const PINE = "#07140F";
const MOSS = "#1F4D36";
const TAG = "#F2B84B";
const NOTCH = 28;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const fillet: React.CSSProperties = {
  width: NOTCH,
  height: NOTCH,
  background: `radial-gradient(circle at 0 0, transparent ${NOTCH}px, ${BONE} ${NOTCH + 0.5}px)`,
};

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const rootRef = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.fromTo(
        "[data-frame]",
        { clipPath: "inset(14% 18% 14% 18% round 56px)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 28px)",
          duration: 1.4,
          ease: "expo.inOut",
        },
      )
        .from(
          "[data-fade]",
          {
            y: 24,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            stagger: 0.12,
          },
          "-=0.8",
        )
        .fromTo(
          "[data-word]",
          { yPercent: 115 },
          { yPercent: 0, duration: 0.9, ease: "expo.out", stagger: 0.06 },
          "-=0.6",
        )
        .from(
          "[data-cta]",
          { scale: 0.85, opacity: 0, duration: 0.6, ease: "back.out(1.6)" },
          "-=0.4",
        );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      aria-label="Error"
      className={`${display.className} min-h-[100svh] flex items-center justify-center p-2 sm:p-3 lg:p-4`}
      style={{ background: BONE }}
    >
      <div
        data-frame
        className="relative w-full max-w-2xl overflow-hidden rounded-[28px] bg-[#07140F] text-[#EEF2E6]"
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#07140F]/80 via-[#07140F]/40 to-[#1F4D36]/30" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#07140F]/70 via-transparent to-transparent" />

        <div className="relative z-10 flex flex-col items-center text-center px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
          <div data-fade className="flex items-center gap-3 mb-8">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F2B84B] text-[#07140F]">
              <GiBullHorns className="text-xl" aria-hidden />
            </span>
            <span className="text-base font-medium text-[#EEF2E6]/70">
              Error
            </span>
          </div>

          <h1
            data-fade
            className="text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.02] tracking-[-0.03em]"
          >
            {"Something went wrong".split(" ").map((word, i) => (
              <span key={i} className="mr-[0.22em] inline-block overflow-hidden pb-[0.12em] align-bottom">
                <span data-word className="inline-block will-change-transform">
                  {word}
                </span>
              </span>
            ))}
          </h1>

          <p
            data-fade
            className="mt-6 max-w-[42ch] text-base leading-relaxed text-[#EEF2E6]/70 lg:text-lg"
          >
            We couldn&apos;t load this page. It might be a temporary issue or the page
            doesn&apos;t exist.
          </p>

          <div data-fade className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <button
              data-cta
              onClick={reset}
              className="group inline-flex items-center gap-3 rounded-full bg-[#EEF2E6] py-3 px-8 text-base font-medium text-[#07140F] transition-colors duration-300 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F2B84B]"
            >
              Try again
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
            </button>

            <Link
              href="/"
              className="group inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 py-3 px-8 text-base font-medium text-[#EEF2E6] backdrop-blur-xl transition-colors duration-300 hover:bg-white/15 hover:border-white/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F2B84B]"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden
                className="transition-transform duration-300 group-hover:-translate-x-1"
              >
                <path
                  d="M13 8H3m0 0l4-4m4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Go home
            </Link>
          </div>

          {error.digest && (
            <p data-fade className="mt-10 text-xs text-[#EEF2E6]/40 font-mono">
              Error ID: {error.digest}
            </p>
          )}

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
            <span className="text-sm text-[#07140F]/50">
              InsureCow
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}