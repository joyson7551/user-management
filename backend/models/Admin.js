const mongoose = require("mongoose");

const admin = new mongoose.Schema({
  role: {
    required: true,
    type: String,
    default: "admin,",
  },
  name: {
    type: String,
  },
  email: {
    required: true,
    type: String,
    unique: true,
  },
  username: {
    required: true,
    type: String,
    unique: true,
  },
  password: {
    required: true,
    type: String,
  },
  photo: {
    type: String,
  },
});

module.exports = mongoose.model("admins", admin);
