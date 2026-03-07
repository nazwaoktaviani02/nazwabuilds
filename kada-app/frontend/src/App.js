import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotesPage from "./pages/NotesPage";
import PremiumPage from "./pages/PremiumPage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/notes" element={<NotesPage />} />
      <Route path="/premium" element={<PremiumPage />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}