import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await api.get(`/api/products/${id}`);
      setProduct(res.data.data);
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    await addToCart(product._id, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (!product) return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <svg className="w-8 h-8 text-amber-400 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <p className="text-zinc-400 text-sm">Loading product...</p>
      </div>
    </div>
  );

  const stockStatus =
    product.stock > 10 ? { label: "In Stock", color: "text-emerald-400", dot: "bg-emerald-400" }
    : product.stock > 0  ? { label: `Only ${product.stock} left`, color: "text-yellow-400", dot: "bg-yellow-400" }
    : { label: "Out of Stock", color: "text-red-400", dot: "bg-red-400" };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-zinc-500 mb-8">
          <Link to="/" className="hover:text-amber-400 transition-colors">Home</Link>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-zinc-400 truncate">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* Image */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden aspect-square flex items-center justify-center">
            {product.image ? (
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-3 text-zinc-600">
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm">No image available</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">

            {/* Category & Brand */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              {product.category && (
                <span className="px-2.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-semibold">
                  {product.category}
                </span>
              )}
              {product.brand && (
                <span className="px-2.5 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400 text-xs">
                  {product.brand}
                </span>
              )}
            </div>

            <h1 className="text-2xl font-black text-white leading-tight mb-3">{product.name}</h1>

            {/* Price */}
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-3xl font-black text-amber-400">${Number(product.price).toFixed(2)}</span>
            </div>

            {/* Stock Badge */}
            <div className="flex items-center gap-2 mb-5">
              <span className={`w-2 h-2 rounded-full ${stockStatus.dot}`} />
              <span className={`text-sm font-medium ${stockStatus.color}`}>{stockStatus.label}</span>
            </div>

            {/* Description */}
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">{product.description}</p>

            {/* Divider */}
            <div className="border-t border-zinc-800 mb-5" />

            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center border border-zinc-700 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="w-12 text-center text-sm font-bold text-white bg-zinc-800 h-10 flex items-center justify-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                  className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>

              <button
                disabled={!user || product.stock === 0}
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold text-sm transition-all duration-200 ${
                  added
                    ? "bg-emerald-400 text-zinc-950"
                    : !user || product.stock === 0
                    ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700"
                    : "bg-amber-400 text-zinc-950 hover:bg-amber-300"
                }`}
              >
                {added ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {!user ? "Login to Add to Cart" : product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                  </>
                )}
              </button>
            </div>

            {!user && (
              <p className="text-zinc-500 text-xs text-center">
                <Link to="/login" className="text-amber-400 hover:text-amber-300 transition-colors">Sign in</Link> to add items to your cart.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;