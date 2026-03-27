import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  return (
    <div className="card product-card">
      <img src={product.image} alt={product.name} className="product-image" />
      <h3>{product.name}</h3>
      <p>{product.category}</p>
      <p>${product.price}</p>
      <div className="row">
        <Link className="btn" to={`/product/${product._id}`}>Details</Link>
        <button className="btn btn-primary" disabled={!user} onClick={() => addToCart(product._id, 1)}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}
export default ProductCard;