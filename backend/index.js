import express from "express";
import dotenv from "dotenv";
import cors from "cors"; 
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import contactRoute from "./routes/contactRoutes.js";
import setupSocket from "./socket.js";
import messagesRoutes from "./routes/messagesRoutes.js";
import channelRoutes from "./routes/channelRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const databaseUrl = process.env.DATABASE_URL;

app.use(cors({
    origin: [process.env.ORIGIN],
    methods: ['GET','POST','DELETE','PUT','PATCH'],
    credentials: true,
}))

app.use("/uploads/profiles",express.static("uploads/profiles"));
app.use("/uploads/files",express.static("uploads/files"))

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth/",authRoutes)
app.use("/api/contacts",contactRoute)
app.use("/api/messages",messagesRoutes)
app.use("/api/channel",channelRoutes)
const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


setupSocket(server);

mongoose.connect(databaseUrl).then(() => {
    console.log("Connected to MongoDB");
})
.catch(err => {
    console.error(err.message);
    process.exit(1);
});