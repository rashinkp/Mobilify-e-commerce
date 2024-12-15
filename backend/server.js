import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import connectDB from "./config/db.js"; 
import adminRoutes from './routes/adminRouter.js'
import userRoutes from './routes/userRouter.js'
import cookieParser from "cookie-parser";
import session from "express-session";
dotenv.config(); 

const app = express();

// Connect to MongoDB
connectDB()
// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(
  session({
    secret: "your-secret-key", 
    resave: false, 
    saveUninitialized: true, 
    cookie: { secure: false }, 
  })
);



app.use("/api/admin", adminRoutes);
app.use('/api/user', userRoutes);

// Handle 404 Errors
app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err?.message || "Something went wrong" });
});

// Start server
const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
