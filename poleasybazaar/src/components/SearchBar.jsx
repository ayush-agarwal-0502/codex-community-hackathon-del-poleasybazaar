import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { categoryMeta } from "../data/categoryMeta";
import { useInsuranceData } from "../hooks/useInsuranceData.jsx";

export default function SearchBar({
  value = "",
  onSubmit,
  onSelectResult,
  placeholder = "Search insurance plans, insurers, or benefits",
  compact = false,
}) {
  const { searchProducts } = useInsuranceData();
  const [query, setQuery] = useState(value);
  const [debouncedQuery, setDebouncedQuery] = useState(value);
  const deferredQuery = useDeferredValue(debouncedQuery);

  useEffect(() => {
    setQuery(value);
    setDebouncedQuery(value);
  }, [value]);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query), 300);
    return () => window.clearTimeout(timer);
  }, [query]);

  const results = useMemo(() => {
    if (!deferredQuery.trim()) {
      return [];
    }
    return searchProducts(deferredQuery, "all", 5);
  }, [deferredQuery, searchProducts]);

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit?.(query.trim());
  }

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <Search
          size={18}
          className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 ${
            compact ? "text-white/55" : "text-white/70"
          }`}
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-full border border-white/10 bg-[rgba(19,19,26,0.9)] pl-12 pr-4 text-[var(--text-primary)] outline-none placeholder:text-[var(--text-secondary)] ${
            compact ? "py-3 text-sm" : "py-5 text-base shadow-2xl shadow-black/20"
          }`}
        />
      </form>

      {results.length ? (
        <div className="absolute left-0 right-0 top-[calc(100%+12px)] z-30 overflow-hidden rounded-[28px] border border-white/10 bg-[rgba(19,19,26,0.98)] p-2 shadow-2xl shadow-black/40">
          {results.map((item) => {
            const meta = categoryMeta[item.category];
            return (
              <button
                key={item.id}
                type="button"
                className="flex w-full items-start gap-3 rounded-3xl px-4 py-3 text-left transition hover:bg-white/5"
                onClick={() => onSelectResult?.(item, query.trim())}
              >
                <span
                  className="mt-1 inline-flex rounded-full px-2 py-1 text-[10px] font-medium uppercase tracking-[0.22em]"
                  style={{
                    backgroundColor: `${meta?.accent ?? "var(--accent-car)"}22`,
                    color: meta?.accent ?? "var(--accent-car)",
                  }}
                >
                  {meta?.label ?? item.category}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[10px] uppercase tracking-[0.2em] text-[var(--text-secondary)]">
                    {item.insurer_name}
                  </span>
                  <span className="block truncate text-sm font-medium text-[var(--text-primary)]">
                    {item.plan_name}
                  </span>
                  <span className="mt-1 block truncate text-xs text-[var(--text-secondary)]">
                    {(item.key_benefits || "")
                      .split("|")
                      .map((entry) => entry.trim())
                      .filter(Boolean)
                      .slice(0, 2)
                      .join(" • ")}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
