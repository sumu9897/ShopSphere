const Cart = require("../models/Cart");
const Product = require("../models/Product");
exports.getCart = async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }
  res.json({ success: true, data: cart });
};
exports.addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
  const existing = cart.items.find((item) => item.product.toString() === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity });
  }
  await cart.save();
  const populated = await Cart.findById(cart._id).populate("items.product");
  res.json({ success: true, data: populated });
};
exports.updateCartItem = async (req, res) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return res.status(404).json({ success: false, message: "Cart not found" });
  }
  const item = cart.items.find((i) => i.product.toString() === req.params.productId);
  if (!item) {
    return res.status(404).json({ success: false, message: "Cart item not found" });
  }
  item.quantity = quantity;
  cart.items = cart.items.filter((i) => i.quantity > 0);
  await cart.save();
  const populated = await Cart.findById(cart._id).populate("items.product");
  res.json({ success: true, data: populated });
};
exports.removeCartItem = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return res.status(404).json({ success: false, message: "Cart not found" });
  }
  cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
  await cart.save();
  const populated = await Cart.findById(cart._id).populate("items.product");
  res.json({ success: true, data: populated });
};