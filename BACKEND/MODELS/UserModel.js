import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  Email: {
    type: String,
    require: true,
  },
  Password: {
    type: String,
    require: true,
    minlength: 4,
  },
  MobileNumber: {
    type: String,
    require: true,
  },
  Type: {
    type: String,
    require: true,
    enum: ["STUDENT", "ADVISOR", "CARETAKER", "ADMIN"],
  },
});



const User = new mongoose.model("User", UserSchema, "User");

export default User;
