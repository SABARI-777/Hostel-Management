import express from "express";
import { createNewHomePass,GenralpassDetalis,UpdateGenralpass,DeleteGenralpass } from "../Controllers/GenralPassController.js";

const GenralpassRoute = express.Router();


GenralpassRoute.post("/g/entry/add",createNewHomePass);
GenralpassRoute.get("/g/entry/details", GenralpassDetalis);
GenralpassRoute.patch("/g/entry/update", UpdateGenralpass);
GenralpassRoute.delete("/g/entry/delete", DeleteGenralpass);

export default GenralpassRoute;
