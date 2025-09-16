import express from "express";

import {
  AddPlacement,
  GetBatch,
  UpdateBatch,
  DeleteBatch,
} from "../Controllers/PlacementControll.js";

const BatchRouter = express.Router();

BatchRouter.post("/batch/add", AddPlacement);
BatchRouter.get("/batch/details", GetBatch);
BatchRouter.patch("/batch/update", UpdateBatch);
BatchRouter.delete("/batch/delete", DeleteBatch);

export default BatchRouter;
