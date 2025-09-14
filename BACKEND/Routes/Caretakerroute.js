import express from "express";

import { CreateNewCaretaker,GetCaretaker,GetCaretakerByID,DeleteCaretaker, UpdateCaretaker} from "../Controllers/CaretakeController.js";

const CaretakerRouter = express.Router();

CaretakerRouter.post("/add/caretaker", CreateNewCaretaker);
CaretakerRouter.get("/get/caretakers", GetCaretaker);
CaretakerRouter.get("/get/caretakers/", GetCaretakerByID);
CaretakerRouter.patch("/update/caretaker", UpdateCaretaker);
CaretakerRouter.delete("/delete/caretakers/", DeleteCaretaker);

export default CaretakerRouter;
