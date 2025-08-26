const mongoose = require("mongoose");

const user = new mongoose.Schema({
  name: {
    required: true,
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
  photo: {
    type: String,
  },
});

module.exports = mongoose.model("users", user);
