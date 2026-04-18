import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Learn About Insurance",
    description: "Understand what each policy type covers in a cleaner FAQ format.",
    cta: "Start learning",
    action: "learn",
  },
  {
    number: "02",
    title: "Calculate What You Need",
    description: "Jump into PolicyBazaar calculators after a quick confidence-building intro.",
    cta: "Open calculator",
    action: "calculate",
  },
  {
    number: "03",
    title: "Buy Insurance",
    description: "Continue safely to PolicyBazaar when you are ready to compare and purchase.",
    cta: "Browse products",
    action: "buy",
  },
];

export default function JourneyTimeline({ onAction }) {
  return (
    <section className="mx-auto mt-20 max-w-6xl px-4 md:px-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
        {steps.map((step, index) => (
          <motion.div
            key={step.number}
            className="relative rounded-[32px] border border-white/10 bg-[rgba(19,19,26,0.92)] p-6"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ delay: index * 0.1 }}
          >
            <p className="text-sm uppercase tracking-[0.24em] text-[var(--text-secondary)]">
              {step.number}
            </p>
            <h3 className="mt-3 font-display text-2xl text-[var(--text-primary)]">
              {step.title}
            </h3>
            <p className="mt-4 text-sm leading-6 text-[var(--text-secondary)]">
              {step.description}
            </p>
            <button
              type="button"
              onClick={() => onAction(step.action)}
              className="mt-6 rounded-2xl border border-white/10 px-4 py-3 text-sm font-medium text-white transition hover:bg-white hover:text-black"
            >
              {step.cta}
            </button>
          </motion.div>
        )).flatMap((node, index, list) =>
          index < list.length - 1
            ? [
                node,
                <div
                  key={`connector-${steps[index].number}`}
                  className="hidden items-center justify-center text-3xl text-white/30 lg:flex"
                >
                  →
                </div>,
              ]
            : [node],
        )}
      </div>
    </section>
  );
}
