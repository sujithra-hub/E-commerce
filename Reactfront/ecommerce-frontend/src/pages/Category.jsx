import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../services/categoryService";
import {
  FaLaptop,
  FaTshirt,
  FaBook,
  FaFootballBall,
  FaFemale,
  FaHome
} from "react-icons/fa";

import "./CategoryPage.css";

function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load categories ❌");
    }
  };

  const handleClick = (id) => {
    navigate(`/products/${id}`);
  };

  // icon mapping
  const getIcon = (name) => {
    const n = name.toLowerCase();
    if (n.includes("electronic")) return <FaLaptop />;
    if (n.includes("cloth") || n.includes("fashion")) return <FaTshirt />;
    if (n.includes("book")) return <FaBook />;
    if (n.includes("sport")) return <FaFootballBall />;
    if (n.includes("beauty")) return <FaFemale />;
    if (n.includes("home")) return <FaHome />;
    return <FaLaptop />;
  };

  return (
    <div className="category-page">

      {/* Header */}
      <div className="category-hero">
        <h1>Explore Categories</h1>
        <p>Find products across all your favorite sections</p>
      </div>

      {/* Grid */}
      <div className="category-grid">
        {categories.length === 0 ? (
          <p>No categories found</p>
        ) : (
          categories.map((cat) => (
            <div
              key={cat.id}
              className="category-card"
              onClick={() => handleClick(cat.id)}
            >
              <div className="icon-box">
                {getIcon(cat.name)}
              </div>
              <h3>{cat.name}</h3>
              <p>Shop now →</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CategoryPage;