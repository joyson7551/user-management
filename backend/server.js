const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
dotenv.config();
const app = express();

//setup Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/")
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, `${uniqueSuffix}=${file.originalname}`)
  },
});

const upload = multer({ storage });

app.use(cors())
app.get("/", (req, res) => {
  res.send("server is up");
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//db connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("connected to DB"))
  .catch((err) => console.error(err));

//server connection
app.use("/admin", require("./routes/route.admin"));

// =================================
// app.use("/user", require("./routes/route.user"));
//aplying multer to user route
// Serve uploaded images as static files
app.use("/uploads", express.static("uploads"));
app.use("/user", upload.single("photo"), require("./routes/route.user"));
// ===================================
app.listen(process.env.PORT, () =>
  console.log(`server is running on Port: ${process.env.PORT}`)
);
