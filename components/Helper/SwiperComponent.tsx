"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/effect-fade";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { Bricolage_Grotesque } from "next/font/google";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
});

/* Palette
   pine  #07140F  shadow + text on light
   moss  #1F4D36  brand green
   bone  #EEF2E6  page margin, stats panel, text on dark
   tag   #F2B84B  ear-tag amber accent
   NOTE: bone is also the page background around the frame and inside the
   stats notch. If your page bg differs, change BONE below to match it. */
const BONE = "#EEF2E6";
const NOTCH = 28; // px radius of the carved corner

interface SliderData {
  id: number;
  title: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

interface ApiResponse {
  data: SliderData[];
  status: string;
}

const AUTOPLAY_MS = 6000;
const RING_C = 2 * Math.PI * 22;

const STATS = [
  { label: "Cattle farmers", value: 11000, suffix: "+" },
  { label: "Cattle covered", value: 24500, suffix: "+" },
  { label: "Fraudulent claims", value: 0, suffix: "", highlight: true },
  { label: "Farmers trained", value: 2000, suffix: "+" },
];

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const Ring = ({ className = "" }: { className?: string }) => (
  <span
    className={`relative flex h-12 w-12 shrink-0 items-center justify-center ${className}`}
  >
    <svg
      viewBox="0 0 48 48"
      className="absolute inset-0 -rotate-90"
      aria-hidden
    >
      <circle
        cx="24"
        cy="24"
        r="22"
        fill="none"
        stroke="rgba(255,255,255,0.28)"
        strokeWidth="2"
      />
      <circle
        data-ring
        cx="24"
        cy="24"
        r="22"
        fill="none"
        stroke="#F2B84B"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray={RING_C}
        strokeDashoffset={RING_C}
      />
    </svg>
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className="text-[#EEF2E6]"
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
);

const HeroBannerFrame = () => {
  const [slides, setSlides] = useState<SliderData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [textIndex, setTextIndex] = useState(0);

  const swiperRef = useRef<SwiperType | null>(null);
  const rootRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const statRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const firstRun = useRef(true);

  /* ---------- data ---------- */
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/slider/`,
        );
        const json: ApiResponse = await res.json();
        if (json.status === "success") setSlides(json.data);
      } catch (err) {
        console.error("Error fetching slider data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  /* ---------- progress ring (driven by Swiper's autoplay clock) ---------- */
  const updateRing = useCallback((progress: number) => {
    rootRef.current
      ?.querySelectorAll<SVGCircleElement>("[data-ring]")
      .forEach((c) => {
        c.style.strokeDashoffset = String(RING_C * (1 - progress));
      });
  }, []);

  /* ---------- headline words rise out of a mask ---------- */
  useLayoutEffect(() => {
    if (isLoading || !titleRef.current) return;
    const words = titleRef.current.querySelectorAll("[data-word]");
    if (prefersReducedMotion()) {
      gsap.set(words, { yPercent: 0 });
      return;
    }
    const delay = firstRun.current ? 0.9 : 0; // wait for the frame to open on first load
    firstRun.current = false;
    const tween = gsap.fromTo(
      words,
      { yPercent: 115 },
      { yPercent: 0, duration: 0.9, ease: "expo.out", stagger: 0.06, delay },
    );
    return () => {
      tween.kill();
    };
  }, [textIndex, isLoading]);

  const handleSlideChange = (swiper: SwiperType) => {
    const next = swiper.realIndex;
    setActiveIndex(next);
    updateRing(0);

    const words = titleRef.current?.querySelectorAll("[data-word]");
    if (!words || prefersReducedMotion()) {
      setTextIndex(next);
      return;
    }
    gsap.killTweensOf(words);
    gsap.to(words, {
      yPercent: -115,
      duration: 0.4,
      ease: "power3.in",
      stagger: 0.02,
      onComplete: () => setTextIndex(next),
    });
  };

  /* ---------- load sequence: frame opens, content follows, numbers count ---------- */
  useEffect(() => {
    if (isLoading || slides.length === 0) return;
    const reduce = prefersReducedMotion();

    const ctx = gsap.context(() => {
      if (!reduce) {
        gsap.fromTo(
          "[data-frame]",
          { clipPath: "inset(14% 18% 14% 18% round 56px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 28px)",
            duration: 1.4,
            ease: "expo.inOut",
          },
        );
        gsap.from("[data-reveal]", {
          y: 24,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.12,
          delay: 1.0,
        });
      }

      STATS.forEach((stat, i) => {
        const el = statRefs.current[i];
        if (!el) return;
        const fmt = (n: number) =>
          Math.round(n).toLocaleString("en-US") + stat.suffix;
        if (reduce || stat.value === 0) {
          el.textContent = fmt(stat.value);
          return;
        }
        const counter = { n: 0 };
        gsap.to(counter, {
          n: stat.value,
          duration: 2.2,
          ease: "power2.out",
          delay: 1.2 + i * 0.1,
          onUpdate: () => {
            el.textContent = fmt(counter.n);
          },
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, [isLoading, slides.length]);

  /* ---------- preview thumbnail wipes in whenever the slide changes ---------- */
  useEffect(() => {
    if (
      isLoading ||
      prefersReducedMotion() ||
      (activeIndex === 0 && firstRun.current)
    )
      return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-thumb]",
        { clipPath: "inset(0 0 0 100%)" },
        { clipPath: "inset(0 0 0 0%)", duration: 0.8, ease: "power3.out" },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [activeIndex, isLoading]);

  /* ---------- states ---------- */
  if (isLoading) {
    return (
      <div
        className="flex h-[100svh] w-full items-center justify-center"
        style={{ background: BONE }}
      >
        <div className="h-px w-40 overflow-hidden bg-[#07140F]/15">
          <div className="h-full w-1/3 animate-[hero-load_1.1s_ease-in-out_infinite] bg-[#1F4D36]" />
        </div>
        <style>{`@keyframes hero-load{0%{transform:translateX(-100%)}100%{transform:translateX(300%)}}`}</style>
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div
        className="flex h-[100svh] w-full items-center justify-center px-6 text-center text-[#07140F]/80"
        style={{ background: BONE }}
      >
        <p>We couldn’t load the banner right now. Please refresh the page.</p>
      </div>
    );
  }

  const pad = (n: number) => String(n).padStart(2, "0");
  const currentTitle = slides[textIndex]?.title ?? "";
  const nextSlide = slides[(activeIndex + 1) % slides.length];
  const goNext = () => swiperRef.current?.slideNext();

  const fillet: React.CSSProperties = {
    width: NOTCH,
    height: NOTCH,
    background: `radial-gradient(circle at 100% 0, transparent ${NOTCH}px, ${BONE} ${NOTCH + 0.5}px)`,
  };

  return (
    <section
      ref={rootRef}
      aria-label="Featured"
      className={`${display.className} h-[100svh] min-h-[660px] w-full p-2 sm:p-3 lg:p-4`}
      style={{ background: BONE }}
    >
      <style>{`
        @keyframes hero-push { from { transform: scale(1.02); } to { transform: scale(1.12); } }
        .hero-slide .hero-img { transform: scale(1.02); }
        .swiper-slide-active .hero-img { animation: hero-push ${AUTOPLAY_MS + 1500}ms linear forwards; }
        @media (prefers-reduced-motion: reduce) {
          .swiper-slide-active .hero-img { animation: none; }
        }
      `}</style>

      {/* The frame */}
      <div
        data-frame
        className="relative h-full w-full overflow-hidden rounded-[28px] bg-[#07140F] text-[#EEF2E6]"
      >
        {/* Image layer (swipeable) */}
        <Swiper
          className="!absolute inset-0 h-full w-full"
          modules={[EffectFade, Autoplay]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          speed={1200}
          rewind
          autoplay={{
            delay: AUTOPLAY_MS,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          onSwiper={(s) => (swiperRef.current = s)}
          onSlideChange={handleSlideChange}
          onAutoplayTimeLeft={(_s, _t, progress) => updateRing(1 - progress)}
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={slide.id} className="hero-slide">
              <Image
                src={slide.image_url || "/placeholder.svg"}
                alt={slide.title}
                fill
                priority={index === 0}
                quality={90}
                sizes="100vw"
                className="hero-img object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Subtle dark overlay for text readability */}
        <div className="absolute inset-0 z-10 bg-black/30" />
        {/* Tone: darker on the left where the headline sits, image stays open on the right */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#07140F]/80 via-[#07140F]/30 to-transparent lg:via-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#07140F]/70 via-transparent to-[#07140F]/25" />

        {/* Layout column: headline fills the space, stats dock at the bottom */}
        <div className="pointer-events-none relative z-10 flex h-full flex-col">
          <div className="flex flex-1 items-center px-6 pt-24 sm:px-10 lg:px-16">
            <div className="max-w-3xl">
              <h1
                ref={titleRef}
                aria-live="polite"
                className="text-[clamp(2.1rem,5.4vw,4rem)] font-bold leading-[1.04] tracking-[-0.03em] text-left"
              >
                {currentTitle.split(" ").map((word, i) => (
                  <span
                    key={`${textIndex}-${i}`}
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
              </h1>

              <div
                data-reveal
                className="pointer-events-auto mt-8 flex items-center gap-4"
              >
                <Link
                  href="/project"
                  className="group inline-flex items-center gap-3 rounded-full bg-[#EEF2E6] py-2 pl-6 pr-2 text-base font-medium text-[#07140F] transition-colors duration-300 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F2B84B]"
                >
                  Explore our projects
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
                </Link>

                {/* Mobile/tablet: compact next button (desktop has the preview card) */}
                <button
                  type="button"
                  onClick={goNext}
                  aria-label="Next slide"
                  className="lg:hidden rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#F2B84B]"
                >
                  <Ring />
                </button>
              </div>
            </div>
          </div>

          {/* Stats notch: solid panel carved into the corner, curved joins on desktop */}
          <div
            data-reveal
            className="pointer-events-auto relative grid grid-cols-2 bg-[#EEF2E6] text-[#07140F] lg:inline-grid lg:grid-cols-4 lg:self-start lg:rounded-tr-[28px]"
          >
            <span
              aria-hidden
              className="absolute bottom-full left-0 hidden lg:block"
              style={fillet}
            />
            <span
              aria-hidden
              className="absolute bottom-0 left-full hidden lg:block"
              style={fillet}
            />

            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                className={`px-5 py-5 lg:px-9 lg:py-7 ${i % 2 === 0 ? "border-r border-[#07140F]/10 lg:border-r-0" : ""} ${
                  i < 2 ? "border-b border-[#07140F]/10 lg:border-b-0" : ""
                } ${i > 0 ? "lg:border-l lg:border-[#07140F]/10" : ""}`}
              >
                <p
                  ref={(el) => {
                    statRefs.current[i] = el;
                  }}
                  className="text-3xl font-bold tabular-nums tracking-tight lg:text-[2.5rem] lg:leading-none"
                >
                  {stat.value === 0 ? "0" : `0${stat.suffix}`}
                </p>
                <p className="mt-2 flex items-center gap-2 text-sm text-[#07140F]/65 lg:text-base">
                  {stat.highlight && (
                    <span
                      aria-hidden
                      className="h-2 w-2 rounded-full bg-[#F2B84B]"
                    />
                  )}
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Next-up preview card (desktop) */}
        <button
          type="button"
          onClick={goNext}
          aria-label={`Next slide: ${nextSlide.title}`}
          className="group absolute bottom-6 right-6 z-20 hidden w-[300px] rounded-2xl border border-white/20 bg-white/10 p-3 text-left backdrop-blur-xl transition-colors hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2B84B] lg:block"
        >
          <div className="relative h-36 overflow-hidden rounded-xl">
            <div data-thumb className="absolute inset-0">
              <Image
                src={nextSlide.image_url || "/placeholder.svg"}
                alt=""
                fill
                sizes="300px"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between gap-3 pl-1">
            <div className="min-w-0">
              <p className="text-sm tabular-nums text-[#EEF2E6]/70">
                {pad(activeIndex + 1)} of {pad(slides.length)}
              </p>
              <p className="mt-0.5 line-clamp-2 text-base font-medium leading-snug">
                {nextSlide.title}
              </p>
            </div>
            <Ring />
          </div>
        </button>
      </div>
    </section>
  );
};

export default HeroBannerFrame;
