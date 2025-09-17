import express from "express";
import { MakeApprove,CancelApprove } from "../Controllers/Caretakerapprovel.js";

const ApprovealRouter = express.Router();

ApprovealRouter.post("/approve/", MakeApprove);
ApprovealRouter.post("/cancel/",CancelApprove);
export default ApprovealRouter;
