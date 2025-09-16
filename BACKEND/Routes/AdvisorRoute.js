import express from "express";

import {
  AddAdvisor,
  getAdvisor,
  DeleteAdvisor,
  UpdateAdvisor,
} from "../Controllers/AdvisorController.js";

const AdvisorRouter = express.Router();

AdvisorRouter.post("/advisor/add", AddAdvisor);
AdvisorRouter.get("/advisor/get", getAdvisor);
AdvisorRouter.patch("/advisor/update", UpdateAdvisor);
AdvisorRouter.delete("/advisor/delete", DeleteAdvisor);

export default AdvisorRouter;
