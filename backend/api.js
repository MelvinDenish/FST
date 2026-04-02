const express = require("express");
const cors = require("cors");
const proxy = require("express-http-proxy");

const app = express();

app.use(cors());
app.use(express.json());

/* USER SERVICE (3001) */
app.use("/uploads", express.static("uploads"));
app.use("/user", proxy("http://localhost:3001")
);
app.use("/product", proxy("http://localhost:3002"));

app.listen(3000, () => {
  console.log("Gateway running on port 3000");
});