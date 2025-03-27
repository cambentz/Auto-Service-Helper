import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import guideRoutes from "./routes/guideRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/auth", authRoutes);
app.use("/guides", guideRoutes);
app.use("/users", userRoutes);

// Health check + default root route
app.get("/health", (req, res) => {
  res
    .status(200)
    .json({ status: "ok", message: "Gesture Garage API is running" });
});

app.get("/", (req, res) => {
  res.send("Welcome to the Gesture Garage API!");
});

export default app;