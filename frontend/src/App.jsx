import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

// Import your existing notes home page — adjust path if different
// import HomePage from "./pages/HomePage";
// For now using a placeholder — replace with your actual notes component
import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import NoteDetailPage from "./pages/NoteDetailPage";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On every app load, check if the user is already logged in
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  return (
     <Routes>
    <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage setUser={setUser} />} />
    <Route path="/register" element={user ? <Navigate to="/" /> : <RegisterPage />} />
    <Route path="/" element={user ? <HomePage user={user} onLogout={handleLogout} />: <Navigate to="/login" />} />
    <Route path="/create" element={user ? <CreatePage /> : <Navigate to="/login" />} />
    <Route path="/notes/:id" element={user ? <NoteDetailPage /> : <Navigate to="/login" />} />

    <Route path="*" element={<Navigate to="/" />} />
  </Routes>
  );
}