import express from "express";
import {
  GenerateOutpass,
  GetOutpassDetails,
  UpdateOutpass,
  DeleteOutpass,
} from "../Controllers/OutpassController.js";

const OutPassRouter = express.Router();

OutPassRouter.post("/o/entry/add", GenerateOutpass);
OutPassRouter.get("/o/entry/details", GetOutpassDetails);
OutPassRouter.patch("/o/entry/update", UpdateOutpass);
OutPassRouter.delete("/o/entry/delete", DeleteOutpass);

export default OutPassRouter;
