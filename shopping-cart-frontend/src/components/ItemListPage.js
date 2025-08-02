import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

export default function ItemListPage() {
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [orders, setOrders] = useState(() => {
    const savedOrders = localStorage.getItem("orders");
    return savedOrders ? JSON.parse(savedOrders) : [];
  });

  const [showOrders, setShowOrders] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [clickedBtnId, setClickedBtnId] = useState(null);

  const cartTotal = cart.reduce((total, item) => total + item.Price, 0);

  useEffect(() => {
    axios.get("http://localhost:8080/items")
      .then(res => setItems(res.data))
      .catch(err => console.error("Error loading items", err));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  const handleAddToCart = (item) => {
    setCart(prev => [...prev, item]);
    setClickedBtnId(item.ID);
    setTimeout(() => setClickedBtnId(null), 300);
    alert(`🛒 Added "${item.Name}" to cart`);
  };

  const handleCartClick = () => {
    if (cart.length === 0) {
      alert("Your cart is empty.");
    } else {
      const list = cart.map(i => `• ${i.Name} - ₹${i.Price}`).join("\n");
      alert(`🛒 Cart Items:\n${list}`);
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("Cart is empty.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:8080/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          item_ids: cart.map(item => item.ID),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to place order");
      }

      const result = await res.json();
      setOrders(prev => [...prev, result]);
      setCart([]);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error("Checkout error:", error);
      alert("❌ Checkout failed: " + error.message);
    }
  };

  const handleOrderHistory = () => {
    if (orders.length === 0) {
      alert("No previous orders.");
    } else {
      setShowOrders(true);
    }
  };

  return (
    <div style={styles.page}>
      <Navbar />

      <header style={styles.header}>
        <h2 style={styles.title}>🛍️ Available Items</h2>
        <div style={styles.actionGroup}>
          <p style={styles.total}>🧾 Total: ₹{cartTotal}</p>
          <button style={styles.actionBtn} onClick={handleCartClick}>View Cart</button>
          <button style={styles.actionBtn} onClick={handleCheckout}>Checkout</button>
          <button style={styles.actionBtn} onClick={handleOrderHistory}>Order History</button>
        </div>
      </header>

      {showSuccess && (
        <div style={styles.toast}>✅ Order placed successfully!</div>
      )}

      {showOrders && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3>📦 Your Orders</h3>
            <ul>
              {orders.map(order => (
                <li key={order.ID}>
                  <strong>Order #{order.ID}</strong> — {order.items?.length || "N/A"} item(s)
                </li>
              ))}
            </ul>
            <button style={styles.closeBtn} onClick={() => setShowOrders(false)}>Close</button>
          </div>
        </div>
      )}

      <div style={styles.grid}>
        {items.map(item => (
          <div key={item.ID} style={styles.card}>
            <div style={styles.imageBox}>
              <img src={`https://source.unsplash.com/300x200/?${item.Name}`} alt={item.Name} style={styles.image} />
            </div>
            <h3 style={styles.itemName}>{item.Name}</h3>
            <p style={styles.price}>₹{item.Price}</p>
            <button
              style={{
                ...styles.cartBtn,
                transform: clickedBtnId === item.ID ? "scale(1.08)" : "scale(1)",
                transition: "transform 0.2s ease",
              }}
              onClick={() => handleAddToCart(item)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: '20px',
    fontFamily: 'Segoe UI, sans-serif',
    backgroundColor: '#f5f7fa',
    minHeight: '100vh',
  },
  header: {
    marginBottom: 30,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  title: {
    fontSize: '1.8rem',
    color: '#333',
    marginBottom: '10px',
  },
  actionGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    alignItems: 'center',
  },
  total: {
    fontWeight: "bold",
    fontSize: "16px",
    color: "#333",
  },
  actionBtn: {
    padding: '10px 14px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08)',
    padding: 20,
    textAlign: 'center',
  },
  imageBox: {
    width: '100%',
    height: '160px',
    overflow: 'hidden',
    borderRadius: '8px',
    marginBottom: 12,
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  itemName: {
    fontSize: '18px',
    margin: '10px 0 6px',
  },
  price: {
    fontWeight: '600',
    fontSize: '16px',
    color: '#28a745',
  },
  cartBtn: {
    marginTop: 10,
    padding: '8px 16px',
    backgroundColor: '#ff5722',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  toast: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    backgroundColor: '#28a745',
    color: '#fff',
    padding: '12px 20px',
    borderRadius: '6px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    zIndex: 1000,
    fontWeight: '500',
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '30px 40px',
    borderRadius: '10px',
    maxWidth: '400px',
    width: '90%',
    boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
  },
  closeBtn: {
    marginTop: '20px',
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '8px 16px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};
