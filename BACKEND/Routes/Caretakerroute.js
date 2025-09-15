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
CaretakerRouter.get("/detail/", GetCaretakerByID);

//admin routes

CaretakerRouter.post("/add/", CreateNewCaretaker);
CaretakerRouter.get("/details/", GetCaretakers);
CaretakerRouter.patch("/update/", UpdateCaretaker);
CaretakerRouter.delete("/delete/", DeleteCaretaker);

export default CaretakerRouter;
