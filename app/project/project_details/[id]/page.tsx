"use client";

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowDown, ArrowLeft, Clock, MapPin, Minus, Plus, TrendingUp } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Bricolage_Grotesque } from "next/font/google";
import FaqSection from "@/components/Home/FaqSection";
import CowInvestmentForm from "@/components/Project/CowInvestmentForm";
import { formatToBDT } from "@/utils/currencyFormatter";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const display = Bricolage_Grotesque({ subsets: ["latin"], display: "swap" });

/* Palette (same as the rest of the site)
   pine #07140F · moss #1F4D36 · bone #EEF2E6 · tag (amber) #F2B84B
   BONE = page background and the colour of the hero's carved notch. */
const BONE = "#EEF2E6";
const PINE = "#07140F";
const NOTCH = 24;

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export interface Category {
  id: string;
  name: string;
}

export interface ProjectDetails {
  id: string;
  name: string;
  location: string;
  investment_value: string;
  currency: string;
  investment_period: string;
  expected_return_min: string;
  expected_return_max: string;
  total_return_min: string;
  total_return_max: string;
  image_url: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category: Category;
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Concave joins for the hero's bottom-right notch
const fillet: React.CSSProperties = {
  width: NOTCH,
  height: NOTCH,
  background: `radial-gradient(circle at 0 0, transparent ${NOTCH}px, ${BONE} ${NOTCH + 0.5}px)`,
};

// Principal plus the expected return for one unit (same formula as before)
const calculateReturn = (investment: number, ratePercent: number) =>
  investment + investment * (ratePercent / 100);

const Words = ({ text }: { text: string }) => (
  <>
    {text.split(" ").map((word, i) => (
      <span key={i} className="mr-[0.22em] inline-block overflow-hidden pb-[0.12em] align-bottom">
        <span data-word className="inline-block will-change-transform">
          {word}
        </span>
      </span>
    ))}
  </>
);

const DetailsID = () => {
  const { id } = useParams() as { id: string };

  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [units, setUnits] = useState(1);
  const rootRef = useRef<HTMLDivElement>(null);

  /* ---------- data (the old page flashed "404" while loading) ---------- */
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/portfolio/${id}/`);
        const json = await res.json();
        if (!cancelled) setProject(json?.data ?? null);
      } catch (error) {
        console.error("Error fetching project details:", error);
        if (!cancelled) setProject(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  /* ---------- projection: derived values, no extra state or effects ---------- */
  const { unitPrice, minTotal, maxTotal } = useMemo(() => {
    const price = project?.investment_value ? parseInt(project.investment_value, 10) : 0;
    const minRate = project?.expected_return_min ? parseFloat(project.expected_return_min) : 0;
    const maxRate = project?.expected_return_max ? parseFloat(project.expected_return_max) : 0;
    return {
      unitPrice: price,
      minTotal: calculateReturn(price, minRate) * units,
      maxTotal: calculateReturn(price, maxRate) * units,
    };
  }, [project, units]);

  /* ---------- motion: hero opens once, everything else reveals as it arrives ---------- */
  useIsoLayoutEffect(() => {
    if (!project || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline()
        .fromTo(
          "[data-frame]",
          { clipPath: "inset(10% 14% 10% 14% round 56px)" },
          { clipPath: "inset(0% 0% 0% 0% round 28px)", duration: 1.3, ease: "expo.inOut" }
        )
        .fromTo(
          "[data-hero-word]",
          { yPercent: 115 },
          { yPercent: 0, duration: 0.9, ease: "expo.out", stagger: 0.06 },
          "-=0.6"
        )
        .from("[data-hero-fade]", { y: 18, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.08 }, "-=0.6");

      rootRef.current?.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          y: 28,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, [project]);

  /* ---------- states ---------- */
  if (isLoading) {
    return (
      <div aria-busy="true" className="p-2 sm:p-3 lg:p-4" style={{ background: BONE }}>
        <div className="h-[88svh] min-h-[560px] animate-pulse rounded-[28px] bg-[#1F4D36]/15" />
      </div>
    );
  }

  if (!project) {
    return (
      <section
        className={`${display.className} flex min-h-[70svh] flex-col items-start justify-center px-5 py-32 text-[#07140F] md:px-10 lg:px-16`}
        style={{ background: BONE }}
      >
        <div className="mx-auto w-full max-w-[1450px]">
          <h1 className="text-[clamp(2.25rem,5vw,4.5rem)] font-bold leading-[1.05] tracking-[-0.03em]">
            We couldn’t find that project
          </h1>
          <p className="mt-5 max-w-[44ch] text-lg text-[#07140F]/70">
            It may have been removed, or the link may be incorrect.
          </p>
          <Link
            href="/project"
            className="group mt-8 inline-flex items-center gap-3 rounded-full bg-[#07140F] py-1.5 pl-6 pr-1.5 text-base font-medium text-[#EEF2E6] transition-colors duration-300 hover:bg-[#1F4D36] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F2B84B]"
          >
            Back to projects
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F2B84B] text-[#07140F]">
              <ArrowLeft className="h-4 w-4" aria-hidden />
            </span>
          </Link>
        </div>
      </section>
    );
  }

  const kpis = [
    { icon: TrendingUp, label: "Expected return", value: `${project.expected_return_min}% – ${project.expected_return_max}%` },
    { icon: Clock, label: "Duration", value: project.investment_period },
    { icon: MapPin, label: "Location", value: project.location },
  ];

  const stats = [
    { title: "Unit price", value: formatToBDT(unitPrice), accent: true },
    { title: "Min return", value: `${project.expected_return_min}%` },
    { title: "Max return", value: `${project.expected_return_max}%` },
    { title: "Investment period", value: project.investment_period },
  ];

  return (
    <div ref={rootRef} className={`${display.className} text-[#07140F]`} style={{ background: BONE }}>
      {/* ================= HERO ================= */}
      <section aria-label="Project" className="p-2 sm:p-3 lg:p-4">
        <div
          data-frame
          className="relative h-[88svh] min-h-[560px] overflow-hidden rounded-[28px] bg-[#07140F] text-[#EEF2E6]"
        >
          <Image
            src={project.image_url}
            alt={project.name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07140F]/85 via-[#07140F]/25 to-[#07140F]/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#07140F]/60 to-transparent" />

          <div className="relative z-10 flex h-full flex-col justify-end px-5 pb-24 md:px-10 lg:px-16 lg:pb-12 lg:pr-[300px]">
            <Link
              data-hero-fade
              href="/project"
              className="mb-6 inline-flex items-center gap-2 self-start rounded-full border border-white/25 bg-[#07140F]/40 py-2 pl-3 pr-4 text-sm backdrop-blur-md transition-colors duration-300 hover:bg-[#F2B84B] hover:text-[#07140F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2B84B]"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              All projects
            </Link>

            <h1 className="max-w-4xl text-[clamp(2.25rem,5.6vw,5rem)] font-bold leading-[1.03] tracking-[-0.03em]">
              {project.name.split(" ").map((word, i) => (
                <span key={i} className="mr-[0.22em] inline-block overflow-hidden pb-[0.12em] align-bottom">
                  <span data-hero-word className="inline-block will-change-transform">
                    {word}
                  </span>
                </span>
              ))}
            </h1>

            <ul className="mt-7 flex flex-wrap gap-3">
              {kpis.map(({ icon: Icon, label, value }) => (
                <li
                  key={label}
                  data-hero-fade
                  className="flex items-center gap-2.5 rounded-full border border-white/25 bg-[#07140F]/40 px-4 py-2.5 text-sm backdrop-blur-md"
                >
                  <Icon className="h-4 w-4 text-[#F2B84B]" aria-hidden />
                  <span className="text-[#EEF2E6]/70">{label}</span>
                  <span className="font-medium">{value}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Notch: the primary action is carved into the corner */}
          <div
            data-hero-fade
            className="absolute bottom-0 right-0 z-10 rounded-tl-[24px] p-3"
            style={{ background: BONE }}
          >
            <span aria-hidden className="pointer-events-none absolute bottom-0 right-full" style={fillet} />
            <span aria-hidden className="pointer-events-none absolute bottom-full right-0" style={fillet} />
            <a
              href="#invest"
              className="group flex items-center rounded-full bg-[#07140F] py-1.5 pl-6 pr-1.5 text-base font-medium text-[#EEF2E6] transition-colors duration-300 hover:bg-[#1F4D36] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F2B84B]"
            >
              Invest now
              <span className="ml-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#F2B84B] text-[#07140F]">
                <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" aria-hidden />
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* ================= OVERVIEW ================= */}
      <section aria-label="Project overview" className="px-5 pb-20 pt-20 md:px-10 lg:px-16 lg:pb-28 lg:pt-28">
        <div className="mx-auto max-w-[1450px]">
          <h2 data-reveal className="text-[clamp(2rem,4vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.03em]">
            Project overview
          </h2>

          <dl
            data-reveal
            className="mt-10 grid grid-cols-2 overflow-hidden rounded-[28px] border border-[#07140F]/10 bg-[#F8FAF3] lg:grid-cols-4"
          >
            {stats.map((s, i) => (
              <div
                key={s.title}
                className={`border-[#07140F]/10 p-6 lg:p-8 ${i % 2 === 0 ? "border-r lg:border-r-0" : ""} ${
                  i < 2 ? "border-b lg:border-b-0" : ""
                } ${i > 0 ? "lg:border-l" : ""}`}
              >
                <dt className="text-sm text-[#07140F]/55">{s.title}</dt>
                <dd
                  className={`mt-2 text-2xl font-bold tracking-[-0.02em] lg:text-3xl ${
                    s.accent ? "text-[#1F4D36]" : ""
                  }`}
                >
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>

          {/* Content comes from your API as HTML. Sanitise it on the server (or with DOMPurify) if editors other than you can write to it. */}
          <div
            data-reveal
            className="prose prose-lg mt-12 max-w-3xl prose-headings:font-bold prose-headings:text-[#07140F] prose-p:text-[#07140F]/75 prose-li:text-[#07140F]/75 prose-strong:text-[#07140F] prose-a:text-[#1F4D36]"
            dangerouslySetInnerHTML={{ __html: project.description }}
          />
        </div>
      </section>

      {/* ================= INVEST ================= */}
      <section id="invest" aria-label="Invest in this project" className="scroll-mt-24 p-2 sm:p-3 lg:p-4">
        <div
          data-reveal
          className="mx-auto grid max-w-[1450px] gap-3 rounded-[28px] p-3 text-[#EEF2E6] lg:grid-cols-2 lg:gap-4 lg:p-4"
          style={{ background: PINE }}
        >
          {/* Form */}
          <div className="rounded-[20px] bg-[#EEF2E6] p-6 text-[#07140F] lg:p-10">
            <CowInvestmentForm />
          </div>

          {/* Projection */}
          <div className="p-6 lg:p-10">
            <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-tight tracking-[-0.02em]">
              Profit projection
            </h2>

            <dl className="mt-8 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/15 bg-white/[0.06] p-5">
                <dt className="text-sm text-[#EEF2E6]/60">Return</dt>
                <dd className="mt-1 text-xl font-bold">
                  {project.expected_return_min}% – {project.expected_return_max}%
                </dd>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/[0.06] p-5">
                <dt className="text-sm text-[#EEF2E6]/60">Duration</dt>
                <dd className="mt-1 text-xl font-bold">{project.investment_period}</dd>
              </div>
            </dl>

            <div className="mt-3 rounded-2xl border border-white/15 bg-white/[0.06] p-6 lg:p-8">
              <p className="text-sm text-[#EEF2E6]/60">Total estimated return</p>
              <p
                className="mt-2 text-[clamp(1.75rem,3.2vw,2.75rem)] font-bold leading-tight tracking-[-0.02em] text-[#F2B84B] tabular-nums"
                aria-live="polite"
              >
                {formatToBDT(minTotal)} – {formatToBDT(maxTotal)}
              </p>

              <div className="mt-8 flex items-center justify-between gap-4 border-t border-white/10 pt-6">
                <span id="units-label" className="text-base text-[#EEF2E6]/80">
                  Units
                </span>
                <div role="group" aria-labelledby="units-label" className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setUnits((u) => Math.max(1, u - 1))}
                    disabled={units <= 1}
                    aria-label="Decrease units"
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-white/25 transition-colors duration-300 hover:bg-[#F2B84B] hover:text-[#07140F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2B84B] disabled:pointer-events-none disabled:opacity-30"
                  >
                    <Minus className="h-5 w-5" aria-hidden />
                  </button>
                  <span className="min-w-[2ch] text-center text-3xl font-bold tabular-nums">{units}</span>
                  <button
                    type="button"
                    onClick={() => setUnits((u) => u + 1)}
                    aria-label="Increase units"
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-white/25 transition-colors duration-300 hover:bg-[#F2B84B] hover:text-[#07140F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2B84B]"
                  >
                    <Plus className="h-5 w-5" aria-hidden />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <FaqSection />
    </div>
  );
};

export default DetailsID;