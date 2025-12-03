// backend/index.js (ESM) — MongoDB + CRUD
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Developer from "./models/Developer.js";



dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const ALLOWED_ORIGIN = process.env.CORS_ORIGIN || "*";

app.use(cors({ origin: ALLOWED_ORIGIN }));
app.use(express.json());

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI;
if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI)
    .then(() => {
      console.log("✓ Connected to MongoDB");
    })
    .catch((err) => {
      console.error("✗ MongoDB connection error:", err.message);
    });
} else {
  console.warn("⚠ MONGODB_URI not provided — backend will not persist data to MongoDB.");
}

// --- Validation helper (server-side) ---
function validateDeveloperPayload(payload) {
  const errors = [];
  if (!payload.name || typeof payload.name !== "string" || !payload.name.trim()) {
    errors.push("name is required");
  }
  const validRoles = ["Frontend", "Backend", "Full-Stack"];
  if (!payload.role || !validRoles.includes(payload.role)) {
    errors.push(`role is required and must be one of: ${validRoles.join(", ")}`);
  }
  if (!payload.techStack || (typeof payload.techStack !== "string" && !Array.isArray(payload.techStack))) {
    errors.push("techStack is required (string or array)");  }
  if (payload.experience === undefined || payload.experience === null || isNaN(Number(payload.experience))) {
    errors.push("experience is required and must be a number");
  } else if (Number(payload.experience) < 0) {
    errors.push("experience must be 0 or greater");
  }
  return errors;
}

// Routes

app.get("/", (req, res) => res.json({ status: "ok", message: "Backend (Mongo) running" }));

// GET /developers
app.get("/developers", async (req, res) => {
  try {
    const docs = await Developer.find().sort({ createdAt: -1 }).lean();
    res.json(docs);
  } catch (err) {
    console.error("GET /developers error:", err);
    res.status(500).json({ error: "Failed to fetch developers" });
  }
});

// POST /developers
app.post("/developers", async (req, res) => {
  try {
    const payload = req.body;
    const errors = validateDeveloperPayload(payload);
    if (errors.length) return res.status(400).json({ errors });

    // normalize techStack: allow array or comma-separated string
    const techArray = Array.isArray(payload.techStack)
      ? payload.techStack.map(s => String(s).trim()).filter(Boolean)
      : String(payload.techStack).split(",").map(s => s.trim()).filter(Boolean);

    const dev = new Developer({
      name: payload.name.trim(),
      role: payload.role,
      techStack: techArray,
      experience: Number(payload.experience)
    });

    await dev.save();
    res.status(201).json({ message: "Developer saved", developer: dev });
  } catch (err) {
    console.error("POST /developers error:", err);
    res.status(500).json({ error: "Failed to save developer" });
  }
});

// PUT /developers/:id  -> Edit developer
app.put("/developers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const errors = validateDeveloperPayload(payload);
    if (errors.length) return res.status(400).json({ errors });

    const techArray = Array.isArray(payload.techStack)
      ? payload.techStack.map(s => String(s).trim()).filter(Boolean)
      : String(payload.techStack).split(",").map(s => s.trim()).filter(Boolean);

    const updated = await Developer.findByIdAndUpdate(
      id,
      {
        name: payload.name.trim(),
        role: payload.role,
        techStack: techArray,
        experience: Number(payload.experience)
      },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ error: "Developer not found" });
    res.json({ message: "Developer updated", developer: updated });
  } catch (err) {
    console.error("PUT /developers/:id error:", err);
    res.status(500).json({ error: "Failed to update developer" });
  }
});

// DELETE /developers/:id
app.delete("/developers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const removed = await Developer.findByIdAndDelete(id);
    if (!removed) return res.status(404).json({ error: "Developer not found" });
    res.json({ message: "Developer deleted", developer: removed });
  } catch (err) {
    console.error("DELETE /developers/:id error:", err);
    res.status(500).json({ error: "Failed to delete developer" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running (Mongo) at http://localhost:${PORT}`);
});
