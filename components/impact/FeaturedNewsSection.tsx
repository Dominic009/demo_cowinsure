"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
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

const BONE = "#EEF2E6";
const PINE = "#07140F";
const MOSS = "#1F4D36";
const TAG = "#F2B84B";
const FRAME_NOTCH = 28;
const CARD_NOTCH = 24;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const frameFillet: React.CSSProperties = {
  width: FRAME_NOTCH,
  height: FRAME_NOTCH,
  background: `radial-gradient(circle at 0 0, transparent ${FRAME_NOTCH}px, ${BONE} ${FRAME_NOTCH + 0.5}px)`,
};

const cardFillet: React.CSSProperties = {
  width: CARD_NOTCH,
  height: CARD_NOTCH,
  background: `radial-gradient(circle at 0 0, transparent ${CARD_NOTCH}px, ${BONE} ${CARD_NOTCH + 0.5}px)`,
};

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface ExtraData {
  url: string;
  date: string;
  headline: string;
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

const FeaturedNewsSection: React.FC = () => {
  const [newsData, setNewsData] = useState<BaseCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleItems, setVisibleItems] = useState(4);
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const fetchBaseCategories = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/base-categories/`);
        const result: BaseCategoryApiResponse = await response.json();
        if (result.status === "success") {
          const newsCategory = result.data.find((category) => category.name === "news");
          if (newsCategory) {
            fetchBaseCards(newsCategory.id);
          }
        }
      } catch (error) {
        console.error("Error fetching base categories:", error);
        setIsLoading(false);
      }
    };

    const fetchBaseCards = async (categoryId: string) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/base-category/${categoryId}/base-cards/`,
        );
        const result: BaseCardApiResponse = await response.json();
        if (result.status === "success") {
          setNewsData(result.data);
        }
      } catch (error) {
        console.error("Error fetching base cards:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBaseCategories();
  }, []);

  const showMoreItems = () => {
    setVisibleItems((prev) => prev + 4);
  };

  useIsoLayoutEffect(() => {
    if (isLoading || newsData.length === 0 || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 75%",
          once: true,
        },
      });

      tl.fromTo(
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
        )
        .fromTo(
          "[data-news-card]",
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
    }, rootRef);

    return () => ctx.revert();
  }, [isLoading, newsData]);

  if (isLoading) {
    return (
      <section
        aria-busy="true"
        className={`${display.className} px-5 py-20 md:px-10 lg:px-16 lg:py-28`}
        style={{ background: BONE }}
      >
        <div className="mx-auto grid max-w-[1450px] animate-pulse gap-6 lg:grid-cols-3">
          {[0, 1, 2].map((n) => (
            <div key={n} className="h-[420px] rounded-[28px] bg-[#1F4D36]/10" />
          ))}
        </div>
      </section>
    );
  }

  const displayedNews = newsData.slice(0, visibleItems);

  return (
    <section
      ref={rootRef}
      aria-label="Featured news"
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
            Strength and vision
          </span>
        </div>

        <h2 className="mt-6 text-[clamp(2.25rem,4.6vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.03em] text-[#07140F]">
          {"Featured news".split(" ").map((word, i) => (
            <span key={i} className="mr-[0.22em] inline-block overflow-hidden pb-[0.12em] align-bottom">
              <span data-word className="inline-block will-change-transform">
                {word}
              </span>
            </span>
          ))}
        </h2>

        <p
          data-fade
          className="mt-6 max-w-[58ch] whitespace-pre-line text-base leading-loose tracking-wide text-[#07140F]/75 lg:text-lg"
        >
          InsureCow connects investors with smallholder farmers for sustainable growth and food security.
        </p>

        {/* ---------- News Cards ---------- */}
        <div data-frame className="mt-12 grid gap-6 lg:grid-cols-3">
          {displayedNews.map((news) => (
            <Link
              key={news.id}
              href={news.extra_data?.url || "/news"}
              data-news-card
              className="group relative block h-[420px] overflow-hidden rounded-[28px] bg-[#1F4D36]/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F2B84B]"
            >
              <Image
                src={news.image_url || "/placeholder.svg"}
                alt=""
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#07140F]/90 via-[#07140F]/30 to-transparent" />
              <div className="absolute inset-0 bg-[#07140F] opacity-40" />

              <div className="absolute inset-x-0 bottom-0 p-6 lg:p-8">
                <h3 className="text-xl font-bold leading-tight tracking-[-0.02em] lg:text-2xl text-[#EEF2E6]">
                  {news.extra_data?.headline || news.name}
                </h3>
                <p className="mt-3 text-sm text-[#EEF2E6]/80">
                  {news.name}
                </p>
                <p className="mt-2 text-xs text-[#EEF2E6]/60">
                  {news.extra_data?.date}
                </p>
              </div>

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
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F2B84B] text-[#07140F]">
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
            </Link>
          ))}
        </div>

        {visibleItems < newsData.length && (
          <div data-fade className="mt-10 text-center">
            <button
              onClick={showMoreItems}
              className="group inline-flex items-center gap-3 rounded-full bg-[#07140F] py-3 px-8 text-base font-medium text-[#EEF2E6] transition-colors duration-300 hover:bg-[#1F4D36] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F2B84B]"
            >
              Show more
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
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedNewsSection;