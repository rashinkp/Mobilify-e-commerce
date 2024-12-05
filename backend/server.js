import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import connectDB from "./config/db.js"; 
import adminRoutes from './routes/adminRouter.js'

dotenv.config(); 

const app = express();

// Connect to MongoDB
connectDB()
// Middleware
app.use(cors()); // Enable CORS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use("/api/admin", adminRoutes);

// Handle 404 Errors
app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong" });
});

// Start server
const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
