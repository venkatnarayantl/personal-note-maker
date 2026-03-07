import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { Resend } from "resend";
import User from "../models/user.model.js";

const router = express.Router();

// ─── REGISTER ────────────────────────────────────────────────────────────────
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    if (password.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters" });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    await User.create({ email, password: hashed, verificationToken });

    const verifyLink = `${process.env.APP_URL}/api/auth/verify/${verificationToken}`;

    const result = await new Resend(process.env.RESEND_API_KEY).emails.send({
      from: "Note Maker <onboarding@resend.dev>",
      to: email,
      subject: "Verify your Note Maker account",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;">
          <h2 style="color:#6366f1;">Welcome to Note Maker! 👋</h2>
          <p>Click below to verify your email.</p>
          <a href="${verifyLink}"
             style="display:inline-block;padding:12px 28px;background:#6366f1;color:white;
                    text-decoration:none;border-radius:8px;font-weight:bold;margin:16px 0;">
            Verify My Email
          </a>
          <p style="color:#888;font-size:13px;">If you didn't sign up, ignore this.</p>
        </div>
      `,
    });
    console.log("Resend result:", JSON.stringify(result));

    res.json({ message: "Registered! Check your email to verify your account." });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Something went wrong. Try again." });
  }
});

// ─── VERIFY EMAIL ─────────────────────────────────────────────────────────────
router.get("/verify/:token", async (req, res) => {
  try {
    const user = await User.findOne({ verificationToken: req.params.token });
    if (!user)
      return res.status(400).send("Invalid or expired verification link.");

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.redirect("/login?verified=true");
  } catch (err) {
    console.error("Verify error:", err);
    res.status(500).send("Something went wrong.");
  }
});

// ─── LOGIN ────────────────────────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: "Invalid email or password" });

    if (!user.isVerified)
      return res.status(403).json({ message: "Please verify your email before logging in" });

    // Include tokenVersion so logout from all devices works
    const token = jwt.sign(
      { id: user._id, tokenVersion: user.tokenVersion },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ message: "Logged in successfully", email: user.email });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Something went wrong. Try again." });
  }
});

// ─── LOGOUT (all devices) ─────────────────────────────────────────────────────
router.post("/logout", async (req, res) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      await User.findByIdAndUpdate(decoded.id, { $inc: { tokenVersion: 1 } });
    } catch {}
  }
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
});

// ─── GET CURRENT USER ─────────────────────────────────────────────────────────
router.get("/me", async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Not logged in" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password -verificationToken");
    if (!user) return res.status(401).json({ message: "User not found" });
    // Check tokenVersion to validate session
    if (user.tokenVersion !== decoded.tokenVersion)
      return res.status(401).json({ message: "Session expired, please login again" });
    res.json(user);
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
});

export default router;