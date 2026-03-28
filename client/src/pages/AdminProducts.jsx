import { useEffect, useState } from "react";
import api from "../api/axios";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  stock: "",
  image: "",
  brand: "",
};

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchProducts = async () => {
    const res = await api.get("/api/products");
    setProducts(res.data.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
    };
    if (editingId) {
      await api.put(`/api/products/${editingId}`, payload);
    } else {
      await api.post("/api/products", payload);
    }
    setFormData(emptyForm);
    setEditingId(null);
    fetchProducts();
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      image: product.image,
      brand: product.brand,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    await api.delete(`/api/products/${id}`);
    setDeletingId(null);
    fetchProducts();
  };

  const handleCancel = () => {
    setFormData(emptyForm);
    setEditingId(null);
  };

  const inputClass =
    "w-full px-3 py-2.5 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all duration-200";

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-black tracking-tight">
            Admin <span className="text-amber-400">Products</span>
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Manage your product catalog — add, edit, or remove listings.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

          {/* ── Form Panel ── */}
          <div className="xl:col-span-1">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sticky top-24">

              {/* Form Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${editingId ? "bg-amber-400/10 border border-amber-400/30" : "bg-zinc-800"}`}>
                  {editingId ? (
                    <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  )}
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">
                    {editingId ? "Edit Product" : "Add New Product"}
                  </h2>
                  <p className="text-xs text-zinc-500">
                    {editingId ? "Update the fields below" : "Fill in product details"}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Name */}
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Product Name *</label>
                  <input
                    className={inputClass}
                    placeholder="e.g. Wireless Headphones"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Description *</label>
                  <textarea
                    className={`${inputClass} resize-none h-20`}
                    placeholder="Short product description..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>

                {/* Category & Brand */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Category *</label>
                    <input
                      className={inputClass}
                      placeholder="Electronics"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Brand</label>
                    <input
                      className={inputClass}
                      placeholder="Sony"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    />
                  </div>
                </div>

                {/* Price & Stock */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Price ($) *</label>
                    <input
                      type="number"
                      className={inputClass}
                      placeholder="0.00"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Stock *</label>
                    <input
                      type="number"
                      className={inputClass}
                      placeholder="0"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Image URL</label>
                  <input
                    className={inputClass}
                    placeholder="https://example.com/image.jpg"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-amber-400 text-zinc-950 text-sm font-bold hover:bg-amber-300 transition-colors duration-200"
                  >
                    {editingId ? (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Update Product
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create Product
                      </>
                    )}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-4 py-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 text-sm font-medium hover:bg-zinc-700 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* ── Products List ── */}
          <div className="xl:col-span-2">

            {/* List Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-widest">
                All Products
              </h2>
              <span className="px-2.5 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-xs font-semibold text-zinc-400">
                {products.length} items
              </span>
            </div>

            {products.length === 0 ? (
              /* Empty State */
              <div className="flex flex-col items-center justify-center py-20 border border-dashed border-zinc-700 rounded-2xl">
                <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <p className="text-zinc-400 text-sm font-medium">No products yet</p>
                <p className="text-zinc-600 text-xs mt-1">Add your first product using the form.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {products.map((product) => (
                  <div
                    key={product._id}
                    className={`group bg-zinc-900 border rounded-xl p-4 flex items-center gap-4 transition-all duration-200 hover:border-zinc-600 ${
                      editingId === product._id
                        ? "border-amber-400/50 bg-amber-400/5"
                        : "border-zinc-800"
                    }`}
                  >
                    {/* Product Image / Placeholder */}
                    <div className="w-14 h-14 rounded-lg bg-zinc-800 border border-zinc-700 flex-shrink-0 overflow-hidden">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.style.display = "none"; }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 flex-wrap">
                        <h3 className="text-sm font-semibold text-white truncate">
                          {product.name}
                        </h3>
                        {product.brand && (
                          <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 text-xs border border-zinc-700 flex-shrink-0">
                            {product.brand}
                          </span>
                        )}
                        {product.category && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-400 text-xs border border-amber-400/20 flex-shrink-0">
                            {product.category}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-1.5">
                        <span className="text-amber-400 text-sm font-bold">
                          ${Number(product.price).toFixed(2)}
                        </span>
                        <span className={`flex items-center gap-1 text-xs font-medium ${
                          product.stock > 10
                            ? "text-emerald-400"
                            : product.stock > 0
                            ? "text-yellow-400"
                            : "text-red-400"
                        }`}>
                          <span className={`inline-block w-1.5 h-1.5 rounded-full ${
                            product.stock > 10
                              ? "bg-emerald-400"
                              : product.stock > 0
                              ? "bg-yellow-400"
                              : "bg-red-400"
                          }`} />
                          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleEdit(product)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 text-xs font-medium transition-all duration-200"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        disabled={deletingId === product._id}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-400/10 border border-red-400/20 text-red-400 hover:bg-red-400/20 hover:border-red-400/40 text-xs font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deletingId === product._id ? (
                          <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                        ) : (
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        )}
                        {deletingId === product._id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminProducts;