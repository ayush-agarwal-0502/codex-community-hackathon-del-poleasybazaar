import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";

export default function ProtectedRoute({ children }) {
  const { isLoggedIn, requireAuth } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      return;
    }

    const destination = `${location.pathname}${location.search}`;
    requireAuth(() => navigate(destination, { replace: true }));
    navigate("/", { replace: true });
  }, [isLoggedIn, location.pathname, location.search, navigate, requireAuth]);

  if (!isLoggedIn) {
    return null;
  }

  return children;
}
