"use client";

import React, { useEffect, useLayoutEffect, useRef } from "react";
import { Check, Crown, Zap, Rocket, Building2 } from "lucide-react";
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
   BONE is the section background and the colour of the carved CTA notch. */
const BONE = "#EEF2E6";
const NOTCH = 24;
const WHATSAPP_NUMBER = "8801999467873";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface SubscriptionPlan {
  name: string;
  price: string;
  description: string;
  icon: React.ReactNode;
  features: {
    included: string[];
    excluded: string[];
  };
  popular?: boolean;
}

const subscriptionPlans: SubscriptionPlan[] = [
  {
    name: "Starter",
    price: "99 tk",
    description: "Perfect for small farm owners",
    icon: <Zap className="h-5 w-5" aria-hidden />,
    features: {
      included: [
        "Livestock Inventory",
        "Basic Animal Registration",
        "Health Status Tracking",
        "Dashboard Overview",
        "5 Animals Limit",
        "Basic Support",
      ],
      excluded: [
        "Vaccination Tracking",
        "Breeding Management",
        "Production Recording",
        "Financial Transactions",
        "AI Muzzle Identification",
      ],
    },
  },
  {
    name: "Plus",
    price: "199 tk",
    description: "Ideal for growing farm owners",
    icon: <Rocket className="h-5 w-5" aria-hidden />,
    popular: true,
    features: {
      included: [
        "Everything in Starter",
        "Vaccination Scheduling",
        "Milk Production Tracking",
        "Weight Monitoring",
        "Feed Consumption Logging",
        "Vet Selection",
        "50 Animals Limit",
        "Priority Support",
      ],
      excluded: [
        "Breeding Management",
        "Financial Transactions",
        "AI Muzzle Identification",
        "Advanced Reports",
      ],
    },
  },
  {
    name: "Pro",
    price: "299 tk",
    description: "Complete solution for farm owners",
    icon: <Crown className="h-5 w-5" aria-hidden />,
    features: {
      included: [
        "Everything in Plus",
        "Breeding & Birth Tracking",
        "AI Records",
        "Financial Management",
        "Income & Expense Reports",
        "QR Code Generation",
        "Unlimited Animals",
        "24/7 Support",
      ],
      excluded: ["AI Muzzle Identification", "Custom Integrations"],
    },
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Tailored solutions for enterprise",
    icon: <Building2 className="h-5 w-5" aria-hidden />,
    features: {
      included: [
        "Everything in Pro",
        "AI-Powered Identification",
        "Muzzle Pattern Recognition",
        "Custom API Integrations",
        "White-label Solutions",
        "Dedicated Manager",
        "On-premise Deployment",
        "Advanced Analytics",
      ],
      excluded: [],
    },
  },
];

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Concave joins for the CTA notch in each card's bottom-right corner
const fillet: React.CSSProperties = {
  width: NOTCH,
  height: NOTCH,
  background: `radial-gradient(circle at 0 0, transparent ${NOTCH}px, ${BONE} ${NOTCH + 0.5}px)`,
};

const whatsappUrl = (planName: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hello, I'm interested in the ${planName} subscription plan. Can you provide more details?`,
  )}`;

export default function SubscriptionPlans() {
  const rootRef = useRef<HTMLElement>(null);

  /* One scroll moment: headline rises, then the cards unroll downward in turn (plays once) */
  useIsoLayoutEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 70%",
          once: true,
        },
      });

      tl.fromTo(
        "[data-word]",
        { yPercent: 115 },
        { yPercent: 0, duration: 0.9, ease: "expo.out", stagger: 0.06 },
      )
        .from(
          "[data-fade]",
          {
            y: 16,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.1,
          },
          "-=0.6",
        )
        .fromTo(
          "[data-plan]",
          { clipPath: "inset(0% 0% 100% 0% round 28px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 28px)",
            duration: 1.1,
            ease: "expo.inOut",
            stagger: 0.12,
          },
          "-=0.6",
        );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="subscription"
      ref={rootRef}
      aria-label="Pricing"
      className={`${display.className} px-5 py-20 text-[#07140F] md:px-10 lg:px-16 lg:py-28`}
      style={{ background: BONE }}
    >
      <div className="mx-auto max-w-[1450px]">
        {/* ---------- Header ---------- */}
        <div className="grid items-end gap-6 lg:grid-cols-[1fr_auto] lg:gap-16">
          <div>
            <div data-fade className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F2B84B] text-[#07140F]">
                <GiBullHorns className="text-xl" aria-hidden />
              </span>
              <span className="text-base font-medium text-[#1F4D36]">
                Pricing
              </span>
            </div>

            <h2 className="mt-6 max-w-3xl text-[clamp(2.25rem,4.6vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.03em] text-left">
              {"Simple, transparent pricing".split(" ").map((word, i) => (
                <span
                  key={i}
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
            </h2>
          </div>

          <p
            data-fade
            className="max-w-[38ch] text-lg leading-relaxed text-[#07140F]/70"
          >
            Pick the plan that fits your herd. Move up whenever your farm grows,
            with no hidden fees.
          </p>
        </div>

        {/* ---------- Plans ---------- */}
        <div className="mt-14 grid gap-4 md:grid-cols-2 xl:mt-20 xl:grid-cols-4 xl:gap-5">
          {subscriptionPlans.map((plan) => {
            const [amount, unit] = plan.price.split(" ");
            const isCustom = plan.price === "Custom";
            const pop = !!plan.popular;

            return (
              <article
                key={plan.name}
                data-plan
                className={`relative flex flex-col rounded-[28px] p-6 pb-28 xl:p-7 xl:pb-28 ${
                  pop
                    ? " bg-[#07140F] text-[#EEF2E6] xl:-my-4"
                    : " bg-[#F8FAF3]"
                }`}
              >
                {/* Name row */}
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                      pop
                        ? "bg-[#F2B84B] text-[#07140F]"
                        : "bg-[#1F4D36] text-[#EEF2E6]"
                    }`}
                  >
                    {plan.icon}
                  </span>
                  <h3 className="text-xl font-bold tracking-[-0.01em]">
                    {plan.name}
                  </h3>
                  {pop && (
                    <span className="ml-auto rounded-full bg-[#F2B84B] px-3 py-1 text-sm font-medium text-[#07140F]">
                      Most popular
                    </span>
                  )}
                </div>

                <p
                  className={`mt-4 text-[15px] ${pop ? "text-[#EEF2E6]/70" : "text-[#07140F]/65"}`}
                >
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mt-8">
                  <p className="flex items-baseline gap-1.5">
                    <span className="text-5xl font-bold leading-none tracking-[-0.03em]">
                      {amount}
                    </span>
                    {unit && (
                      <span className="text-xl font-medium opacity-70">
                        {unit}
                      </span>
                    )}
                  </p>
                  <p
                    className={`mt-2 text-sm ${pop ? "text-[#EEF2E6]/60" : "text-[#07140F]/55"}`}
                  >
                    {isCustom
                      ? "Talk to us for a quote"
                      : "per cattle, billed monthly"}
                  </p>
                </div>

                <div
                  className={`my-6 h-px ${pop ? "bg-white/15" : "bg-[#07140F]/10"}`}
                />

                {/* Included features */}
                <ul className="space-y-3">
                  {plan.features.included.map((feature, i) => (
                    <li key={feature} className="flex items-start gap-3">
                      <span
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                          pop
                            ? "bg-white/10 text-[#F2B84B]"
                            : "bg-[#1F4D36]/10 text-[#1F4D36]"
                        }`}
                      >
                        <Check
                          className="h-3 w-3"
                          strokeWidth={3}
                          aria-hidden
                        />
                      </span>
                      <span
                        className={`text-[15px] leading-snug ${i === 0 && feature.startsWith("Everything") ? "font-semibold" : ""} ${
                          pop ? "text-[#EEF2E6]/85" : "text-[#07140F]/75"
                        }`}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA notch: carved into the corner, same device as the rest of the site */}
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

                  <a
                    href={whatsappUrl(plan.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Get the ${plan.name} plan via WhatsApp`}
                    className={`group inline-flex items-center gap-3 rounded-full py-1.5 pl-5 pr-1.5 text-[15px] font-medium transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F2B84B] ${
                      pop
                        ? "bg-[#F2B84B] text-[#07140F] hover:bg-[#07140F] hover:text-[#EEF2E6]"
                        : "bg-[#07140F] text-[#EEF2E6] hover:bg-[#1F4D36]"
                    }`}
                  >
                    Get started
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-105 ${
                        pop
                          ? "bg-[#07140F] text-[#F2B84B]"
                          : "bg-[#F2B84B] text-[#07140F]"
                      }`}
                    >
                      <FaWhatsapp size={20} aria-hidden />
                    </span>
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
