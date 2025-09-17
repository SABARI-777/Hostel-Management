import express from "express";

import {
  AddPlacement,
  GetBatch,
  UpdateBatch,
  DeleteBatch,
} from "../Controllers/PlacementControll.js";

const BatchRouter = express.Router();

BatchRouter.post("/b/add", AddPlacement);
BatchRouter.get("/b/details", GetBatch);
BatchRouter.patch("/b/update", UpdateBatch);
BatchRouter.delete("/b/delete", DeleteBatch);

export default BatchRouter;
