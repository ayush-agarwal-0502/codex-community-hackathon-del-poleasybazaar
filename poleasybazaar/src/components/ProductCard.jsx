import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { categoryMeta } from "../data/categoryMeta";

function splitBenefits(keyBenefits) {
  return (keyBenefits || "")
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function ProductCard({ product }) {
  const [expanded, setExpanded] = useState(false);
  const benefits = splitBenefits(product.key_benefits);
  const visibleBenefits = expanded ? benefits : benefits.slice(0, 3);
  const meta = categoryMeta[product.category];

  return (
    <article className="group rounded-[28px] border border-white/10 bg-[rgba(19,19,26,0.92)] p-6 shadow-lg shadow-black/20">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span
            className="inline-flex rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.24em]"
            style={{
              backgroundColor: `${meta?.accent ?? "var(--accent-car)"}22`,
              color: meta?.accent ?? "var(--accent-car)",
            }}
          >
            {meta?.label ?? product.category}
          </span>
          <p className="mt-4 text-xs uppercase tracking-[0.22em] text-[var(--text-secondary)]">
            {product.insurer_name}
          </p>
          <h3 className="mt-4 font-display text-2xl text-[var(--text-primary)]">
            {product.plan_name}
          </h3>
        </div>

        {product.price_range ? (
          <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-right">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-secondary)]">
              Starting
            </p>
            <p className="text-sm font-medium text-[var(--text-primary)]">
              {product.price_range}
            </p>
          </div>
        ) : null}
      </div>

      <ul className="mt-5 space-y-2 text-sm text-[var(--text-primary)]">
        {visibleBenefits.map((benefit) => (
          <li key={benefit} className="flex items-start gap-2">
            <span
              className="mt-1.5 h-2 w-2 rounded-full"
              style={{ backgroundColor: meta?.accent ?? "var(--accent-car)" }}
            />
            <span>{benefit}</span>
          </li>
        ))}
      </ul>

      {benefits.length > 3 ? (
        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          className="mt-4 text-sm font-medium text-white underline decoration-white/30 underline-offset-4"
        >
          {expanded ? "See less" : "See more"}
        </button>
      ) : null}

      <a
        href={product.pb_redirect_url}
        rel="noreferrer"
        className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white px-4 py-3 text-sm font-medium text-black transition hover:scale-[1.01]"
      >
        View on PolicyBazaar
        <ExternalLink size={16} />
      </a>
    </article>
  );
}
