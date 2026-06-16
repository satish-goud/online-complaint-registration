import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import complaintRoutes from './routes/complaintRoutes.js';

// Load environment variables from .env file
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Parses incoming requests with JSON payloads

// Base/Default Route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Online Complaint Registration API!' });
});

// Routes
app.use('/api/complaints', complaintRoutes);

// Port configuration
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
