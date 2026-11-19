"use client";

import React, { useEffect, useLayoutEffect, useRef } from "react";
import Image from "next/image";
import type { StaticImport } from "next/dist/shared/lib/get-img-props";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Bricolage_Grotesque } from "next/font/google";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const display = Bricolage_Grotesque({ subsets: ["latin"], display: "swap" });

const BONE = "#EEF2E6";
const PINE = "#07140F";
const MOSS = "#1F4D36";
const TAG = "#F2B84B";
const FRAME_NOTCH = 28;
const CARD_NOTCH = 24;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const cardFillet: React.CSSProperties = {
  width: CARD_NOTCH,
  height: CARD_NOTCH,
  background: `radial-gradient(circle at 0 0, transparent ${CARD_NOTCH}px, ${BONE} ${CARD_NOTCH + 0.5}px)`,
};

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface ServiceHighlightedProps {
  title: string;
  description: string;
  reverse?: boolean;
  image: string | StaticImport;
  url: string;
}

const ServiceHighlighted: React.FC<ServiceHighlightedProps> = ({
  url,
  image,
  title,
  description,
  reverse = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      });

      if (reverse) {
        tl.from(
          "[data-image]",
          {
            x: 100,
            opacity: 0,
            duration: 1.2,
            ease: "power2.out",
          },
        );
      } else {
        tl.from(
          "[data-image]",
          {
            x: -100,
            opacity: 0,
            duration: 1.2,
            ease: "power2.out",
          },
        );
      }

      tl.from(
        "[data-text]",
        {
          y: 50,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.6",
      );
    }, containerRef);

    return () => ctx.revert();
  }, [reverse]);

  const isStatic = typeof image !== "string";

  return (
    <div
      ref={containerRef}
      className={`${display.className} container mx-auto flex flex-col gap-10 lg:flex-row lg:gap-16 ${reverse ? "lg:flex-row-reverse" : ""} py-10`}
    >
      {/* Image frame with notch */}
      <div data-image className="relative flex-1 lg:min-w-0 overflow-hidden">
        <div className="group relative h-[420px] lg:h-[520px] overflow-hidden rounded-[28px] bg-[#1F4D36]/30">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            placeholder={isStatic ? "blur" : "empty"}
            className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#07140F]/90 via-[#07140F]/30 to-transparent" />
          <div className="absolute inset-0 bg-[#07140F] opacity-40" />

          <Link
            href={url}
            className="absolute inset-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F2B84B]"
            aria-label={`Learn more about ${title}`}
          />

          {/* Card notch: PINE panel (24px radius) with PINE fillets */}
          <div
            aria-hidden
            className="absolute bottom-0 right-0 rounded-tl-[24px] p-2.5"
            style={{ background: BONE }}
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
        </div>
      </div>

      {/* Text content */}
      <div
        data-text
        className="flex-1 lg:min-w-0 flex flex-col justify-center lg:pr-10"
      >
        <h2 className="text-[clamp(2.25rem,4.6vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.03em] text-[#07140F]">
          {title.split(" ").map((word, i) => (
            <span
              key={i}
              className="mr-[0.22em] inline-block overflow-hidden pb-[0.12em] align-bottom"
            >
              <span className="inline-block will-change-transform">{word}</span>
            </span>
          ))}
        </h2>

        <p className="mt-6 max-w-[58ch] text-base leading-loose tracking-wide text-[#07140F]/75 lg:text-lg">
          {description}
        </p>
      </div>
    </div>
  );
};

export default ServiceHighlighted;