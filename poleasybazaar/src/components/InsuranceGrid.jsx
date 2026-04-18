import { motion } from "framer-motion";
import { categoryMeta, categoryOrder } from "../data/categoryMeta";

export default function InsuranceGrid({ onSelectCategory }) {
  return (
    <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {categoryOrder.map((slug, index) => {
        const meta = categoryMeta[slug];
        const Icon = meta.icon;

        return (
          <motion.button
            key={slug}
            type="button"
            className={`group relative overflow-hidden rounded-[30px] border border-white/10 bg-[rgba(19,19,26,0.9)] p-6 text-left transition ${meta.glow}`}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4, scale: 1.02 }}
            onClick={() => onSelectCategory(slug)}
          >
            <div
              className="absolute inset-0 opacity-20 blur-3xl transition duration-300 group-hover:opacity-40"
              style={{
                background: `radial-gradient(circle at top right, ${meta.accent}, transparent 55%)`,
              }}
            />
            <div className="relative">
              <div
                className="inline-flex rounded-2xl p-3"
                style={{ backgroundColor: `${meta.accent}22`, color: meta.accent }}
              >
                <Icon size={24} />
              </div>
              <h3 className="mt-16 font-display text-3xl text-[var(--text-primary)]">
                {meta.label}
              </h3>
              <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
                {meta.intro}
              </p>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
