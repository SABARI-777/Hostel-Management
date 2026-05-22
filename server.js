import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import Routes from "./BACKEND/Routes/Routes.js";
import { ConnectDB } from "./DBConnect.js";

const app = express();

const allowedOrigins = [
  "https://kithostel.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.startsWith("http://localhost:")) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());

app.use("/", Routes);

const startServer = async () => {
  try {

    await ConnectDB();

    app.listen(process.env.PORT || 3000, () => {
      console.log("Server running on 3000");
    });

  } catch (error) {
    console.log("DB Connection Failed:", error);
  }
};

startServer();