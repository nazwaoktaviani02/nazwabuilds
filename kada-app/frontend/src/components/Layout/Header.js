import React from "react";
import { styles } from "../../styles/styles";
import { useNavigate } from "react-router-dom";

function Header({ view, setView, title, isPremium }) {
    const navigate = useNavigate();

    const handleSwitchView = (targetView) => {
        localStorage.setItem("lastView", targetView);

        if (window.location.pathname !== "/notes") {
            navigate("/notes");
        } else {
            if (setView) setView(targetView);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user"); // ✅ also clear user data on logout
        window.location.href = "/login";
    };

    const isLoggedIn = !!localStorage.getItem("token");

    return (
        <header style={styles.header}>
            <h1 style={styles.title}>{title}</h1>

            {isLoggedIn && (
                <div style={styles.nav}>
                    <button
                        style={view === "home" ? styles.activeTab : styles.tab}
                        onClick={() => handleSwitchView("home")}
                    >
                        Nazwa API
                    </button>

                    <button style={styles.delBtn} onClick={handleLogout}>Logout</button>

                    {/* ✅ PRO badge vs plain button — based on isPremium prop */}
                    {isPremium ? (
                        <button
                            onClick={() => navigate("/premium")}
                            style={{
                                ...styles.premiumBtn,
                                background: "linear-gradient(135deg, #f59e0b, #d97706)",
                                color: "#fff",
                                fontWeight: "bold",
                                border: "none",
                                borderRadius: "6px",
                                padding: "6px 14px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",
                            }}
                        >
                            💎 PRO
                        </button>
                    ) : (
                        <button
                            style={styles.premiumBtn}
                            onClick={() => navigate("/premium")}
                        >
                            Upgrade to Pro
                        </button>
                    )}
                </div>
            )}
        </header>
    );
}

export default Header;