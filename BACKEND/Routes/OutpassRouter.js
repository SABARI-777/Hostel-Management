import express from "express";
import {
  GentrateOutpass,
  GetoutpassDetails,
  UpdateOutpass,
  DeleteOutpass,
} from "../Controllers/OutpassController.js";

const OutPassRouter = express.Router();

OutPassRouter.post("/o/entry/add", GentrateOutpass);
OutPassRouter.get("/o/entry/details", GetoutpassDetails);
OutPassRouter.patch("/o/entry/update", UpdateOutpass);
OutPassRouter.delete("/o/entry/delete", DeleteOutpass);

export default OutPassRouter;
