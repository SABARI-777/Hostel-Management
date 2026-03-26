import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import Routes from "./BACKEND/Routes/Routes.js";
import {ConnectDB} from "./DBConnect.js"

ConnectDB();




const app = express();
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

app.use("/", Routes);

const JWT_SECRET = (process.env.JWT_SECRET || "fallback_secret").trim();

app.listen(process.env.PORT, () => {
  console.log("server running on 3000");
});
