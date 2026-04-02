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
  image: String,
  quantity: { type: Number, default: 0 }
});

app.post("/add-product", upload.single("image"), async (req, res) => {
  const qty = Number(req.body.quantity) || 0

  const product = await Product.create({
    name: req.body.name,
    price: Number(req.body.price) || 0,
    quantity: qty,
    image: req.file ? req.file.filename : null
  });
  res.json(product);
});

app.get("/getProducts", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.post("/reduce-quantity", async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    const product = await Product.findByIdAndUpdate(
      productId,
      { $inc: { quantity: -quantity } },
      { new: true }
    );
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to update quantity" });
  }
});

app.listen(3002, () => console.log("Product Service running"));