import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FAQAccordion from "../components/FAQAccordion";
import { categoryMeta, categoryOrder } from "../data/categoryMeta";
import { useInsuranceData } from "../hooks/useInsuranceData.jsx";

export default function LearnPage() {
  const navigate = useNavigate();
  const { category = "" } = useParams();
  const activeCategory = categoryMeta[category] ? category : "health";
  const { faqs, isLoading, error } = useInsuranceData();
  const meta = categoryMeta[activeCategory];
  const categoryFaqs = useMemo(
    () => faqs.filter((item) => item.category === activeCategory),
    [activeCategory, faqs],
  );

  if (!meta) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-[var(--text-primary)]">
        Unknown category.
      </div>
    );
  }

  const Icon = meta.icon;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <section className="rounded-[36px] border border-white/10 bg-[rgba(19,19,26,0.92)] p-8">
        <div
          className="inline-flex rounded-3xl p-4"
          style={{ backgroundColor: `${meta.accent}22`, color: meta.accent }}
        >
          <Icon size={28} />
        </div>
        <h1 className="mt-5 font-display text-4xl text-[var(--text-primary)]">
          Learn Insurance the easy way
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--text-secondary)]">
          Pick an insurance type and scan the important questions first. The
          FAQ experience stays clean and self-serve, without sidebars, filler,
          or detours.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          {categoryOrder.map((slug) => (
            <button
              key={slug}
              type="button"
              onClick={() => navigate(`/learn/${slug}`)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                activeCategory === slug
                  ? "border-white bg-white text-black"
                  : "border-white/10 text-[var(--text-secondary)] hover:text-white"
              }`}
            >
              {categoryMeta[slug].label}
            </button>
          ))}
        </div>
      </section>

      <div className="mt-8">
        {isLoading ? (
          <div className="rounded-[32px] border border-white/10 bg-[rgba(19,19,26,0.92)] p-8 text-[var(--text-secondary)]">
            Loading FAQs...
          </div>
        ) : error ? (
          <div className="rounded-[32px] border border-white/10 bg-[rgba(19,19,26,0.92)] p-8 text-[var(--text-secondary)]">
            {error}
          </div>
        ) : (
          <FAQAccordion category={activeCategory} faqs={categoryFaqs} />
        )}
      </div>
    </div>
  );
}
