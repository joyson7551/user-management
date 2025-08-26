// const express = require("express");
// const Admin = require("../models/Admin");
// const bcrypt = require('bcrypt')
// const jwt = require('jsonwebtoken');
// const router = express.Router();

// //register an admin
// router.post("/register", async(req, res)=>{
// try {
//   const { email, password, username } = req.body;
  
//   if ((!email, !password, !username)) {
//       return res.status(400).json({
//         success: true,
//         message: "email, username and password are required to proceed",
//       });
//     }
//   const hashedPassword = await bcrypt.hash(password, 10);
//   const newAdmin = new Admin({email, password:hashedPassword, username})
//   const savedAdmin = await newAdmin.save();
  
  
//   res.status(200).json({
//       success: true,
//       message: "Admin added successfully",
//       data: {
//         create: savedAdmin,
//       },
//     });
  
// } catch (err) {
//   console.error("Error creating admin:", err);
//     res
//       .status(500)
//       .json({ sucess: false, message: err.message || "Internal server error, admin reg section" });
// }
// })


// //login
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const admin = await Admin.findOne({ email });
    
//     //verify admin 
//     console.log(admin);
//     if (!admin) return res.status(400).json({ message: "Invalid credentials" });

//     const isMatch = await bcrypt.compare(password, admin.password);
//     if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

//     const token = jwt.sign({ id: admin._id, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1h" });
//     res.json({ token });
//   } catch (err) {
//     res.status(500).json({ message: err.message || "Error logging in" });
//   }
// });

// module.exports = router;


//========================

// route.admin.js
const express = require("express");
const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Register an admin
router.post("/register", async (req, res) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({
        success: false,
        message: "Email, username, and password are required",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ email, password: hashedPassword, username });
    const savedAdmin = await newAdmin.save();

    res.status(201).json({
      success: true,
      message: "Admin added successfully",
      data: savedAdmin,
    });
  } catch (err) {
    console.error("Error creating admin:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
});

// Login as admin
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message || "Error logging in" });
  }
});

// Get all admins (Admin only)
router.get("/", async (req, res) => {
  try {
    const admins = await Admin.find();
    res.json(admins);
  } catch (err) {
    res.status(500).json({ message: err.message || "Error fetching admins" });
  }
});

// Get admin by ID
router.get("/:id", async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.json(admin);
  } catch (err) {
    res.status(500).json({ message: err.message || "Error fetching admin" });
  }
});

// Update admin by ID
router.put("/:id", async (req, res) => {
  try {
    const { name, email, username } = req.body;
    const updatedAdmin = await Admin.findByIdAndUpdate(
      req.params.id,
      { name, email, username },
      { new: true }
    );
    res.json({ message: "Admin updated successfully", admin: updatedAdmin });
  } catch (err) {
    res.status(500).json({ message: err.message || "Error updating admin" });
  }
});

// Delete admin by ID
router.delete("/:id", async (req, res) => {
  try {
    await Admin.findByIdAndDelete(req.params.id);
    res.json({ message: "Admin deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message || "Error deleting admin" });
  }
});

module.exports = router;