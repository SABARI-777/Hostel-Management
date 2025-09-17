import express from "express";

import {
  CreateNewCaretaker,
  GetCaretakers,
  GetCaretakerByID,
  DeleteCaretaker,
  UpdateCaretaker,
} from "../Controllers/CaretakeController.js";

const CaretakerRouter = express.Router();

// caretaker routes
// CaretakerRouter.get("/detail/", GetCaretakerByID);

//admin routes

CaretakerRouter.post("/ct/add/", CreateNewCaretaker);
CaretakerRouter.get("/ct/details/", GetCaretakers);
CaretakerRouter.patch("/ct/update/", UpdateCaretaker);
CaretakerRouter.delete("/ct/delete/", DeleteCaretaker);

export default CaretakerRouter;
