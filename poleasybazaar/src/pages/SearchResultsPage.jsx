import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { categoryMeta, categoryOrder } from "../data/categoryMeta";
import { useInsuranceData } from "../hooks/useInsuranceData.jsx";

export default function SearchResultsPage() {
  const [params] = useSearchParams();
  const query = params.get("q") || "";
  const [activeCategory, setActiveCategory] = useState("health");
  const { products, searchProducts, isLoading, error } = useInsuranceData();

  const results = useMemo(
    () => searchProducts(query, activeCategory),
    [query, activeCategory, searchProducts],
  );
  const isBrowseMode = !query.trim();
  const browseProducts = useMemo(
    () => products.filter((item) => item.category === activeCategory),
    [activeCategory, products],
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <section className="rounded-[36px] border border-white/10 bg-[rgba(19,19,26,0.92)] p-8">
        <p className="text-sm uppercase tracking-[0.28em] text-[var(--text-secondary)]">
          {isBrowseMode ? "Browse products" : "Search results"}
        </p>
        <h1 className="mt-3 font-display text-4xl text-[var(--text-primary)]">
          {isBrowseMode
            ? "Pick a category, then browse products"
            : `Showing results for: ${query}`}
        </h1>
        <div className="mt-6 flex flex-wrap gap-3">
          {isBrowseMode ? (
            <>
              {categoryOrder.map((slug) => (
                <button
                  key={slug}
                  type="button"
                  onClick={() => setActiveCategory(slug)}
                  className={`rounded-full border px-4 py-2 text-sm ${
                    activeCategory === slug
                      ? "border-white bg-white text-black"
                      : "border-white/10 text-[var(--text-secondary)]"
                  }`}
                >
                  {categoryMeta[slug].label}
                </button>
              ))}
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setActiveCategory("all")}
                className={`rounded-full border px-4 py-2 text-sm ${
                  activeCategory === "all"
                    ? "border-white bg-white text-black"
                    : "border-white/10 text-[var(--text-secondary)]"
                }`}
              >
                All
              </button>
              {categoryOrder.map((slug) => (
                <button
                  key={slug}
                  type="button"
                  onClick={() => setActiveCategory(slug)}
                  className={`rounded-full border px-4 py-2 text-sm ${
                    activeCategory === slug
                      ? "border-white bg-white text-black"
                      : "border-white/10 text-[var(--text-secondary)]"
                  }`}
                >
                  {categoryMeta[slug].label}
                </button>
              ))}
            </>
          )}
        </div>
      </section>

      <div className="mt-8">
        {isLoading ? (
          <div className="rounded-[30px] border border-white/10 bg-[rgba(19,19,26,0.92)] p-8 text-[var(--text-secondary)]">
            Loading search results...
          </div>
        ) : error ? (
          <div className="rounded-[30px] border border-white/10 bg-[rgba(19,19,26,0.92)] p-8 text-[var(--text-secondary)]">
            {error}
          </div>
        ) : isBrowseMode ? (
          <div>
            <div className="mb-4">
              <p className="text-sm uppercase tracking-[0.24em] text-[var(--text-secondary)]">
                {categoryMeta[activeCategory].label}
              </p>
              <h2 className="mt-1 font-display text-3xl text-[var(--text-primary)]">
                {categoryMeta[activeCategory].title}
              </h2>
            </div>
            {browseProducts.length ? (
              <div className="space-y-5">
                {browseProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="rounded-[30px] border border-dashed border-white/10 bg-[rgba(19,19,26,0.92)] p-8 text-[var(--text-secondary)]">
                Coming soon.
              </div>
            )}
          </div>
        ) : results.length ? (
          <div className="grid gap-5 lg:grid-cols-2">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-[30px] border border-dashed border-white/10 bg-[rgba(19,19,26,0.92)] p-8">
            <h2 className="font-display text-3xl text-[var(--text-primary)]">
              Nothing matched that search yet
            </h2>
            <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
              Try a broader phrase like "health insurance" or jump straight into
              one of the four core categories.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {categoryOrder.map((slug) => (
                <Link
                  key={slug}
                  to={`/learn/${slug}`}
                  className="rounded-full border border-white/10 px-4 py-2 text-sm text-[var(--text-primary)] transition hover:bg-white hover:text-black"
                >
                  Browse {categoryMeta[slug].label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
