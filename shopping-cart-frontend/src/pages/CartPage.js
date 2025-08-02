import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);

  const cartTotal = cartItems.reduce((total, item) => total + item.Price, 0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first.");
      window.location.href = "/login";
      return;
    }

    axios.get("http://localhost:8080/carts", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => setCartItems(res.data))
      .catch(err => {
        console.error("Error loading cart", err);
        alert("⚠️ Could not load cart.");
      });
  }, []);

  return (
    <div style={styles.page}>
      <Navbar />
      <h2 style={styles.heading}>🛒 Your Cart</h2>

      {cartItems.length === 0 ? (
        <p style={styles.empty}>Cart is empty.</p>
      ) : (
        <>
          <ul style={styles.list}>
            {cartItems.map((item, idx) => (
              <li key={idx} style={styles.card}>
                <strong>{item.Name}</strong> — ₹{item.Price}
              </li>
            ))}
          </ul>
          <p style={styles.total}>Total: ₹{cartTotal}</p>
        </>
      )}
    </div>
  );
}

const styles = {
  page: {
    padding: "20px",
    fontFamily: "Segoe UI, sans-serif",
    backgroundColor: "#f2f5f9",
    minHeight: "100vh",
  },
  heading: {
    fontSize: "1.8rem",
    marginBottom: "20px",
    color: "#333",
  },
  empty: {
    fontSize: "1.2rem",
    color: "#777",
  },
  list: {
    listStyle: "none",
    padding: 0,
    marginBottom: "20px",
  },
  card: {
    backgroundColor: "#fff",
    padding: "12px 18px",
    borderRadius: "8px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    marginBottom: "10px",
  },
  total: {
    fontWeight: "bold",
    fontSize: "1.2rem",
    color: "#28a745",
  },
};
