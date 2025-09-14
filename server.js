import express from "express";
import dotenv from "dotenv";
import Routes from "./BACKEND/Routes/Routes.js";
import {ConnectDB} from "./DBConnect.js"

dotenv.config();

ConnectDB();




const app = express();
app.use(express.json());

app.use("/", Routes);

app.listen(process.env.PORT, () => {
  console.log("server running on 3000");
});
