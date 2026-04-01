const express = require("express");
const cors = require("cors");
const axios = require("axios");
const multer = require("multer");
const FormData = require("form-data");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 Serve images
app.use("/uploads", express.static("uploads"));

const upload = multer({ dest: "uploads/" });

/* ================= USER ================= */

// ✅ consistent lowercase
app.post("/register", async (req, res) => {
  const response = await axios.post("http://localhost:3001/register", req.body);
  res.json(response.data);
});

app.post("/login", async (req, res) => {
  const response = await axios.post("http://localhost:3001/login", req.body);
  res.json(response.data);
});

/* ================= PRODUCT ================= */

// ✅ Forward multer properly
app.post("/addProduct", upload.single("image"), async (req, res) => {
  try {
    const formData = new FormData();

    formData.append("name", req.body.name);
    formData.append("price", req.body.price);

    if (req.file) {
      formData.append("image", fs.createReadStream(req.file.path));
    }

    const response = await axios.post(
      "http://localhost:3002/add-product",
      formData,
      { headers: formData.getHeaders() }
    );

    res.json(response.data);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

app.get("/getProducts", async (req, res) => {
  const response = await axios.get("http://localhost:3002/getProducts");
  res.json(response.data);
});

app.listen(3000, () => console.log("API Gateway running on 3000"));