import { ExternalLink } from "lucide-react";
import { calculatorCards, categoryMeta } from "../data/categoryMeta";

export default function CalculatorPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <section className="rounded-[36px] border border-white/10 bg-[rgba(19,19,26,0.92)] p-8">
        <p className="text-sm uppercase tracking-[0.28em] text-[var(--text-secondary)]">
          Redirect hub
        </p>
        <h1 className="mt-3 font-display text-4xl text-[var(--text-primary)]">
          Use the right calculator without hunting for it
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--text-secondary)]">
          This MVP keeps the guidance layer on PolEasyBazaar, then hands you off
          to the relevant PolicyBazaar calculator or flow when you want deeper
          inputs and pricing.
        </p>
      </section>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {calculatorCards.map((card) => {
          const meta = categoryMeta[card.category];
          const Icon = card.icon;
          return (
            <article
              key={card.id}
              className="rounded-[30px] border border-white/10 bg-[rgba(19,19,26,0.92)] p-6"
            >
              <div
                className="inline-flex rounded-2xl p-3"
                style={{ backgroundColor: `${meta.accent}22`, color: meta.accent }}
              >
                <Icon size={22} />
              </div>
              <h2 className="mt-5 font-display text-2xl text-[var(--text-primary)]">
                {card.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
                {card.description}
              </p>
              <a
                href={card.url}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-medium text-black transition hover:opacity-90"
              >
                Open on PolicyBazaar
                <ExternalLink size={16} />
              </a>
            </article>
          );
        })}
      </div>
    </div>
  );
}
