"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { FaPlay } from "react-icons/fa";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Bricolage_Grotesque } from "next/font/google";
import image2 from "../../public/watchourvedio.jpeg";
import VideoPlayer from "../Videoplayer";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const display = Bricolage_Grotesque({ subsets: ["latin"], display: "swap" });

/* Palette (same as the rest of the site)
   pine #07140F · moss #1F4D36 · bone #EEF2E6 · tag (amber) #F2B84B
   BONE is the page margin around the frame; keep it equal to the other files. */
const BONE = "#EEF2E6";
const VIDEO_SRC = "/videos/insurecow-no-govt-leader_1080.mp4";

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function VideoBanner() {
  const [isOpen, setIsOpen] = useState(false);
  const reduce = useReducedMotion();

  const rootRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  /* ---------- entrance (plays once): frame opens, play button pops ---------- */
  useIsoLayoutEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline({ scrollTrigger: { trigger: rootRef.current, start: "top 75%", once: true } })
        .fromTo(
          "[data-frame]",
          { clipPath: "inset(12% 14% 12% 14% round 56px)" },
          { clipPath: "inset(0% 0% 0% 0% round 28px)", duration: 1.3, ease: "expo.inOut" }
        )
        .from("[data-play]", { scale: 0.6, opacity: 0, duration: 0.8, ease: "back.out(1.6)" }, "-=0.5");
    }, rootRef);

    return () => ctx.revert();
  }, []);

  /* ---------- dialog behaviour: Escape, focus trap, scroll lock, focus return ---------- */
  useEffect(() => {
    if (!isOpen) return;

    const trigger = triggerRef.current;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, video[controls], [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      trigger?.focus();
    };
  }, [isOpen]);

  return (
    <section
      ref={rootRef}
      aria-label="Watch our video"
      className={`${display.className} p-2 sm:p-3 lg:p-4`}
      style={{ background: BONE }}
    >
      <h2 className="sr-only">Watch our video</h2>

      {/* ---------- Frame ---------- */}
      <div
        data-frame
        className="group relative flex h-[75svh] min-h-[480px] items-center justify-center overflow-hidden rounded-[28px] bg-[#07140F] lg:h-[85svh]"
      >
        <Image
          src={image2}
          alt=""
          fill
          sizes="100vw"
          placeholder="blur"
          className="object-cover object-top transition-transform duration-[1500ms] ease-out group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-[#07140F]/45" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#07140F]/60 via-transparent to-[#07140F]/30" />

        {/* ---------- Play button with a rotating label ring ---------- */}
        <button
          ref={triggerRef}
          data-play
          type="button"
          onClick={open}
          aria-haspopup="dialog"
          aria-label="Play video: Watch our video"
          className="group/play relative h-[190px] w-[190px] rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F2B84B] lg:h-[230px] lg:w-[230px]"
        >
          {/* glass disc */}
          <span aria-hidden className="absolute inset-0 rounded-full border border-white/20 bg-white/10 backdrop-blur-md" />

          {/* rotating text */}
          <svg
            aria-hidden
            viewBox="0 0 200 200"
            className="absolute inset-0 animate-[spin_28s_linear_infinite] text-[#EEF2E6] motion-reduce:animate-none"
          >
            <defs>
              <path id="ring-path" d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0" />
            </defs>
            <text fill="currentColor" fontSize="15" fontWeight="500" className={display.className}>
              <textPath href="#ring-path" textLength="498" lengthAdjust="spacing">
                {"Watch our video\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0Watch our video\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0"}
              </textPath>
            </text>
          </svg>

          {/* attention ring (stops with reduced motion) */}
          <span
            aria-hidden
            className="absolute inset-[52px] rounded-full border border-[#F2B84B] animate-[ping_2.6s_cubic-bezier(0,0,0.2,1)_infinite] motion-reduce:animate-none lg:inset-[62px]"
          />

          {/* play */}
          <span
            aria-hidden
            className="absolute inset-[52px] flex items-center justify-center rounded-full bg-[#F2B84B] text-[#07140F] transition-transform duration-300 group-hover/play:scale-110 lg:inset-[62px]"
          >
            <FaPlay className="ml-1 text-2xl lg:text-3xl" />
          </span>
        </button>
      </div>

      {/* ---------- Video dialog ---------- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Video player"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.3 }}
            onClick={close}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-[#07140F]/85 p-4 backdrop-blur-md sm:p-8"
          >
            <motion.div
              ref={dialogRef}
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: reduce ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl overflow-hidden rounded-[28px] border border-white/10 bg-black shadow-[0_30px_80px_rgba(0,0,0,0.5)]"
            >
              <div className="aspect-video w-full [&_video]:h-full [&_video]:w-full">
                <VideoPlayer videoSrc={VIDEO_SRC} />
              </div>

              <button
                ref={closeRef}
                type="button"
                onClick={close}
                aria-label="Close video"
                className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#EEF2E6] text-[#07140F] transition-colors duration-300 hover:bg-[#F2B84B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2B84B]"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}