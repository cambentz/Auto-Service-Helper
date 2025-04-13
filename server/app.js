import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import guideRoutes from "./routes/guideRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import garageRoutes from "./routes/garageRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";

dotenv.config();

const app = express();

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});

// Middleware
const allowedOrigins = [
  'http://localhost:8888',
  'https://gesture-garage.onrender.com'
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/guides", guideRoutes);
app.use("/api/users", userRoutes);
app.use("/api/garage", garageRoutes);
app.use("/api/vehicles", vehicleRoutes);

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
