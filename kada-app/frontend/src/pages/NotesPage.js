import React, { useEffect, useState, useCallback } from "react";
import { API_CONFIG } from "../config/api";
import { styles } from "../styles/styles";
import NoteForm from "../components/Notes/NoteForm";
import NoteItem from "../components/Notes/NoteItem";
import Header from "../components/Layout/Header";

function NotesPage() {
  const [view, setView] = useState(localStorage.getItem("last view") || "home");
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState({ title: "", author: "", content: "" });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const currentApi = API_CONFIG[view];

  const tokenFais = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5YTUyOGEwMGM2ZTQ4NzNkNjRiMGVjMSIsInJvbGUiOiJGUkVFIiwiaWF0IjoxNzcyNjAyMDU5LCJleHAiOjE3NzI2ODg0NTl9.gLSd_yQTtEp6kXHF5NpnBBcVXql8fmJ3moz7jMepRRg';

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Sesi habis, silakan login kembali.");
        setNotes([]);
        return;
      }

      const res = await fetch(currentApi, {
        headers: { "Authorization": `Bearer ${view === 'home' ? token : tokenFais}` }
      });

      if (!res.ok) {
        const errorDetail = await res.text();
        console.error("Error:", errorDetail);

        setNotes([]);
        return;

      }

      const data = await res.json();
      setNotes(Array.isArray(data) ? data : []);
    } catch (err) {
      setNotes([]);
    } finally {
      setLoading(false);
    }
  }, [currentApi, view]);

  useEffect(() => {
    fetchNotes();
    setEditId(null);
    setFormData({ title: "", author: "", content: "" });
  }, [fetchNotes]);

  useEffect(() => {
    localStorage.setItem("lastView", view);
  }, [view]);

  //masih bingung
  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editId ? "PUT" : "POST";
    const cleanApiUrl = currentApi.endsWith('/') ? currentApi.slice(0, -1) : currentApi;
    const url = editId ? `${cleanApiUrl}/${editId}` : cleanApiUrl;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          title: formData.title,
          author: formData.author,
          content: formData.content
        }),
      });
      if (res.ok) {
        setFormData({ title: "", author: "", content: "" });
        setEditId(null);
        fetchNotes();
      } else {
        const errorData = await res.json();
        console.error("Backend Error Detail:", errorData);
        alert(`Gagal menyimpan: ${errorData.message || 'Cek console'}`);
      }
    } catch (err) { console.error("Fetch Error:", err); }
  };

  const deleteNote = async (id) => {
    if (!window.confirm(`Delete entry ${id}?`)) return;
    try {
      const url = `${currentApi.endsWith('/') ? currentApi : `${currentApi}/`}${id}`;
      await fetch(url, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      fetchNotes();
    } catch (err) { console.error(err); }
  };

  const handlePayment = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/payment/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          amount: 20000,
          first_name: "Nazwa",
          email: "nazwho@gmail.com"
        }),
      });

      const data = await response.json();
      if (data.token) {
        window.snap.pay(data.token, {
          onSuccess: (result) => alert("Pembayaran Berhasil!"),

        });
      }
    } catch (error) {
      console.error("Payment Error:", error);
    }
  };

  return (
    <div style={styles.container}>
      <Header
        view={view}
        setView={setView}
        title={view === "home" ? "📖 Nazwa's Notes" : "🤝 Faiz's Notes"}
        handlePayment={handlePayment}
      />

      <NoteForm
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        editId={editId}
      />

      <div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          notes.map((note) => (
            <NoteItem
              key={note._id || note.id}
              note={note}
              view={view}
              onEdit={() => {
                setEditId(view === "friends" ? note.id : note._id);
                setFormData({ title: note.title, author: note.author, content: note.content });
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              onDelete={() => deleteNote(view === "friends" ? note.id : note._id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default NotesPage;