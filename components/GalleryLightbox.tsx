"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";

/* Pine #07140F · bone #EEF2E6 · amber #F2B84B (same palette as the rest of the site) */

export interface LightboxItem {
  id: number | string;
  title: string;
  image_url: string;
  description?: string;
  tag?: string; // small label, e.g. the category
}

interface Props {
  items: LightboxItem[];
  /** Index of the open photo, or null when closed */
  index: number | null;
  onClose: () => void;
  onChange: (index: number) => void;
}

const Arrow = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path d="M3 8h10m0 0L9 4m4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const roundBtn =
  "flex h-11 w-11 items-center justify-center rounded-full border border-white/25 transition-colors duration-300 hover:bg-[#F2B84B] hover:text-[#07140F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2B84B]";

const GalleryLightbox: React.FC<Props> = ({ items, index, onClose, onChange }) => {
  const reduce = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const isOpen = index !== null;
  const count = items.length;

  /* Escape, arrow keys, focus trap, scroll lock, and focus returns to the photo you opened */
  useEffect(() => {
    if (!isOpen) return;

    const trigger = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") onChange(((index as number) + 1) % count);
      else if (e.key === "ArrowLeft") onChange(((index as number) - 1 + count) % count);
      else if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>("button");
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      trigger?.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, index, count]);

  const current = index !== null ? items[index] : null;

  return (
    <AnimatePresence>
      {current && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.3 }}
          onClick={onClose}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-[#07140F]/90 p-4 backdrop-blur-md sm:p-8"
        >
          <motion.div
            ref={dialogRef}
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: reduce ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl text-[#EEF2E6]"
          >
            <div className="relative h-[62svh] w-full overflow-hidden rounded-[28px] bg-black/40">
              <Image
                key={current.id}
                src={current.image_url || "/placeholder.svg"}
                alt={current.title}
                fill
                sizes="100vw"
                unoptimized
                className="object-contain"
              />
            </div>

            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close photo viewer"
              className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#EEF2E6] text-[#07140F] transition-colors duration-300 hover:bg-[#F2B84B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2B84B]"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>

            <div className="mt-5 flex items-start justify-between gap-6">
              <div className="min-w-0">
                {current.tag && (
                  <span className="mb-3 inline-block rounded-full bg-[#F2B84B] px-3.5 py-1 text-sm font-medium text-[#07140F]">
                    {current.tag}
                  </span>
                )}
                <h3 className="text-xl font-bold lg:text-2xl">{current.title}</h3>
                {current.description && (
                  <p className="mt-2 max-w-[60ch] text-base text-[#EEF2E6]/70">{current.description}</p>
                )}
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <span className="hidden text-sm tabular-nums text-[#EEF2E6]/60 sm:block" aria-live="polite">
                  {(index as number) + 1} of {count}
                </span>
                <button
                  type="button"
                  onClick={() => onChange(((index as number) - 1 + count) % count)}
                  aria-label="Previous photo"
                  className={`${roundBtn} rotate-180`}
                >
                  <Arrow />
                </button>
                <button
                  type="button"
                  onClick={() => onChange(((index as number) + 1) % count)}
                  aria-label="Next photo"
                  className={roundBtn}
                >
                  <Arrow />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GalleryLightbox;