import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import { categoryMeta } from "../data/categoryMeta";

export default function FAQAccordion({ category, faqs }) {
  const [activeQuestion, setActiveQuestion] = useState("");
  const [query, setQuery] = useState("");
  const accent = categoryMeta[category]?.accent ?? "var(--accent-car)";

  const filteredFaqs = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return faqs;
    }

    return faqs.filter((item) => {
      const haystack = `${item.question} ${item.answer}`.toLowerCase();
      return haystack.includes(normalized);
    });
  }, [faqs, query]);

  return (
    <section className="rounded-[32px] border border-white/10 bg-[rgba(19,19,26,0.92)] p-6 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-[var(--text-secondary)]">
            Learn fast
          </p>
          <h2 className="mt-2 font-display text-3xl text-[var(--text-primary)]">
            Insurance, translated into plain language
          </h2>
        </div>

        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Filter FAQs by keyword"
          className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-secondary)] md:max-w-xs"
        />
      </div>

      <div className="mt-6 space-y-4">
        {filteredFaqs.length ? (
          filteredFaqs.map((item) => {
            const isOpen = activeQuestion === item.question;
            return (
              <div
                key={item.id}
                className="overflow-hidden rounded-3xl border border-white/8 bg-black/20"
                style={{ borderLeft: `3px solid ${accent}` }}
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  onClick={() =>
                    setActiveQuestion((current) =>
                      current === item.question ? "" : item.question,
                    )
                  }
                >
                  <span className="text-base font-medium text-[var(--text-primary)]">
                    {item.question}
                  </span>
                  <motion.span animate={{ rotate: isOpen ? 180 : 0 }}>
                    <ChevronDown size={18} className="text-[var(--text-secondary)]" />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-sm leading-7 text-[var(--text-secondary)]">
                        {item.answer}
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })
        ) : (
          <div className="rounded-3xl border border-dashed border-white/10 px-5 py-8 text-sm text-[var(--text-secondary)]">
            No FAQ matched that keyword yet. Try a broader phrase like
            "premium", "coverage", or "renewal".
          </div>
        )}
      </div>
    </section>
  );
}
