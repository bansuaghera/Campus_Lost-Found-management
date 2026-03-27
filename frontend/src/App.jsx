import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import { useMemo, useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AddItem from "./pages/AddItems";
import Search from "./pages/Search";
import ItemDetails from "./pages/ItemDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

function ProtectedRoute({ isAuthenticated, children }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("campus-user");
    return stored ? JSON.parse(stored) : null;
  });

  const authContext = useMemo(
    () => ({
      isAuthenticated: Boolean(token),
      user,
      login(nextUser) {
        const sessionToken = `session-${Date.now()}`;
        localStorage.setItem("token", sessionToken);
        localStorage.setItem("campus-user", JSON.stringify(nextUser));
        setToken(sessionToken);
        setUser(nextUser);
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
            <Route path="/item/:id" element={<ItemDetails />} />
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
