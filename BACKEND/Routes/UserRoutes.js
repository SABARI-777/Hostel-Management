import express from "express";

import { CreateNewUser, GetUsers,UpdateUser,GetUserByID,DeleteUser } from "../Controllers/UserController.js";

const Userrouter = express.Router();

Userrouter.post("/add/user", CreateNewUser);
Userrouter.get("/get/users", GetUsers);
Userrouter.get("/get/user/", GetUserByID);
Userrouter.patch("/get/update", UpdateUser);
Userrouter.delete("/delete/user/",DeleteUser);


export default Userrouter;
