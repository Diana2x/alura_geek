const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/alura-geek", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: String,
  imageUrl: String,
});

const Product = mongoose.model("Product", productSchema);

// Routes
app.post("/api/products", async (req, res) => {
  const { name, description, price, imageUrl } = req.body;
  const product = new Product({ name, description, price, imageUrl });
  await product.save();
  res.send(product);
});

app.get("/api/products", async (req, res) => {
  const products = await Product.find();
  res.send(products);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
