import express from "express";
import { createNewHomePass,GenralpassDetalis,UpdateGenralpass,DeleteGenralpass } from "../Controllers/GenralPassController.js";

import { authenticateToken } from "../Middleware/AuthMiddleware.js";
const GenralpassRoute = express.Router();


GenralpassRoute.post("/g/entry/add", authenticateToken, createNewHomePass);
GenralpassRoute.get("/g/entry/details", authenticateToken, GenralpassDetalis);
GenralpassRoute.patch("/g/entry/update", authenticateToken, UpdateGenralpass);
GenralpassRoute.delete("/g/entry/delete", authenticateToken, DeleteGenralpass);

export default GenralpassRoute;
