import React from "react";

export default function Navbar() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>🛒 ShopCart</div>
      <ul style={styles.menu}>
        <li><a href="/" style={styles.link}>Home</a></li>
        <li><a href="/cart" style={styles.link}>Cart</a></li>
        <li><a href="/orders" style={styles.link}>Orders</a></li>
        <li><button onClick={handleLogout} style={styles.logoutBtn}>Logout</button></li>
      </ul>
    </nav>
  );
}

const styles = {
  nav: {
    backgroundColor: "#222",
    color: "#fff",
    padding: "10px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    fontSize: "20px",
    fontWeight: "bold",
  },
  menu: {
    listStyle: "none",
    display: "flex",
    gap: "20px",
    alignItems: "center",
    margin: 0,
    padding: 0,
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    fontWeight: 500,
  },
  logoutBtn: {
    backgroundColor: "#e74c3c",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: 500,
  },
};
