import Room from "../MODELS/RoomModel.js";

// ================== CREATE ROOM ==================
export const AddRooms = async (req, res) => {
  try {
    const { RoomNumber, HostelBlock, Capacity, Occupancy } = req.body;

    if (!RoomNumber || !HostelBlock || !Capacity || !Occupancy) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if room already exists
    const existingRoom = await Room.findOne({ RoomNumber });
    if (existingRoom) {
      return res.status(409).json({ message: "Room already exists." });
    }

    // Create new room
    const newRoom = new Room({
      RoomNumber,
      HostelBlock,
      Capacity,
      Occupancy,
    });

    await newRoom.save();

    return res.status(201).json({
      message: "Room created successfully.",
      data: newRoom,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error creating room.",
      error: err.message,
    });
  }
};

// ================== GET ROOMS ==================
export const GetRoomdetails = async (req, res) => {
  try {
    const rooms = await Room.find();
    if (!rooms || rooms.length === 0) {
      return res.status(404).json({ message: "No room data found." });
    }
    return res.status(200).json({ message: "Room details fetched.", data: rooms });
  } catch (err) {
    return res.status(500).json({
      message: "Error fetching rooms.",
      error: err.message,
    });
  }
};

// ================== UPDATE ROOM ==================
export const UpdateRoom = async (req, res) => {
  try {
    const { _id, RoomNumber, HostelBlock, Capacity, Occupancy } = req.body;

    if (!_id || !RoomNumber || !HostelBlock || !Capacity || !Occupancy) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const updatedRoom = await Room.findByIdAndUpdate(
      _id,
      { RoomNumber, HostelBlock, Capacity, Occupancy },
      { new: true }
    );

    if (!updatedRoom) {
      return res.status(404).json({ message: "Room not found." });
    }

    res.status(200).json({
      message: "Room updated successfully.",
      data: updatedRoom,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating room.", error: error.message });
  }
};

// ================== DELETE ROOM ==================
export const DeleteRoom = async (req, res) => {
  try {
    const { _id } = req.body;
    if (!_id) {
      return res.status(400).json({ message: "Room ID is required." });
    }

    const deletedRoom = await Room.findByIdAndDelete(_id);

    if (!deletedRoom) {
      return res.status(404).json({ message: "Room not found." });
    }

    return res.status(200).json({
      message: "Room deleted successfully.",
      data: deletedRoom,
    });
  } catch (err) {
    return res.status(500).json({ message: "Error deleting room.", error: err.message });
  }
};
