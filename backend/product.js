const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 serve images
app.use("/uploads", express.static("uploads"));

mongoose.connect("mongodb://127.0.0.1/productDB");

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname)
});

const upload = multer({ storage });

const Product = mongoose.model("Product", {
  name: String,
  price: Number,
  image: String
});

app.post("/add-product", upload.single("image"), async (req, res) => {
  const product = await Product.create({
    name: req.body.name,
    price: req.body.price,
    image: req.file ? req.file.filename : null
  });
  res.json(product);
});

app.get("/getProducts", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.listen(3002, () => console.log("Product Service running"));