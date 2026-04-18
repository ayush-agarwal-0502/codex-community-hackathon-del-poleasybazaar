import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth.jsx";

export default function PhoneLoginModal() {
  const { isModalOpen, closeAuthModal, login } = useAuth();
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const sanitized = phone.replace(/\D/g, "");
    if (!/^\d{10}$/.test(sanitized)) {
      setError("Enter a valid 10-digit phone number.");
      return;
    }

    setError("");
    setPhone("");
    login(sanitized);
  }

  return (
    <AnimatePresence>
      {isModalOpen ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(10,10,15,0.72)] px-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative w-full max-w-md rounded-[28px] border border-white/10 bg-[rgba(19,19,26,0.95)] p-6 shadow-2xl"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
          >
            <button
              type="button"
              aria-label="Close"
              className="absolute right-4 top-4 rounded-full border border-white/10 p-2 text-[var(--text-secondary)] transition hover:text-white"
              onClick={closeAuthModal}
            >
              <X size={16} />
            </button>

            <p className="text-sm uppercase tracking-[0.3em] text-[var(--text-secondary)]">
              Quick access
            </p>
            <h2 className="mt-3 font-display text-3xl text-[var(--text-primary)]">
              One step away
            </h2>
            <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
              Enter your phone number to continue. No spam, no sales calls.
            </p>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <label className="block">
                <span className="mb-2 block text-sm text-[var(--text-secondary)]">
                  Phone number
                </span>
                <div className="flex items-center rounded-2xl border border-white/10 bg-black/20 px-4">
                  <span className="pr-3 text-sm text-[var(--text-secondary)]">
                    +91
                  </span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="9876543210"
                    className="w-full bg-transparent py-4 text-lg text-[var(--text-primary)] outline-none placeholder:text-[var(--text-secondary)]"
                  />
                </div>
              </label>

              {error ? (
                <p className="text-sm text-rose-300">{error}</p>
              ) : null}

              <button
                type="submit"
                className="w-full rounded-2xl bg-white px-4 py-4 font-medium text-black transition hover:opacity-90"
              >
                Continue
              </button>
            </form>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
