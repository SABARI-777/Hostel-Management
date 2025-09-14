import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  type: {
    type: String,
    require: true,
    enum: ["STUDENT", "ADVISOR", "CARETAKER", "ADMIN"],
  },
});

const User = new mongoose.model("User", UserSchema, "User");

export default User;
