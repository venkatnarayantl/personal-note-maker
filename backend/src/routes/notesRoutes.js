import express from "express";
import Note from "../models/Note.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// ALL note routes are protected — user must be logged in

// GET all notes for the logged-in user
router.get("/", protect, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get("/:id", protect, async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.userId });
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE a note — automatically links to logged-in user
router.post("/", protect, async (req, res) => {
  try {
    const note = await Note.create({ ...req.body, userId: req.userId });
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE a note — only if it belongs to this user
router.put("/:id", protect, async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId }, // userId check = security
      req.body,
      { new: true }
    );
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE a note — only if it belongs to this user
router.delete("/:id", protect, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId, // userId check = security
    });
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



export default router;