require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Route imports
const authRoutes = require('./routes/authRoutes.js');
const guideRoutes = require('./routes/guideRoutes.js');
const userRoutes = require('./routes/userRoutes.js');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/guides', guideRoutes);
app.use('/api/users', userRoutes);

// Health check + default root route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Gesture Garage API is running' });
});

app.get('/', (req, res) => {
  res.send('Welcome to the Gesture Garage API!');
});

module.exports = app;