import { AnimatePresence, motion } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import PhoneLoginModal from "./components/PhoneLoginModal";
import ProtectedRoute from "./components/ProtectedRoute";
import CalculatorPage from "./pages/CalculatorPage";
import HomePage from "./pages/HomePage";
import LearnPage from "./pages/LearnPage";
import SearchResultsPage from "./pages/SearchResultsPage";

export default function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(74,158,255,0.1),_transparent_25%),radial-gradient(circle_at_bottom_left,_rgba(0,229,192,0.08),_transparent_30%)]" />
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname + location.search}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/learn/:category"
              element={
                <ProtectedRoute>
                  <LearnPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/calculate"
              element={
                <ProtectedRoute>
                  <CalculatorPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/search"
              element={
                <ProtectedRoute>
                  <SearchResultsPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </motion.main>
      </AnimatePresence>
      <PhoneLoginModal />
    </div>
  );
}
