const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendToken = (res, user) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
};
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ success: false, message: "User already exists" });
  }
  const user = await User.create({ name, email, password });
  sendToken(res, user);
  res.status(201).json({
    success: true,
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
  });
};
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }
  sendToken(res, user);
  res.json({
    success: true,
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
  });
};
exports.logout = async (req, res) => {
  res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
  res.json({ success: true, message: "Logged out" });
};
exports.me = async (req, res) => {
  res.json({ success: true, user: req.user });
};