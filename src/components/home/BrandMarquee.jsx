export default function BrandMarquee() {
  const phrase = "ZELMIOR — THE ART OF TIME —";
  const repeated = Array(8).fill(phrase).join(" ");

  return (
    <section
      className="py-6 border-y border-white/[0.06] overflow-hidden bg-surface"
      aria-hidden="true"
    >
      <div className="marquee-track">
        <span className="font-inter text-[11px] tracking-[0.4em] uppercase text-muted/50 whitespace-nowrap px-8">
          {repeated}
        </span>
        <span className="font-inter text-[11px] tracking-[0.4em] uppercase text-muted/50 whitespace-nowrap px-8">
          {repeated}
        </span>
      </div>
    </section>
  );
}
