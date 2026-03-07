import React from "react";
import { styles } from "../../styles/styles";

function NoteForm({ formData, setFormData, handleSubmit, editId }) {
  return (
    <div style={styles.card}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input placeholder="Title" style={styles.input} value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
        <input placeholder="Author" style={styles.input} value={formData.author} onChange={e => setFormData({ ...formData, author: e.target.value })} />
        <textarea placeholder="Content" style={{ ...styles.input, height: "80px" }} value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} />
        <button type="submit" style={styles.saveBtn}>{editId ? "Update" : "Create"}</button>
      </form>
    </div>
  );
}
export default NoteForm;