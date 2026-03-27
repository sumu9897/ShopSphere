import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import api from "../api/axios";
function CartPage() {
  const { cart, updateCartItem, removeCartItem, fetchCart } = useCart();
  const navigate = useNavigate();
  const total = cart.items?.reduce((sum, item) => sum + item.product.price * item.quantity, 0) || 0;
  const placeOrder = async () => {
    await api.post("/api/orders", {
      shippingAddress: {
        address: "Demo Street 1",
        city: "Dhaka",
        postalCode: "1207",
        country: "Bangladesh"
      }
    });
    await fetchCart();
    navigate("/orders");
  };
  return (
    <div className="container">
      <h2>My Cart</h2>
      {cart.items?.length === 0 ? (
        <p>Your cart is empty. <Link to="/">Go shopping</Link></p>
      ) : (
        <>
          {cart.items.map((item) => (
            <div className="card cart-item" key={item.product._id}>
              <div>
                <h4>{item.product.name}</h4>
                <p>${item.product.price}</p>
              </div>
              <div className="row">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateCartItem(item.product._id, Number(e.target.value))}
                />
                <button className="btn btn-danger" onClick={() => removeCartItem(item.product._id)}>Remove</button>
              </div>
            </div>
          ))}
          <h3>Total: ${total.toFixed(2)}</h3>
          <button className="btn btn-primary" onClick={placeOrder}>Place Order</button>
        </>
      )}
    </div>
  );
}
export default CartPage;