const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const { default: mongoose } = require("mongoose");

// Add a user (Admin only)
router.post("/", authMiddleware, async (req, res) => {
  if (req.role !== "admin") {
    return res.status(403).json({ message: "Only admins can add users" });
  }

  try {
    //Access uploaded file via req.file
    const { name, email, username } = req.body;
    const photoPath = req.file ? req.file.filename : null;

    const newUser = new User({ name, email, username, photo: photoPath });
    await newUser.save();

    res.status(201).json({ message: "User added successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Error adding user" });
  }
});

// Get all users (Admin only)
router.get("/", authMiddleware, async (req, res) => {
  if (req.role !== "admin") {
    return res.status(403).json({ message: "Only admins can view users" });
  }

  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.mesage || "Error fetching users" });
  }
});

//get user by id
router.get("/:id", authMiddleware, async (req, res) => {
  if (req.role !== "admin") {
    return res.status(403).json({ message: "Only admins can view users" });
  }

  try {
    const { id } = req.params;

    // Validate that the provided ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message || "Error fetching user" });
  }
});

// Update a user (Admin only)
router.put("/:id", authMiddleware, async (req, res) => {
  if (req.role !== "admin") {
    return res.status(403).json({ message: "Only admins can update users" });
  }

  try {
    const { name, email, username } = req.body;
    const photoPath = req.file ? req.file.filename : undefined;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, username, ...(photoPath && { photo: photoPath }) },
      { new: true }
    );
    
    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message || "Error updating user" });
  }
});

// Delete a user (Admin only)
router.delete("/:id", authMiddleware, async (req, res) => {
  if (req.role !== "admin") {
    return res.status(403).json({ message: "Only admins can delete users" });
  }

  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
});

//======== authorization not used=====not in use, possibly break the whole thing=====

// router.post("/", async (req, res) => {
//   const { name, email, username, photo } = req.body;
//   if ((!name, !email, !username)) {
//     return res.status(400).json({
//       success: true,
//       message: "name, email and username are required to proceed",
//     });
//   }
//   try {
//     const newUser = new User({ name, email, username, photo });
//     const savedUser = await newUser.save();

//     res.status(201).json({
//       success: true,
//       message: "User Added successfully",
//     });
//   } catch (err) {
//     if (err.code === 11000) {
//       return res.status(400).json({
//         success: false,
//         message: "Email or username already exists",
//       });
//     }
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: err.message,
//     });
//   }
// });

module.exports = router;
