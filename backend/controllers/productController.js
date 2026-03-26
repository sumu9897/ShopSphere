const Product = require("../models/Product");
exports.getProducts = async (req, res) => {
  const { keyword = "", category = "" } = req.query;
  const filter = {
    name: { $regex: keyword, $options: "i" }
  };
  if (category) filter.category = category;
  const products = await Product.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, count: products.length, data: products });
};
exports.getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }
  res.json({ success: true, data: product });
};
exports.createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, data: product });
};
exports.updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }
  res.json({ success: true, data: product });
};
exports.deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }
  res.json({ success: true, message: "Product deleted" });
};