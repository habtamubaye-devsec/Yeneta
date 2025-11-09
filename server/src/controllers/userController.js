import User from "../models/userModel.js";

// GET /api/users (admin or super admin only)
export const getAllUsers = async (req, res) => {
  try {
    let query = {};

    // If the requester is an admin, limit visible roles
    if (req.user.role === "admin") {
      query = { role: { $in: ["student", "instructor"] } };
    }

    // If the requester is a super admin, show everyone (including admins & super admins)
    // No filter needed — query remains {}

    const users = await User.find(query).select("-password");
    res.json({ success: true,  users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// GET /api/users/current
export const getCurrentUser = async (req, res) => {
  try {
    res.json({ success: true, data: req.user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/users/current
export const updateCurrentUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name && !email) {
      return res.status(400).json({ success: false, message: "No data to update" });
    }

    if (name) req.user.name = name;
    if (email) req.user.email = email;

    await req.user.save();
    res.json({ success: true, data: req.user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/users/:id/role  (admin only)
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!["user", "instructor", "admin", "superadmin"].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.role = role;
    await user.save();

    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

//Update User Status (admin only)
export const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["active", "banned"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.status = status;
    await user.save();

    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/users/:id  (admin only)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    await User.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/users/:id
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
