import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    // ADD userId to link each note to the user who created it
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Note", noteSchema);

// ─────────────────────────────────────────────────────────────────────────────
// NOTE: If your current note schema has different field names (e.g. "body"
// instead of "content"), keep your original field names and just ADD the
// userId field. Only the userId line is new here.
// ─────────────────────────────────────────────────────────────────────────────