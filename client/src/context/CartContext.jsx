import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "./AuthContext";
const CartContext = createContext();
export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const fetchCart = async () => {
    if (!user) {
      setCart({ items: [] });
      return;
    }
    try {
      const res = await api.get("/api/cart");
      setCart(res.data.data);
    } catch {
      setCart({ items: [] });
    }
  };
  useEffect(() => {
    fetchCart();
  }, [user]);
  const addToCart = async (productId, quantity = 1) => {
    const res = await api.post("/api/cart/add", { productId, quantity });
    setCart(res.data.data);
  };
  const updateCartItem = async (productId, quantity) => {
    const res = await api.put(`/api/cart/update/${productId}`, { quantity });
    setCart(res.data.data);
  };
  const removeCartItem = async (productId) => {
    const res = await api.delete(`/api/cart/remove/${productId}`);
    setCart(res.data.data);
  };
  return (
    <CartContext.Provider value={{ cart, addToCart, updateCartItem, removeCartItem, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};
export const useCart = () => useContext(CartContext);