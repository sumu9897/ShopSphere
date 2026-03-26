const Cart = require("../models/Cart");
const Order = require("../models/Order");
exports.createOrder = async (req, res) => {
  const { shippingAddress } = req.body;
  const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ success: false, message: "Cart is empty" });
  }
  const orderItems = cart.items.map((item) => ({
    product: item.product._id,
    name: item.product.name,
    price: item.product.price,
    quantity: item.quantity
  }));
  const totalPrice = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const order = await Order.create({
    user: req.user._id,
    orderItems,
    shippingAddress,
    totalPrice
  });
  cart.items = [];
  await cart.save();
  res.status(201).json({ success: true, data: order });
};
exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, count: orders.length, data: orders });
};
exports.getAllOrders = async (req, res) => {
  const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
  res.json({ success: true, count: orders.length, data: orders });
};
exports.updateOrderStatus = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }
  order.status = req.body.status || order.status;
  await order.save();
  res.json({ success: true, data: order });
};