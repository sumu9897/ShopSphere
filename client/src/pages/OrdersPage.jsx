import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

const STATUS_STYLES = {
  pending:    { dot: "bg-yellow-400", text: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/20" },
  processing: { dot: "bg-blue-400",   text: "text-blue-400",   bg: "bg-blue-400/10 border-blue-400/20" },
  shipped:    { dot: "bg-purple-400", text: "text-purple-400", bg: "bg-purple-400/10 border-purple-400/20" },
  delivered:  { dot: "bg-emerald-400",text: "text-emerald-400",bg: "bg-emerald-400/10 border-emerald-400/20" },
  cancelled:  { dot: "bg-red-400",    text: "text-red-400",    bg: "bg-red-400/10 border-red-400/20" },
};

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await api.get("/api/orders/my");
      setOrders(res.data.data);
      setLoading(false);
    };
    fetchOrders();
  }, []);

  const getStatus = (status = "pending") => STATUS_STYLES[status.toLowerCase()] || STATUS_STYLES.pending;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-black tracking-tight">
            My <span className="text-amber-400">Orders</span>
          </h1>
          <p className="text-zinc-400 text-sm mt-1">Track your order history and status.</p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 animate-pulse">
                <div className="flex justify-between mb-3">
                  <div className="h-4 bg-zinc-800 rounded w-32" />
                  <div className="h-5 bg-zinc-800 rounded w-20" />
                </div>
                <div className="h-3 bg-zinc-800 rounded w-24" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-24 border border-dashed border-zinc-700 rounded-2xl">
            <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-white font-semibold">No orders yet</p>
            <p className="text-zinc-500 text-sm mt-1 mb-6">Your order history will appear here.</p>
            <Link
              to="/"
              className="px-5 py-2.5 rounded-lg bg-amber-400 text-zinc-950 text-sm font-bold hover:bg-amber-300 transition-colors duration-200"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, idx) => {
              const s = getStatus(order.status);
              return (
                <div
                  key={order._id}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-colors duration-200"
                >
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                          Order #{orders.length - idx}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-600 font-mono">{order._id}</p>
                    </div>
                    <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold capitalize ${s.bg} ${s.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                      {order.status}
                    </span>
                  </div>

                  <div className="mt-4 pt-4 border-t border-zinc-800 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm">
                      <div>
                        <p className="text-zinc-500 text-xs mb-0.5">Total</p>
                        <p className="text-amber-400 font-bold">${Number(order.totalPrice).toFixed(2)}</p>
                      </div>
                      {order.createdAt && (
                        <div>
                          <p className="text-zinc-500 text-xs mb-0.5">Placed on</p>
                          <p className="text-zinc-300 text-xs">
                            {new Date(order.createdAt).toLocaleDateString("en-US", {
                              year: "numeric", month: "short", day: "numeric"
                            })}
                          </p>
                        </div>
                      )}
                    </div>
                    {order.orderItems?.length > 0 && (
                      <span className="text-zinc-500 text-xs">
                        {order.orderItems.length} item{order.orderItems.length !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrdersPage;