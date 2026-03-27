import { useEffect, useMemo, useState } from "react";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import API from "./services/api";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AddItem from "./pages/AddItems";
import Search from "./pages/Search";
import ItemDetails from "./pages/ItemDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

const readStoredUser = () => {
  const stored = localStorage.getItem("campus-user");

  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored);
  } catch {
    localStorage.removeItem("campus-user");
    return null;
  }
};

function ProtectedRoute({ isAuthenticated, children }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(readStoredUser);

  useEffect(() => {
    const loadCurrentUser = async () => {
      if (!token) {
        return;
      }

      try {
        const res = await API.get("/auth/me");
        setUser(res.data);
        localStorage.setItem("campus-user", JSON.stringify(res.data));
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("campus-user");
        setToken(null);
        setUser(null);
      }
    };

    loadCurrentUser();
  }, [token]);

  const authContext = useMemo(
    () => ({
      isAuthenticated: Boolean(token),
      user,
      login(session) {
        localStorage.setItem("token", session.token);
        localStorage.setItem("campus-user", JSON.stringify(session.user));
        setToken(session.token);
        setUser(session.user);
      },
      logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("campus-user");
        setToken(null);
        setUser(null);
      },
    }),
    [token, user],
  );

  return (
    <Router>
      <div className="app-shell">
        <Navbar auth={authContext} />

        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/item/:id" element={<ItemDetails auth={authContext} />} />
            <Route
              path="/add"
              element={
                <ProtectedRoute isAuthenticated={authContext.isAuthenticated}>
                  <AddItem user={authContext.user} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute isAuthenticated={authContext.isAuthenticated}>
                  <Profile user={authContext.user} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/login"
              element={
                authContext.isAuthenticated ? (
                  <Navigate to="/profile" replace />
                ) : (
                  <Login onLogin={authContext.login} />
                )
              }
            />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:userId/:token" element={<ResetPassword />} />
            <Route
              path="/register"
              element={
                authContext.isAuthenticated ? (
                  <Navigate to="/profile" replace />
                ) : (
                  <Register onRegister={authContext.login} />
                )
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
