import mongoose from "mongoose";
import Caretaker from "../MODELS/Caretakermodel.js";
export const LoginCaretaker = async (req, res) => {
  try {
    const { Username, password } = req.body;

    if (!Username) {
      return res.status(400).json({ message: "Enter Username ....." });
    }

    if (!password) {
      return res.status(400).json({ message: "Enter password.." });
    }

    if (password != "CARETAKER") {
return res.status(400).json({ message: "ENTER CORRECT PASSWORD.." });
    }

    const caretaker = await Caretaker.findOne({ Username });

    if (!caretaker) {
      return res.send("NO caretakerDATA IS THERE");
    }

    if (!caretaker.type == "CARETAKER") {
      return res
        .status(201)
        .json({ message: "authentication failed", data: caretaker });
    }

    return res
      .status(201)
      .json({ message: "CARETAKER Login successfully", data: caretaker });
  } catch (err) {
    return res.status(401).json({ error: true, message: err.message });
  }
};      
