import React, { useState } from "react";
import { API_CONFIG } from "../config/api";
import { styles } from "../styles/styles";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_CONFIG.auth}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (res.ok) {
        // ✅ Only save to localStorage if login actually succeeded
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user)); // saves { id, username, isPremium }
        window.location.href = "/notes";
      } else {
        alert(data.message || data.error || "Invalid username or password.");
      }
    } catch (err) {
      alert("Server error. Make sure your backend is running.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Login</h2>
        <form onSubmit={handleLogin} style={styles.form}>
          <input style={styles.input} placeholder="Username" onChange={e => setUsername(e.target.value)} required />
          <input style={styles.input} type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required />
          <button style={styles.saveBtn} type="submit">Login</button>
        </form>
        <p>Don't have an account? <a href="/register">Register here</a></p>
      </div>
    </div>
  );
}

export default Login;