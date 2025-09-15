import DepartmentModel from "../MODELS/DepartmentModel.js";

export const AddDepartment = async (req, res) => {
  try {
    const { DepartmentName } = req.body;

    if (!DepartmentName) {
      return res.status(400).json({ message: "ENTER DEPARTMENT" });
    }

    let HodName;
    if (DepartmentName == "CSE") {
      HodName = "KG";
    } else if (DepartmentName == "SAH") {
      HodName = "PN";
    } else if (DepartmentName == "IT") {
      HodName = "DB";
    } else if (DepartmentName == "ECE") {
      HodName = "BK";
    } else if (DepartmentName == "EEE") {
      HodName = "MK";
    } else if (DepartmentName == "MECH") {
      HodName = "AK";
    } else if (DepartmentName == "AIDS") {
      HodName = "JK";
    }
    console.log(DepartmentName);
    console.log(HodName);

    const department = await new DepartmentModel({ DepartmentName, HodName });

    await department.save();

    return res.status(201).json({
      message: "Department added successfully :",
      department,
    });
  } catch (err) {
    return res
      .status(400)
      .json({ message: "Error on add department file", error: err });
  }
};

export const GetDepartments = async (req, res) => {
  try {
    const department = await DepartmentModel.find();

    if (!department) {
      return res.status(400).json({ message: "Nothing Department ....." });
    }

    return res
      .status(201)
      .json({ message: "Department details", data: department });
  } catch (err) {
    return res.status(401).json({ error: true, message: err.message });
  }
};

export const UpdateDepartment = async (req, res) => {
  try {
    const { _id, DepartmentName, HodName } = req.body;

    if (!_id) {
      return res.status(400).json({ message: "ENTER _id" });
    }

    if (!DepartmentName) {
      return res.status(400).json({ message: "ENTER DEPARTMENTNAME" });
    }

    if (!HodName) {
      return res.status(400).json({ message: "ENTER HOD NAME" });
    }

    const department = await DepartmentModel.findOneAndUpdate(
      { _id },
      { DepartmentName, HodName },
      { new: true }
    );

    if (!department) {
      return res.status(400).json({ message: "NO Department DETAILS ....." });
    }

    return res
      .status(201)
      .json({ message: "Department details", data: department });
  } catch (err) {
    return res.status(401).json({ error: true, message: err.message });
  }
};

export const DeleteDepartment = async (req, res) => {
  try {
    const { _id } = req.body;

    if (!_id) {
      return res.status(400).json({ message: "ENTER _id" });
    }

    const department = await DepartmentModel.findOneAndDelete({ _id });

    if (!department) {
      return res.status(400).json({ message: "NO Department DETAILS ....." });
    }

    return res
      .status(201)
      .json({ message: "Department details", data: department });
  } catch (err) {
    return res.status(401).json({ error: true, message: err.message });
  }
};
