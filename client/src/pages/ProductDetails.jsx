import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();
  const { user } = useAuth();
  useEffect(() => {
    const fetchProduct = async () => {
      const res = await api.get(`/api/products/${id}`);
      setProduct(res.data.data);
    };
    fetchProduct();
  }, [id]);
  if (!product) return <p className="center">Loading...</p>;
  return (
    <div className="container details-page">
      <img src={product.image} alt={product.name} className="details-image" />
      <div>
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <p><strong>Category:</strong> {product.category}</p>
        <p><strong>Brand:</strong> {product.brand}</p>
        <p><strong>Stock:</strong> {product.stock}</p>
        <h3>${product.price}</h3>
        <button className="btn btn-primary" disabled={!user} onClick={() => addToCart(product._id, 1)}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}
export default ProductDetails;