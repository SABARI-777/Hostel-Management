import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"

dotenv.config();

export const ConnectDB =  async ()=> {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB with Mongoose");
  } catch (err) {
    console.error(" MongoDB connection error:", err);
    process.exit(1);
  }
}

