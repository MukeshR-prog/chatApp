import express from "express";
import dotenv from "dotenv";
import cors from "cors"; 
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const databaseUrl = process.env.DATABASE_URL;

app.use(cors({
    origin: process.env.ORIGIN,
    methods: ['GET','POST','DELETE','PUT','PATCH'],
    credentials: true,
}))
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth/",authRoutes)
const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

mongoose.connect(databaseUrl).then(() => {
    console.log("Connected to MongoDB");
})
.catch(err => {
    console.error(err.message);
    process.exit(1);
});