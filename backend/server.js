import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";



dotenv.config();


const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { dbName: "auth_demo" })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/users", userRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
