import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import { useAuth } from "../hooks/useAuth.jsx";

export default function Navbar() {
  const navigate = useNavigate();
  const { isLoggedIn, phone, requireAuth, logout } = useAuth();

  function submitSearch(query) {
    if (!query) {
      return;
    }
    requireAuth(() => navigate(`/search?q=${encodeURIComponent(query)}`));
  }

  function selectResult(product, query) {
    if (product?.pb_redirect_url) {
      requireAuth(() => window.location.assign(product.pb_redirect_url));
      return;
    }

    if (!query) {
      return;
    }

    requireAuth(() => navigate(`/search?q=${encodeURIComponent(query)}`));
  }

  return (
    <header className="sticky top-0 z-40 px-4 pt-4 md:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 rounded-[28px] border border-white/10 bg-[rgba(10,10,15,0.72)] px-4 py-4 backdrop-blur-xl md:flex-row md:items-center">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="text-left font-display text-2xl text-[var(--text-primary)]"
        >
          PolEasyBazaar
        </button>

        <div className="flex-1">
          <SearchBar
            compact
            placeholder="Search products or insurers"
            onSubmit={submitSearch}
            onSelectResult={selectResult}
          />
        </div>

        {isLoggedIn ? (
          <div className="flex items-center gap-3">
            <div className="rounded-full border border-white/10 px-4 py-3 text-sm text-[var(--text-primary)]">
              +91 {phone}
            </div>
            <button
              type="button"
              onClick={logout}
              className="rounded-full border border-white/10 px-4 py-3 text-sm text-[var(--text-secondary)] transition hover:text-white"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => requireAuth()}
            className="rounded-full border border-white/10 px-5 py-3 text-sm font-medium text-white transition hover:bg-white hover:text-black"
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
}
