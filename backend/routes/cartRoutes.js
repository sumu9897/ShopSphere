const express = require("express");
const { getCart, addToCart, updateCartItem, removeCartItem } = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();
router.get("/", protect, getCart);
router.post("/add", protect, addToCart);
router.put("/update/:productId", protect, updateCartItem);
router.delete("/remove/:productId", protect, removeCartItem);
module.exports = router;