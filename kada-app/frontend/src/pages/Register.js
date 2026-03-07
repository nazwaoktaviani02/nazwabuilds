import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styles } from "../styles/styles";

const Register = () => {
  const [formData, setFormData] = useState({ 
    email: '', username: '', password: '', confirmPassword: '' 
  });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // 1. Password Length Verification (Min 8 chars)
    if (formData.password.length < 8) {
      return alert("Password must be at least 8 characters.");
    }

    // 2. Uppercase check (Standard security practice)
    if (!/[A-Z]/.test(formData.password)) {
      return alert("Password must contain at least one uppercase letter.");
    }

    // 3. Password Confirmation Match
    if (formData.password !== formData.confirmPassword) {
      return alert("Passwords do not match.");
    }

    try {
      const res = await fetch('http://localhost:5000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        alert("Registration success!");
        navigate('/login'); // Redirect to login form
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Register</h2>
        <form onSubmit={handleRegister} style={styles.form}> 
          <input type="email" placeholder="Email" required onChange={e => setFormData({ ...formData, email: e.target.value })}  style = {styles.input}/>
          <input type="text" placeholder="Username" required onChange={e => setFormData({ ...formData, username: e.target.value })} style = {styles.input}/>
          <input type="password" placeholder="Password" required onChange={e => setFormData({ ...formData, password: e.target.value })} style = {styles.input} />
          <input type="password" placeholder="Confirm Password" required onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })} style = {styles.input}/>
          <button type="submit" style={styles.saveBtn}>Register</button>
        </form>
        <p>Have an account? <a href="/login">Login here</a></p>
      </div>
    </div>
  );
};

export default Register;