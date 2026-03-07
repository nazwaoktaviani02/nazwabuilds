import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles/styles";
import Header from "../components/Layout/Header";

function PremiumPage() {
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");

  // ── Pull real user data from localStorage (saved at login) ──
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const [isPremium, setIsPremium] = useState(storedUser.isPremium || false);
  const amount = 20000; // Fixed price — not user-editable
  const name = storedUser.username || "Customer";
  const email = storedUser.email || "";

  // ── On mount: clear leaked orderId from previous session ──
  useEffect(() => {
    setPaymentStatus("");
    localStorage.removeItem("activeOrderId");
    console.log("Premium Page loaded: Security reset complete.");
  }, []);

  const handlePayment = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/payment/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ amount, first_name: name, email }),
      });

      const data = await response.json();
      if (data.order_id) {
        setOrderId(data.order_id);
        localStorage.setItem("activeOrderId", data.order_id);

        window.snap.pay(data.token, {
          onSuccess: (result) => {
            setPaymentStatus("Pembayaran sukses!");
            checkStatus(data.order_id); // pass ID directly to avoid stale state
          },
          onPending: () => setPaymentStatus("Menunggu pembayaran..."),
          onError: () => setPaymentStatus("Pembayaran gagal!"),
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const checkStatus = async (manualId) => {
    const idToQuery = manualId || orderId || localStorage.getItem("activeOrderId");

    if (!idToQuery) {
      alert("Belum ada transaksi. Silahkan klik Bayar dulu.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/payment/status/${idToQuery}`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });

      const data = await res.json();
      setPaymentStatus(data.transaction_status);

      if (data.transaction_status === "settlement") {
        const upgradeRes = await fetch("http://localhost:5000/auth/upgrade", {
          method: "PUT",
          headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        });

        if (upgradeRes.ok) {
          // ✅ Persist isPremium in localStorage so refresh doesn't lose it
          const updatedUser = { ...storedUser, isPremium: true };
          localStorage.setItem("user", JSON.stringify(updatedUser));

          // ✅ Update state so UI re-renders immediately
          setIsPremium(true);
          localStorage.removeItem("activeOrderId");
          alert("Success! Your account is now Premium forever. 🚀");
        }
      } else {
        alert(`Status: ${data.transaction_status}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div style={styles.container}>
      <Header view="premium" title="Premium Feature" isPremium={isPremium} />
      <div style={{ padding: "20px", textAlign: "left" }}>

        {/* ✅ Show one block or the other — never both */}
        {isPremium ? (
          // ── Already Premium ──────────────────────────────────────
          <div style={{ textAlign: "center", padding: "40px" }}>
            <h1 style={{ fontSize: "60px" }}>💎</h1>
            <h2>You are a Pro Member!</h2>
            <p>Enjoy unlimited notes and all premium features.</p>
            <button style={styles.premiumBtn} onClick={() => navigate("/notes")}>
              Go to My Notes
            </button>
          </div>
        ) : (
          // ── Not Yet Premium: Show Pricing Card ───────────────────
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
            maxWidth: "340px",
            margin: "40px auto",
            padding: "32px",
            borderRadius: "16px",
            border: "2px solid #4f46e5",
            boxShadow: "0 8px 24px rgba(79,70,229,0.15)",
            background: "#fff"
          }}>
            <h1 style={{ fontSize: "48px", margin: 0 }}>⚡</h1>
            <h2 style={{ margin: 0, color: "#4f46e5" }}>Upgrade to Pro</h2>
            <p style={{ textAlign: "center", color: "#555", marginTop: 0 }}>
              Unlock unlimited notes, priority support, and more.
            </p>

            {/* Fixed price display — not editable */}
            <div style={{ fontSize: "32px", fontWeight: "bold", color: "#1e1b4b" }}>
              Rp {Number(amount).toLocaleString("id-ID")}
            </div>
            <p style={{ color: "#888", marginTop: "-8px", fontSize: "13px" }}>
              One-time payment · Forever
            </p>

            <ul style={{ textAlign: "left", color: "#444", lineHeight: "1.8", paddingLeft: "20px" }}>
              <li>✅ Unlimited notes</li>
              <li>✅ Priority support</li>
              <li>✅ Premium badge</li>
              <li>✅ Early access to new features</li>
            </ul>

            <button
              onClick={handlePayment}
              style={{
                width: "100%",
                padding: "12px",
                background: "#4f46e5",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              Pay Now — Rp {Number(amount).toLocaleString("id-ID")}
            </button>

            <button
              onClick={() => checkStatus()}
              style={{
                background: "none",
                border: "none",
                color: "#4f46e5",
                cursor: "pointer",
                fontSize: "13px",
                textDecoration: "underline"
              }}
            >
              Already paid? Check status
            </button>

            {paymentStatus && (
              <p style={{ color: "#4f46e5", fontWeight: "bold", margin: 0 }}>
                Status: {paymentStatus}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PremiumPage;