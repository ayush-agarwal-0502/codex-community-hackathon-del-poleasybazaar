import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "poleasybazaar-auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({
    isLoggedIn: false,
    phone: "",
  });
  const [modalState, setModalState] = useState({
    isOpen: false,
    attemptedAction: null,
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return;
      }

      const parsed = JSON.parse(raw);
      if (parsed?.loggedIn && parsed?.phone) {
        setAuthState({
          isLoggedIn: true,
          phone: parsed.phone,
        });
      }
    } catch (error) {
      console.error("Failed to read auth state", error);
    }
  }, []);

  const login = useCallback((phone) => {
    const nextState = { isLoggedIn: true, phone };
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ phone, loggedIn: true }),
    );
    setAuthState(nextState);
    setModalState((current) => {
      const action = current.attemptedAction;
      queueMicrotask(() => {
        if (typeof action === "function") {
          action();
        }
      });
      return { isOpen: false, attemptedAction: null };
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setAuthState({ isLoggedIn: false, phone: "" });
  }, []);

  const closeAuthModal = useCallback(() => {
    setModalState({ isOpen: false, attemptedAction: null });
  }, []);

  const requireAuth = useCallback(
    (attemptedAction) => {
      if (authState.isLoggedIn) {
        if (typeof attemptedAction === "function") {
          attemptedAction();
        }
        return true;
      }

      setModalState({
        isOpen: true,
        attemptedAction: attemptedAction ?? null,
      });
      return false;
    },
    [authState.isLoggedIn],
  );

  const value = useMemo(
    () => ({
      ...authState,
      login,
      logout,
      requireAuth,
      isModalOpen: modalState.isOpen,
      closeAuthModal,
    }),
    [authState, login, logout, requireAuth, modalState.isOpen, closeAuthModal],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
