const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");   // ✅ ADD THIS
require("dotenv").config();

const app = express();
app.use(cors());

/* ---------- CORS (MUST BE ON TOP) ---------- */
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://image-uploads-api-actm.onrender.com"
  ]
}));
/* ---------- Middleware ---------- */
app.use(express.json());

/* ---------- MongoDB Connection ---------- */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Atlas Connected Successfully");
  })
  .catch((error) => {
    console.log("MongoDB Connection Failed ❌");
    console.log(error.message);
  });

/* ---------- Routes ---------- */
const uploadRoutes = require("./routes/uploadRoutes");
app.use("/api", uploadRoutes);

/* ---------- Static Folder ---------- */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ---------- Test Route ---------- */
app.get("/", (req, res) => {
  res.send("Image Upload API Running");
});

/* ---------- Server ---------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
