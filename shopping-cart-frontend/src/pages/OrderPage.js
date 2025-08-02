import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";

export default function OrderPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first.");
      window.location.href = "/login";
      return;
    }

    axios.get("http://localhost:8080/orders", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => setOrders(res.data))
      .catch(err => {
        console.error("Order fetch error", err);
        alert("⚠️ Could not load orders.");
      });
  }, []);

  return (
    <div style={styles.page}>
      <Navbar />
      <h2 style={styles.title}>📦 Your Orders</h2>
      {orders.length === 0 ? (
        <p style={styles.empty}>No orders placed yet.</p>
      ) : (
        <div style={styles.orderList}>
          {orders.map((order, idx) => (
            <div key={order.ID || idx} style={styles.orderCard}>
              <h3>Order #{order.ID}</h3>
              <ul style={styles.itemList}>
                {order.Items?.map((item) => (
                  <li key={item.ID}>
                    {item.Name} — ₹{item.Price}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    padding: "20px",
    fontFamily: "Segoe UI, sans-serif",
    backgroundColor: "#f5f7fa",
    minHeight: "100vh",
  },
  title: {
    fontSize: "1.8rem",
    color: "#333",
    marginBottom: "20px",
  },
  empty: {
    fontSize: "1.1rem",
    color: "#777",
  },
  orderList: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  orderCard: {
    backgroundColor: "#fff",
    padding: "18px",
    borderRadius: "10px",
    boxShadow: "0 3px 12px rgba(0, 0, 0, 0.1)",
  },
  itemList: {
    marginTop: "10px",
    paddingLeft: "20px",
  },
};
