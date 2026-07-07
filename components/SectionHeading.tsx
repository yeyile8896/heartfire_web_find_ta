type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left"
}: SectionHeadingProps) {
  const alignment = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <div className={`mb-8 max-w-3xl ${alignment} sm:mb-10`}>
      <p className="inline-flex items-center gap-2 text-sm font-semibold text-[#9a4a1f]">
        <span className="h-px w-8 bg-orange-300" aria-hidden="true" />
        {eyebrow}
      </p>
      <h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-slate-950 sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-8 text-[color:var(--text-soft)] sm:text-lg">{description}</p>
    </div>
  );
}
