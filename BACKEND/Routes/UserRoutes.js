import express from "express";

import {
  CreateNewUser,
  GetUsers,
  UpdateUser,
  GetUserByID,
  DeleteUser,
} from "../Controllers/UserRegisterController.js";

const Userrouter = express.Router();

Userrouter.post("/u/add", CreateNewUser);
Userrouter.get("/u/details", GetUsers);
Userrouter.get("/detail", GetUserByID);
Userrouter.patch("/u/update", UpdateUser);
Userrouter.delete("/u/delete", DeleteUser);

export default Userrouter;
