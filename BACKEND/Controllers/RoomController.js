import Room from "../MODELS/RoomModel.js";

export const AddRooms = async (req, res) => {
  try {
    const { RoomNumber, HostelBlock, Capacity, Occupancy } = req.body;

    if (!RoomNumber || !HostelBlock || !Capacity || !Occupancy) {
      return res.status(401).json({ message: "enter all fields !" });
    }
    const existingRoom = await Room.findOne(RoomNumber);
    if (existingRoom.Occupancy - 1 >= existingRoom.Capacity) {
      return res.status(400).json({ message: "room full " });
    }
    const roomdetails = await new Room({
      RoomNumber,
      HostelBlock,
      Capacity,
      Occupancy,
    });

    roomdetails.save();

    return res
      .status(201)
      .json({ message: "ROOM CREATED SUCCESSFULLY !", DATA: roomdetails });
  } catch (err) {
    return res.send({
      message: "error on room creations !",
      error: err.message,
    });
  }
};

export const GetRoomdetails = async (req, res) => {
  try {
    const roomdata = await Room.find();
    if (!roomdata) {
      return res.status(201).json({ message: "ROOM data is empty!" });
    }
    return res.status(201).json({ message: "ROOM  DETAILS !", DATA: roomdata });
  } catch (err) {
    return res
      .status(201)
      .json({ message: "Room fetch error !", error: err.message });
  }
};

//  Update room

export const UpdateRoom = async (req, res) => {
  try {
    const { _id, RoomNumber, HostelBlock, Capacity, Occupancy } = req.body;

    if (!RoomName || !HostelBlock || !_id || !Capacity || !Occupancy) {
      return res.status(401).json({ message: "enter all fields !" });
    }

    const updatedRoom = await Room.findByIdAndUpdate(
      { _id },
      { RoomNumber, HostelBlock, Capacity, Occupancy },
      {
        new: true,
      }
    );

    if (!updatedRoom) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(200).json({
      message: "Room updated successfully",
      data: updatedRoom,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating room", error: error.message });
  }
};

export const DeleteRoom = async (req, res) => {
  try {
    const { _id } = req.body;
    if (!_id) {
      return res.status(401).json({ message: "ENTER ID !" });
    }

    const roomdata = await Room.findOneAndDelete({ _id });

    if (!roomdata) {
      return res.status(201).json({ message: "ROOM data is already empty!" });
    }
    return res
      .status(201)
      .json({ message: "ROOM deleted successfully !", DATA: roomdata });
  } catch (err) {
    return res
      .status(201)
      .json({ message: "Room delete error !", error: err.message });
  }
};
