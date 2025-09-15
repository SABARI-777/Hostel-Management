import express from "express";

import {
  CreateNewUser,
  GetUsers,
  UpdateUser,
  GetUserByID,
  DeleteUser,
} from "../Controllers/UserRegisterController.js";

const Userrouter = express.Router();

Userrouter.post("/add", CreateNewUser);
Userrouter.get("/details", GetUsers);
Userrouter.get("/detail", GetUserByID);
Userrouter.patch("/update", UpdateUser);
Userrouter.delete("/delete", DeleteUser);

export default Userrouter;
