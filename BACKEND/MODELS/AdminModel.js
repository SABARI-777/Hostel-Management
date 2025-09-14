import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
  UserName: {
    type: String,
    require: true,
  },
  AdminPassword1: {
    type: String,
    default: "ADMIN",
  },
  AdminPassword2: {
    type: String,
    default: "Admin@321",
  },
  type: {
    type: String,
    default: "ADMIN",
  },
});

const Admin = new mongoose.model("Admin", AdminSchema, "Admin");
export default Admin;
