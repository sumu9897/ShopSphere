import { useEffect, useState } from "react";
import api from "../api/axios";
function OrdersPage() {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    const fetchOrders = async () => {
      const res = await api.get("/api/orders/my");
      setOrders(res.data.data);
    };
    fetchOrders();
  }, []);
  return (
    <div className="container">
      <h2>My Orders</h2>
      {orders.map((order) => (
        <div className="card" key={order._id}>
          <p><strong>Order ID:</strong> {order._id}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Total:</strong> ${order.totalPrice}</p>
        </div>
      ))}
    </div>
  );
}
export default OrdersPage;