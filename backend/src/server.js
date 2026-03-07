import dotenv from "dotenv";
dotenv.config({ path: "../.env" }); 

import express from "express";
import mongoose from "mongoose";

import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.route.js";
import noteRoutes from "./routes/notesRoutes.js";



const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── MIDDLEWARE ───────────────────────────────────────────────────────────────
app.use(express.json());
app.use(cookieParser()); // needed to read the JWT cookie

// ─── API ROUTES ───────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

// ─── SERVE FRONTEND (same service on Render) ─────────────────────────────────
// This serves the built Vite frontend from the frontend/dist folder
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Any route that isn't /api/* gets the React app
// This lets React Router handle /login, /register, / etc.
app.get("/{*path}", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
});

// ─── DATABASE + START ─────────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));