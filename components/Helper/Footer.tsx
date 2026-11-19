import React from "react";
import Link from "next/link";
import { FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { GiBullHorns } from "react-icons/gi";
import { Bricolage_Grotesque } from "next/font/google";

const display = Bricolage_Grotesque({ subsets: ["latin"], display: "swap" });

/* Palette (same as the rest of the site)
   pine #07140F · moss #1F4D36 · bone #EEF2E6 · tag (amber) #F2B84B
   BONE is the page margin around the panel; keep it equal to the other files. */
const BONE = "#EEF2E6";
const PINE = "#07140F";

const COMPANY_LINKS = [
  { label: "Services", href: "/service" },
  { label: "Impact", href: "/impact" },
  { label: "About us", href: "/about_us" },
];

const SOCIALS = [
  {
    label: "InsureCow on LinkedIn",
    href: "https://www.linkedin.com/company/insurecow/",
    icon: <FaLinkedinIn size={18} aria-hidden />,
  },
  {
    label: "InsureCow on Facebook",
    href: "https://www.facebook.com/share/1P4UStavgY/",
    icon: <FaFacebookF size={18} aria-hidden />,
  },
];

const linkClass =
  "text-base text-[#EEF2E6]/70 transition-colors duration-300 hover:text-[#F2B84B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F2B84B]";

const Footer = () => {
  return (
    <footer
      className={`${display.className}`}
      style={{ background: BONE }}
    >
      <div
        className="relative overflow-hidden rounded-t-[28px] px-5 pt-16 text-[#EEF2E6] md:px-10 lg:px-16 lg:pt-24"
        style={{ background: PINE }}
      >
        <div className="relative z-10 mx-auto max-w-[1450px]">
          <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-16">
            {/* ---------- Brand + offices ---------- */}
            <div>
              <Link
                href="/"
                className="inline-flex items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F2B84B]"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F2B84B] text-[#07140F]">
                  <GiBullHorns className="text-xl" aria-hidden />
                </span>
                <span className="text-2xl font-bold tracking-[-0.02em]">
                  InsureCow
                </span>
              </Link>

              <address className="mt-8 space-y-6 not-italic">
                <div>
                  <p className="text-sm text-[#EEF2E6]/50">Bangladesh office</p>
                  <p className="mt-1 max-w-[34ch] text-base leading-relaxed text-[#EEF2E6]/80">
                    House 117, Road 5, Block B, Niketon, Dhaka, Bangladesh
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[#EEF2E6]/50">Singapore office</p>
                  <p className="mt-1 max-w-[34ch] text-base leading-relaxed text-[#EEF2E6]/80">
                    192 Waterloo St. #05-03 Skyline, Singapore 187966
                  </p>
                </div>
              </address>
            </div>

            {/* ---------- Company ---------- */}
            <nav aria-label="Company">
              <h3 className="text-sm text-[#EEF2E6]/50">Company</h3>
              <ul className="mt-5 space-y-3">
                {COMPANY_LINKS.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className={linkClass}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* ---------- Contact ---------- */}
            <div>
              <h3 className="text-sm text-[#EEF2E6]/50">Contact</h3>
              <ul className="mt-5 space-y-3">
                <li>
                  <a href="mailto:info@insurecow.com" className={linkClass}>
                    info@insurecow.com
                  </a>
                </li>
                <li>
                  <a href="tel:+8801999467873" className={linkClass}>
                    +8801999INSURE
                  </a>
                </li>
                <li className="pt-2">
                  <p className="text-sm text-[#EEF2E6]/50">Helpline</p>
                  <a
                    href="tel:+8801999467873"
                    className={`${linkClass} mt-1 inline-block`}
                  >
                    +8801999467873
                  </a>
                </li>
              </ul>
            </div>

            {/* ---------- Social ---------- */}
            <div>
              <h3 className="text-sm text-[#EEF2E6]/50">Follow us</h3>
              <ul className="mt-5 flex gap-3">
                {SOCIALS.map((s) => (
                  <li key={s.href}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 text-[#EEF2E6] transition-colors duration-300 hover:border-[#F2B84B] hover:bg-[#F2B84B] hover:text-[#07140F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F2B84B]"
                    >
                      {s.icon}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ---------- Legal row ---------- */}
          <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-[#EEF2E6]/55 sm:flex-row sm:items-center sm:justify-between lg:mt-20">
            <p>
              Copyright © {new Date().getFullYear()} InsureCow. All rights
              reserved.
            </p>
            <ul className="flex gap-6">
              <li>
                <a
                  href="#"
                  className="transition-colors duration-300 hover:text-[#F2B84B]"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="transition-colors duration-300 hover:text-[#F2B84B]"
                >
                  Terms of Use
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Oversized wordmark, decorative, cropped by the panel edge */}
        <p
          aria-hidden
          className="pointer-events-none mt-6 select-none whitespace-nowrap text-center text-[clamp(4.5rem,19vw,18rem)] font-bold leading-[0.8] tracking-[-0.05em] text-[#EEF2E6]/[0.07] translate-y-[12%]"
        >
          InsureCow
        </p>
      </div>
    </footer>
  );
};

export default Footer;
