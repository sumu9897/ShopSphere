import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };
  return (
    <nav className="navbar">
      <Link to="/" className="logo">ShopSphere</Link>
      <div className="nav-links">
        <Link to="/cart">Cart ({cart?.items?.length || 0})</Link>
        {user ? (
          <>
            <Link to="/orders">My Orders</Link>
            {user.role === "admin" && <Link to="/admin/products">Admin</Link>}
            <span>{user.name}</span>
            <button className="btn" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
export default Navbar;