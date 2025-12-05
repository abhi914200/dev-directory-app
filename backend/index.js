// backend/index.js (ESM) — MongoDB + CRUD
import express from "express";
import cors from "cors";
import connectDB from "./src/config/db.js";
import dotenv from "dotenv";
import developerRoutes from "./src/routes/developerRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";

dotenv.config({ path: "./.env" });


const app = express();
const PORT = process.env.PORT || 4000;
const ALLOWED_ORIGIN = process.env.CORS_ORIGIN || "*";

app.use(cors({ origin: ALLOWED_ORIGIN }));
app.use(express.json());


app.use('/api/auth', authRoutes);    //auth routes
app.use('/api/developers', developerRoutes); // dev routes
// Routes
app.get("/", (req, res) => res.json({ status: "ok", message: "Backend (Mongo) running" }));


// Start server after DB connects
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });

