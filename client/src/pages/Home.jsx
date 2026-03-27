import { useEffect, useState } from "react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
function Home() {
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const fetchProducts = async () => {
    const res = await api.get(`/api/products?keyword=${keyword}&category=${category}`);
    setProducts(res.data.data);
  };
  useEffect(() => {
    fetchProducts();
  }, []);
  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };
  return (
    <div className="container">
      <form className="search-bar" onSubmit={handleSearch}>
        <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Search products" />
        <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" />
        <button className="btn btn-primary">Search</button>
      </form>
      <div className="grid">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default Home;