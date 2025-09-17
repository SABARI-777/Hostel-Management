import User from "../MODELS/UserModel.js";

// ================== CREATE USER ==================
export const CreateNewUser = async (req, res) => {
  try {
    const { Email, Password, MobileNumber, Type } = req.body;

    if (!Email) {
      return res.status(400).json({ message: "Email is required" });
    }
    if (!Password) {
      return res.status(400).json({ message: "Password is required" });
    }
    if (!MobileNumber) {
      return res.status(400).json({ message: "MobileNumber is required" });
    }
    if (!Type) {
      return res.status(400).json({ message: "Type is required" });
    }

    const newUser = new User({ Email, Password, MobileNumber, Type });
    await newUser.save();

    return res
      .status(201)
      .json({ message: "User created successfully", data: newUser });
  } catch (err) {
    return res.status(500).json({ error: true, message: err.message });
  }
};

// ================== GET ALL USERS ==================
export const GetUsers = async (req, res) => {
  try {
    const users = await User.find();

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No user data found" });
    }

    return res.status(200).json({ message: "All user details", data: users });
  } catch (err) {
    return res.status(500).json({ error: true, message: err.message });
  }
};

// ================== GET USER BY ID ==================
export const GetUserByID = async (req, res) => {
  try {
    const { _id } = req.body;

    if (!_id) {
      return res.status(400).json({ message: "ID is required" });
    }

    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User details", data: user });
  } catch (err) {
    return res.status(500).json({ error: true, message: err.message });
  }
};

// ================== UPDATE USER ==================
export const UpdateUser = async (req, res) => {
  try {
    const { _id, Email, Password, MobileNumber, Type } = req.body;

    if (!_id) {
      return res.status(400).json({ message: "ID is required" });
    }
    if (!Email) {
      return res.status(400).json({ message: "Email is required" });
    }
    if (!Password) {
      return res.status(400).json({ message: "Password is required" });
    }
    if (!MobileNumber) {
      return res.status(400).json({ message: "MobileNumber is required" });
    }
    if (!Type) {
      return res.status(400).json({ message: "Type is required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { Email, Password, MobileNumber, Type },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res
      .status(200)
      .json({ message: "User updated successfully", data: updatedUser });
  } catch (err) {
    return res.status(500).json({ error: true, message: err.message });
  }
};

// ================== DELETE USER ==================
export const DeleteUser = async (req, res) => {
  try {
    const { _id, Password } = req.body;

    if (!_id) {
      return res.status(400).json({ message: "ID is required" });
    }
    if (!Password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.Password !== Password) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    await User.findByIdAndDelete(_id);

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: true, message: err.message });
  }
};
