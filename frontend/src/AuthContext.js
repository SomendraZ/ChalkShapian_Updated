import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [chalkName, setChalkName] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const logoutTimeout = 3600000; // 1 hour in milliseconds
  const activityTimeoutRef = useRef(null);
  const navigate = useNavigate();

  // Logout the user
  const logout = useCallback(() => {
    setChalkName(null);
    setLoggedIn(false);
    localStorage.removeItem("chalkName");
    localStorage.removeItem("LoggedIn");
    localStorage.removeItem("email");
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("isVerified");

    if (activityTimeoutRef.current) {
      clearTimeout(activityTimeoutRef.current);
      activityTimeoutRef.current = null;
    }

    navigate("/login", { replace: true });
  }, [navigate]);

  // Login the user
  const login = (name, email, jwtToken, isAdmin, isVerified) => {
    setChalkName(name);
    setLoggedIn(true);
    localStorage.setItem("chalkName", name);
    localStorage.setItem("LoggedIn", "true");
    localStorage.setItem("email", email);
    localStorage.setItem("jwtToken", jwtToken);
    localStorage.setItem("isAdmin", isAdmin);
    localStorage.setItem("isVerified", isVerified);
    resetInactivityTimeout();
  };

  // Reset the inactivity timeout
  const resetInactivityTimeout = useCallback(() => {
    // Clear any existing timeout
    if (activityTimeoutRef.current) {
      clearTimeout(activityTimeoutRef.current);
    }

    // Start a new timeout
    activityTimeoutRef.current = setTimeout(() => {
      logout();
    }, logoutTimeout);
  }, [logoutTimeout, logout]);

  // Restore login state from localStorage on mount
  useEffect(() => {
    const storedChalkName = localStorage.getItem("chalkName");
    const storedLoggedIn = localStorage.getItem("LoggedIn") === "true";
    const storedJwtToken = localStorage.getItem("jwtToken");

    if (storedLoggedIn && storedChalkName && storedJwtToken) {
      setChalkName(storedChalkName);
      setLoggedIn(true);
      resetInactivityTimeout(); // Reset inactivity timeout when logged in
    } else {
      setLoggedIn(false); // Ensure loggedIn state is false if no stored session
    }

    // Clear inactivity timeout on component unmount or reset
    return () => {
      if (activityTimeoutRef.current) {
        clearTimeout(activityTimeoutRef.current);
      }
    };
  }, [resetInactivityTimeout]);

  useEffect(() => {
    // Reset inactivity timeout every time loggedIn changes
    if (loggedIn) {
      resetInactivityTimeout();
    } else {
      if (activityTimeoutRef.current) {
        clearTimeout(activityTimeoutRef.current);
      }
    }
  }, [loggedIn, resetInactivityTimeout]);

  return (
    <AuthContext.Provider
      value={{ chalkName, loggedIn, login, logout, setLoggedIn }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
