import express from "express";

import {
  CreateNewUser,
  GetUsers,
  UpdateUser,
  GetUserByID,
  DeleteUser,
  verifyOTP
} from "../Controllers/UserRegisterController.js";
import { ChangePassword } from "../Controllers/UserLoginController.js";
import { authenticateToken, authorizeRoles } from "../Middleware/AuthMiddleware.js";

const Userrouter = express.Router();

Userrouter.post("/u/add", authenticateToken, authorizeRoles("ADMIN"), CreateNewUser);
Userrouter.get("/u/details", authenticateToken, authorizeRoles("ADMIN"), GetUsers);
Userrouter.get("/detail", authenticateToken, authorizeRoles("ADMIN"), GetUserByID);
Userrouter.patch("/u/update", authenticateToken, authorizeRoles("ADMIN"), UpdateUser);
Userrouter.delete("/u/delete", authenticateToken, authorizeRoles("ADMIN"), DeleteUser);
Userrouter.post("/u/verify-otp", verifyOTP);
Userrouter.post("/change-password", authenticateToken, ChangePassword);

export default Userrouter;
