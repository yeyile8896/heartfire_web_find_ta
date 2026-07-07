import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type CTAButtonProps = {
  children: ReactNode;
  href: string;
  variant?: "primary" | "secondary" | "quiet";
  size?: "md" | "sm";
};

export function CTAButton({
  children,
  href,
  variant = "primary",
  size = "md"
}: CTAButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition duration-300";
  const sizes = {
    md: "min-h-12 px-6 py-3 text-sm sm:text-base",
    sm: "min-h-11 px-5 py-2.5 text-sm"
  };
  const variants = {
    primary:
      "bg-gradient-to-r from-[#8f2d12] via-[#b33a16] to-[#6f2311] text-white shadow-glow hover:-translate-y-0.5 hover:brightness-110",
    secondary:
      "border border-orange-200 bg-white/90 text-[#8a3a18] shadow-sm hover:-translate-y-0.5 hover:border-orange-300 hover:bg-[#fbf6ef]",
    quiet:
      "text-[#8a3a18] hover:-translate-y-0.5 hover:bg-white/65"
  };

  return (
    <Link className={`${base} ${sizes[size]} ${variants[variant]}`} href={href}>
      {children}
      <ArrowUpRight className="h-4 w-4" />
    </Link>
  );
}
