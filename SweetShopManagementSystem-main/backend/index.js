const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;


mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));


const allowedOrigins = [
  "http://localhost:3000",
  "https://sweet-shop-frontend-7uj8.onrender.com"
];

app.use(express.json());
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));


app.use("/api/auth", require("./routes/auth"));
app.use("/api/sweets", require("./routes/sweets"));


app.get("/", (req, res) => res.send("Hello World!"));


app.listen(port, () => console.log(`Server is running on port ${port}`));
