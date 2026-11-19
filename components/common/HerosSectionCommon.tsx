"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { StaticImport } from "next/dist/shared/lib/get-img-props";
import { Bricolage_Grotesque } from "next/font/google";

const display = Bricolage_Grotesque({ subsets: ["latin"], display: "swap" });

/* Palette (same as the rest of the site)
   pine #07140F · moss #1F4D36 · bone #EEF2E6 · tag (amber) #F2B84B
   BONE is the page margin around the frame AND the colour of the carved CTA
   notch. Keep it equal to the other files. */
const BONE = "#EEF2E6";
const NOTCH = 24;

// Concave joins for the notch in the bottom-right corner of the frame
const fillet: React.CSSProperties = {
  width: NOTCH,
  height: NOTCH,
  background: `radial-gradient(circle at 0 0, transparent ${NOTCH}px, ${BONE} ${NOTCH + 0.5}px)`,
};

/* Motion is plain CSS, so this stays a server component and nothing flashes before hydration. */
const css = `
@keyframes ab-open { from { clip-path: inset(10% 14% 10% 14% round 56px); } to { clip-path: inset(0% 0% 0% 0% round 28px); } }
@keyframes ab-rise { from { transform: translateY(115%); } to { transform: translateY(0); } }
@keyframes ab-fade { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
@keyframes ab-push { from { transform: scale(1.02); } to { transform: scale(1.1); } }
.ab-frame { animation: ab-open 1.3s cubic-bezier(0.87, 0, 0.13, 1) both; }
.ab-img { animation: ab-push 14s ease-out both; }
.ab-word { animation: ab-rise 0.9s cubic-bezier(0.16, 1, 0.3, 1) both; animation-delay: calc(0.7s + var(--i) * 60ms); }
.ab-fade { animation: ab-fade 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; animation-delay: var(--d, 1.1s); }
@media (prefers-reduced-motion: reduce) {
  .ab-frame, .ab-img, .ab-word, .ab-fade { animation: none; }
}`;

const Words = ({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) => (
  <>
    {text.split(" ").map((word, i) => (
      <span
        key={i}
        className="mr-[0.22em] inline-block overflow-hidden pb-[0.12em] align-bottom"
      >
        <span
          className={`ab-word inline-block will-change-transform ${className}`}
          style={{ ["--i" as string]: i } as React.CSSProperties}
        >
          {word}
        </span>
      </span>
    ))}
  </>
);

interface AppBrandingProps {
  title?: string;
  description?: string;
  bannerUrl: string | StaticImport | null;
  /** A class string sets the frame's size (e.g. "h-[60svh]"); an object is applied as inline style. */
  customStyles?: string | React.CSSProperties;
  link?: string;
  alt?: string;
}

const DEFAULT_DESCRIPTION =
  "Together, we can make a real difference—your investment brings hope and progress to millions.";

const HerosSectionCommon: React.FC<AppBrandingProps> = ({
  title,
  description,
  customStyles,
  bannerUrl,
  link,
  alt = "",
}) => {
  const sizeClass =
    typeof customStyles === "string"
      ? customStyles
      : "h-[80svh] min-h-[520px] lg:h-[88svh]";
  const inlineStyle =
    typeof customStyles === "object" ? customStyles : undefined;
  const isStatic = typeof bannerUrl !== "string";

  return (
    <section
      aria-label={title ?? "Banner"}
      className={`${display.className} p-2 sm:p-3 lg:p-4`}
      style={{ background: BONE }}
    >
      <style>{css}</style>

      <div
        className={`ab-frame relative w-full overflow-hidden rounded-[28px] bg-[#07140F] text-[#EEF2E6] ${sizeClass}`}
        style={inlineStyle}
      >
        <Image
          src={bannerUrl || "/placeholder.svg"}
          alt={alt}
          fill
          priority
          sizes="100vw"
          placeholder={isStatic ? "blur" : "empty"}
          className="ab-img object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07140F]/85 via-[#07140F]/30 to-[#07140F]/35" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07140F]/60 to-transparent" />

        {/* Copy: bottom-left, so the image stays open on the right */}
        <div
          className={`relative z-10 flex h-full flex-col justify-end px-5 md:px-10 lg:px-16 lg:pb-12 ${
            link ? "pb-24 lg:pr-[300px]" : "pb-10"
          }`}
        >
          <h1 className="max-w-4xl text-[clamp(2.25rem,5.6vw,5rem)] font-bold leading-[1.03] tracking-[-0.03em]">
            {title ? (
              <Words text={title} />
            ) : (
              <>
                <Words text="Empowering Communities," />
                <Words text="Simplified." className="text-[#F2B84B]" />
              </>
            )}
          </h1>

          <p
            className="ab-fade mt-6 max-w-[46ch] text-lg leading-snug text-[#EEF2E6]/80 lg:text-2xl"
            style={{ ["--d" as string]: "1.2s" } as React.CSSProperties}
          >
            {description ?? DEFAULT_DESCRIPTION}
          </p>
        </div>

        {/* Optional CTA, carved into the corner */}
        {link && (
          <div
            className="ab-fade absolute bottom-0 right-0 z-10 rounded-tl-[24px] p-3"
            style={
              {
                background: BONE,
                ["--d" as string]: "1.4s",
              } as React.CSSProperties
            }
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
              href={link}
              className="group flex items-center rounded-full bg-[#07140F] py-1.5 pl-6 pr-1.5 text-base font-medium text-[#EEF2E6] transition-colors duration-300 hover:bg-[#1F4D36] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F2B84B]"
            >
              Learn more
              <span className="ml-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#F2B84B] text-[#07140F]">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden
                  className="transition-transform duration-300 group-hover:translate-x-1"
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
        )}
      </div>
    </section>
  );
};

export default HerosSectionCommon;
