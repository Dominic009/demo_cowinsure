"use client";

import type React from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { Mail, Phone } from "lucide-react";
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
   BONE is the section background AND the colour of the carved submit notch. */
const BONE = "#EEF2E6";
const NOTCH = 24;
const EMAIL = "info@insurecow.com";
const PHONE_DISPLAY = "+8801999467873";
const WHATSAPP_URL = "https://wa.me/8801999467873";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Concave joins for the notch in the form card's bottom-right corner
const fillet: React.CSSProperties = {
  width: NOTCH,
  height: NOTCH,
  background: `radial-gradient(circle at 0 0, transparent ${NOTCH}px, ${BONE} ${NOTCH + 0.5}px)`,
};

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  description: string;
};

const EMPTY: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  description: "",
};

const getErrors = (f: FormData): Record<keyof FormData, string> => ({
  firstName: f.firstName.trim() ? "" : "Enter your first name.",
  lastName: f.lastName.trim() ? "" : "Enter your last name.",
  email: /^\S+@\S+\.\S+$/.test(f.email) ? "" : "Enter a valid email address.",
  phone: /^01\d{9}$/.test(f.phone)
    ? ""
    : "Enter an 11-digit number starting with 01.",
  description: f.description.trim() ? "" : "Write a short message.",
});

const inputBase =
  "block w-full rounded-2xl border bg-white/[0.06] px-5 text-base text-[#EEF2E6] placeholder:text-[#EEF2E6]/35 transition-colors duration-300 hover:border-white/30 focus:border-[#F2B84B] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2B84B]/40";

interface FieldProps {
  id: keyof FormData;
  label: string;
  value: string;
  error: string;
  hint?: string;
  textarea?: boolean;
  wide?: boolean;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onBlur: () => void;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

const Field = ({
  id,
  label,
  value,
  error,
  hint,
  textarea,
  wide,
  onChange,
  onBlur,
  inputProps,
}: FieldProps) => {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  const cls = `${inputBase} ${error ? "border-[#FF8A7A]" : "border-white/15"}`;
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-[#EEF2E6]/80 text-left"
      >
        {label}
      </label>
      {textarea ? (
        <textarea
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          rows={5}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={`${cls} min-h-[150px] resize-y py-4`}
        />
      ) : (
        <input
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={`${cls} h-14`}
          {...inputProps}
        />
      )}
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-sm text-[#FFB4A8]">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="mt-2 text-sm text-[#EEF2E6]/45">
            {hint}
          </p>
        )
      )}
    </div>
  );
};

const ContactUs: React.FC = () => {
  const [form, setForm] = useState<FormData>(EMPTY);
  const [touched, setTouched] = useState<
    Partial<Record<keyof FormData, boolean>>
  >({});
  const [attempted, setAttempted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{
    kind: "success" | "error";
    text: string;
  } | null>(null);

  const rootRef = useRef<HTMLElement>(null);
  const errors = getErrors(form);
  const show = (k: keyof FormData) =>
    touched[k] || attempted ? errors[k] : "";

  /* ---------- one scroll moment (plays once) ---------- */
  useIsoLayoutEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 70%",
            once: true,
          },
        })
        .from("[data-fade]", {
          y: 16,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.1,
        })
        .fromTo(
          "[data-word]",
          { yPercent: 115 },
          { yPercent: 0, duration: 0.9, ease: "expo.out", stagger: 0.06 },
          "-=0.5",
        )
        .fromTo(
          "[data-card]",
          { clipPath: "inset(0% 0% 0% 100% round 28px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 28px)",
            duration: 1.2,
            ease: "expo.inOut",
          },
          "-=0.9",
        )
        .from(
          "[data-field]",
          {
            y: 14,
            opacity: 0,
            duration: 0.6,
            ease: "power3.out",
            stagger: 0.07,
          },
          "-=0.5",
        );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setStatus(null);
    // Phone: digits only, max 11 (same rule as before)
    if (name === "phone" && !(/^[0-9]*$/.test(value) && value.length <= 11))
      return;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const blur = (k: keyof FormData) => () =>
    setTouched((t) => ({ ...t, [k]: true }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAttempted(true);

    const firstInvalid = (Object.keys(errors) as (keyof FormData)[]).find(
      (k) => errors[k],
    );
    if (firstInvalid) {
      document.getElementById(firstInvalid)?.focus();
      return;
    }

    setIsSubmitting(true);
    setStatus(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/contact-us/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: `${form.firstName} ${form.lastName}`,
            email: form.email,
            phone: form.phone,
            description: form.description,
          }),
        },
      );

      if (response.ok) {
        setStatus({
          kind: "success",
          text: "Your message has been sent successfully.",
        });
        setForm(EMPTY);
        setTouched({});
        setAttempted(false);
      } else {
        setStatus({
          kind: "error",
          text: "Failed to send your message. Please try again later.",
        });
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      setStatus({
        kind: "error",
        text: "Something went wrong. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const channels = [
    {
      icon: <Mail className="h-5 w-5" aria-hidden />,
      label: "Email",
      value: EMAIL,
      href: `mailto:${EMAIL}`,
    },
    {
      icon: <Phone className="h-5 w-5" aria-hidden />,
      label: "Helpline",
      value: PHONE_DISPLAY,
      href: `tel:${PHONE_DISPLAY}`,
    },
    {
      icon: <FaWhatsapp className="h-5 w-5" aria-hidden />,
      label: "WhatsApp",
      value: "Chat with us",
      href: WHATSAPP_URL,
      external: true,
    },
  ];

  return (
    <section
      ref={rootRef}
      id="contact"
      aria-label="Contact us"
      className={`${display.className} px-5 py-20 text-[#07140F] md:px-10 lg:px-16 lg:py-28`}
      style={{ background: BONE }}
    >
      <div className="mx-auto grid max-w-[1450px] gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        {/* ---------- Left: headline + direct channels ---------- */}
        <div>
          <div data-fade className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F2B84B] text-[#07140F]">
              <GiBullHorns className="text-xl" aria-hidden />
            </span>
            <span className="text-base font-medium text-[#1F4D36]">
              Get in touch
            </span>
          </div>

          <h2 className="mt-6 text-[clamp(2.25rem,4.6vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.03em] text-left">
            {"Contact us".split(" ").map((word, i) => (
              <span
                key={i}
                className="mr-[0.22em] inline-block overflow-hidden pb-[0.12em] align-bottom"
              >
                <span data-word className="inline-block will-change-transform">
                  {word}
                </span>
              </span>
            ))}
          </h2>

          <p
            data-fade
            className="mt-6 max-w-[34ch] text-lg leading-snug text-[#07140F]/70 text-left"
          >
            Send us a message, or reach us directly.
          </p>

          <ul data-fade className="mt-10 border-b border-[#07140F]/10">
            {channels.map((c) => (
              <li key={c.label} className="border-t border-[#07140F]/10">
                <Link
                  href={c.href}
                  target={c.external ? "_blank" : undefined}
                  rel={c.external ? "noopener noreferrer" : undefined}
                  className="group flex items-center gap-4 py-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#1F4D36]"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1F4D36] text-[#EEF2E6] transition-colors duration-300 group-hover:bg-[#F2B84B] group-hover:text-[#07140F]">
                    {c.icon}
                  </span>
                  <span>
                    <span className="block text-sm text-[#07140F]/55 text-left">
                      {c.label}
                    </span>
                    <span className="block text-lg font-medium">{c.value}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ---------- Right: the form ---------- */}
        <form
          data-card
          onSubmit={handleSubmit}
          noValidate
          className="relative rounded-[28px] bg-[#07140F] p-6 pb-28 text-[#EEF2E6] sm:p-8 sm:pb-28 lg:p-10 lg:pb-28"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div data-field>
              <Field
                id="firstName"
                label="First name"
                value={form.firstName}
                error={show("firstName")}
                onChange={handleChange}
                onBlur={blur("firstName")}
                inputProps={{
                  type: "text",
                  autoComplete: "given-name",
                  required: true,
                }}
              />
            </div>
            <div data-field>
              <Field
                id="lastName"
                label="Last name"
                value={form.lastName}
                error={show("lastName")}
                onChange={handleChange}
                onBlur={blur("lastName")}
                inputProps={{
                  type: "text",
                  autoComplete: "family-name",
                  required: true,
                }}
              />
            </div>
            <div data-field>
              <Field
                id="email"
                label="Email address"
                value={form.email}
                error={show("email")}
                onChange={handleChange}
                onBlur={blur("email")}
                inputProps={{
                  type: "email",
                  autoComplete: "email",
                  required: true,
                }}
              />
            </div>
            <div data-field>
              <Field
                id="phone"
                label="Mobile number"
                value={form.phone}
                error={show("phone")}
                hint="Example: 01XXXXXXXXX"
                onChange={handleChange}
                onBlur={blur("phone")}
                inputProps={{
                  type: "tel",
                  inputMode: "numeric",
                  autoComplete: "tel",
                  maxLength: 11,
                  required: true,
                }}
              />
            </div>
            <div data-field className="sm:col-span-2">
              <Field
                id="description"
                label="Message"
                value={form.description}
                error={show("description")}
                textarea
                wide
                onChange={handleChange}
                onBlur={blur("description")}
              />
            </div>
          </div>

          {/* Live region: always rendered so announcements are read out */}
          <p
            role="status"
            aria-live="polite"
            className={`mt-5 min-h-[1.5rem] text-base ${
              status?.kind === "error" ? "text-[#FFB4A8]" : "text-[#F2B84B]"
            }`}
          >
            {status?.text}
          </p>

          {/* Submit lives in the carved notch, like every other CTA on the site */}
          <div
            className="absolute bottom-0 right-0 rounded-tl-[24px] p-3"
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

            <button
              type="submit"
              disabled={isSubmitting}
              className="group flex items-center rounded-full bg-[#07140F] py-1.5 pl-6 pr-1.5 text-base font-medium text-[#EEF2E6] transition-colors duration-300 hover:bg-[#1F4D36] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F2B84B] disabled:opacity-80"
            >
              {isSubmitting ? "Sending…" : "Send message"}
              <span className="ml-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#F2B84B] text-[#07140F]">
                {isSubmitting ? (
                  <span
                    aria-hidden
                    className="h-5 w-5 animate-spin rounded-full border-2 border-[#07140F] border-t-transparent motion-reduce:animate-none"
                  />
                ) : (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden
                    className="transition-transform duration-300 group-hover:translate-x-0.5"
                  >
                    <path
                      d="M3 8h10m0 0L9 4m4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ContactUs;
