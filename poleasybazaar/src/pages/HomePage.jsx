import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import JourneyTimeline from "../components/JourneyTimeline";
import SearchBar from "../components/SearchBar";
import { categoryMeta, categoryOrder } from "../data/categoryMeta";
import { useAuth } from "../hooks/useAuth.jsx";

export default function HomePage() {
  const navigate = useNavigate();
  const { requireAuth } = useAuth();
  const [activeCategory, setActiveCategory] = useState(0);
  const [visitorCount, setVisitorCount] = useState("");

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveCategory((current) => (current + 1) % categoryOrder.length);
    }, 1200);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let ignore = false;

    async function loadVisitors() {
      try {
        const response = await fetch(
          "https://api.countapi.xyz/hit/poleasybazaar/visits",
        );
        const data = await response.json();
        if (!ignore && data?.value) {
          setVisitorCount(new Intl.NumberFormat("en-IN").format(data.value));
        }
      } catch (error) {
        const key = "poleasybazaar-local-visits";
        const fallbackValue = Number(localStorage.getItem(key) || "0") + 1;
        localStorage.setItem(key, String(fallbackValue));
        if (!ignore) {
          setVisitorCount(new Intl.NumberFormat("en-IN").format(fallbackValue));
        }
      }
    }

    loadVisitors();

    return () => {
      ignore = true;
    };
  }, []);

  function submitSearch(query) {
    if (!query) {
      return;
    }
    requireAuth(() => navigate(`/search?q=${encodeURIComponent(query)}`));
  }

  function selectSearchResult(product, query) {
    if (!product?.pb_redirect_url && !query) {
      return;
    }
    requireAuth(() => window.location.assign(product.pb_redirect_url));
  }

  function handleTimelineAction(action) {
    if (action === "learn") {
      requireAuth(() => navigate("/learn/health"));
      return;
    }

    if (action === "calculate") {
      requireAuth(() => navigate("/calculate"));
      return;
    }

    requireAuth(() => navigate("/search"));
  }

  return (
    <div className="pb-16">
      <section className="relative mx-auto mt-8 max-w-6xl overflow-hidden rounded-[40px] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(74,158,255,0.14),_transparent_30%),linear-gradient(180deg,rgba(19,19,26,0.98),rgba(10,10,15,0.98))] px-4 py-16 shadow-2xl shadow-black/35 md:px-8 md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,229,192,0.12),transparent_26%),radial-gradient(circle_at_80%_0%,rgba(181,106,255,0.14),transparent_28%)]" />
        <div className="relative mx-auto max-w-4xl text-center">
          <p className="text-sm uppercase tracking-[0.32em] text-[var(--text-secondary)]">
            Protecting India with Insurance
          </p>
          <h1 className="mt-5 font-display text-5xl leading-none text-[var(--text-primary)] md:text-7xl">
            PolEasyBazaar
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[var(--text-secondary)] md:text-lg">
            The friction-light insurance discovery layer for digitally native
            buyers who want to learn, compare, and move without waiting for a
            callback.
          </p>

          <div className="mx-auto mt-10 max-w-3xl">
            <SearchBar
              placeholder="Search HDFC ERGO, term insurance, bike cover..."
              onSubmit={submitSearch}
              onSelectResult={selectSearchResult}
            />
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            {categoryOrder.map((slug, index) => {
              const meta = categoryMeta[slug];
              return (
                <motion.span
                  key={slug}
                  animate={{
                    opacity: index === activeCategory ? 1 : 0.45,
                    y: index === activeCategory ? 0 : 6,
                    scale: index === activeCategory ? 1.04 : 1,
                  }}
                  transition={{ duration: 0.35 }}
                  className="font-display text-2xl md:text-4xl"
                  style={{ color: meta.accent }}
                >
                  {meta.label}
                </motion.span>
              );
            })}
          </div>

          <p className="mt-8 text-sm uppercase tracking-[0.26em] text-[var(--text-secondary)]">
            {visitorCount
              ? `Visitors this month: ${visitorCount}`
              : "Visitors this month: loading..."}
          </p>
        </div>
      </section>

      <JourneyTimeline onAction={handleTimelineAction} />

      <footer className="mx-auto mt-16 max-w-6xl px-4 text-center text-sm leading-7 text-[var(--text-secondary)] md:px-6">
        PolEasyBazaar is a discovery tool. All purchases are completed on{" "}
        <a
          className="text-[var(--text-primary)] underline decoration-white/30 underline-offset-4"
          href="https://www.policybazaar.com/"
          target="_blank"
          rel="noreferrer"
        >
          PolicyBazaar.com
        </a>
        .
      </footer>
    </div>
  );
}
