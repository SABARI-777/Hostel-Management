import mongoose from "mongoose";
import bcrypt from "bcrypt";

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

// Pre-save hook to hash password before saving to DB
UserSchema.pre("save", async function(next) {
  if (!this.isModified("Password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.Password = await bcrypt.hash(this.Password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Instance method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword) {
  // If the password starts with $2b$ (bcrypt hash), use bcrypt.compare
  // Otherwise, fallback to plain text comparison (for existing users)
  if (this.Password.startsWith("$2b$") || this.Password.startsWith("$2a$")) {
    return await bcrypt.compare(candidatePassword, this.Password);
  }
  return candidatePassword === this.Password;
};



const User = mongoose.models.User || mongoose.model("User", UserSchema, "User");

export default User;
