import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import api from "../api/axios";

function CartPage() {
  const { cart, updateCartItem, removeCartItem, fetchCart } = useCart();
  const navigate = useNavigate();

  const total =
    cart.items?.reduce((sum, item) => sum + item.product.price * item.quantity, 0) || 0;

  const placeOrder = async () => {
    await api.post("/api/orders", {
      shippingAddress: {
        address: "Demo Street 1",
        city: "Dhaka",
        postalCode: "1207",
        country: "Bangladesh",
      },
    });
    await fetchCart();
    navigate("/orders");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-black tracking-tight">
            My <span className="text-amber-400">Cart</span>
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            {cart.items?.length || 0} item{cart.items?.length !== 1 ? "s" : ""} in your cart
          </p>
        </div>

        {cart.items?.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-24 border border-dashed border-zinc-700 rounded-2xl">
            <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-white font-semibold text-lg">Your cart is empty</p>
            <p className="text-zinc-500 text-sm mt-1 mb-6">Looks like you haven't added anything yet.</p>
            <Link
              to="/"
              className="px-5 py-2.5 rounded-lg bg-amber-400 text-zinc-950 text-sm font-bold hover:bg-amber-300 transition-colors duration-200"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-3">
              {cart.items.map((item) => (
                <div
                  key={item.product._id}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center gap-4 hover:border-zinc-700 transition-colors duration-200"
                >
                  {/* Product Image */}
                  <div className="w-16 h-16 rounded-lg bg-zinc-800 border border-zinc-700 flex-shrink-0 overflow-hidden">
                    {item.product.image ? (
                      <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-white truncate">{item.product.name}</h4>
                    <p className="text-amber-400 text-sm font-bold mt-0.5">${item.product.price.toFixed(2)}</p>
                    <p className="text-zinc-500 text-xs mt-0.5">
                      Subtotal: <span className="text-zinc-300">${(item.product.price * item.quantity).toFixed(2)}</span>
                    </p>
                  </div>

                  {/* Quantity + Remove */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="flex items-center border border-zinc-700 rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateCartItem(item.product._id, Math.max(1, item.quantity - 1))}
                        className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="w-8 text-center text-sm font-semibold text-white bg-zinc-800 h-8 flex items-center justify-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartItem(item.product._id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                    <button
                      onClick={() => removeCartItem(item.product._id)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sticky top-24">
                <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-widest mb-5">Order Summary</h3>

                <div className="space-y-3 mb-5">
                  {cart.items.map((item) => (
                    <div key={item.product._id} className="flex justify-between text-sm">
                      <span className="text-zinc-400 truncate mr-2">{item.product.name} × {item.quantity}</span>
                      <span className="text-zinc-300 flex-shrink-0">${(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-zinc-800 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-300 font-semibold">Total</span>
                    <span className="text-amber-400 text-xl font-black">${total.toFixed(2)}</span>
                  </div>
                  <p className="text-zinc-600 text-xs mt-1">Shipping to Dhaka, Bangladesh</p>
                </div>

                <button
                  onClick={placeOrder}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-amber-400 text-zinc-950 font-bold hover:bg-amber-300 transition-colors duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Place Order
                </button>

                <Link
                  to="/"
                  className="mt-3 flex items-center justify-center gap-1.5 text-zinc-400 hover:text-white text-sm transition-colors duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartPage;