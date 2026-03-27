import { useEffect, useState } from "react";
import api from "../api/axios";
const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  stock: "",
  image: "",
  brand: ""
};
function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
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
      stock: Number(formData.stock)
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
      brand: product.brand
    });
  };
  const handleDelete = async (id) => {
    await api.delete(`/api/products/${id}`);
    fetchProducts();
  };
  return (
    <div className="container">
      <form className="card admin-form" onSubmit={handleSubmit}>
        <h2>{editingId ? "Edit Product" : "Add Product"}</h2>
        <input placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
        <input placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
        <input placeholder="Category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required />
        <input placeholder="Brand" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} />
        <input type="number" placeholder="Price" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
        <input type="number" placeholder="Stock" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} required />
        <input placeholder="Image URL" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} />
        <button className="btn btn-primary">{editingId ? "Update" : "Create"}</button>
      </form>
      {products.map((product) => (
        <div className="card" key={product._id}>
          <h3>{product.name}</h3>
          <p>${product.price} | Stock: {product.stock}</p>
          <div className="row">
            <button className="btn" onClick={() => handleEdit(product)}>Edit</button>
            <button className="btn btn-danger" onClick={() => handleDelete(product._id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
export default AdminProducts;