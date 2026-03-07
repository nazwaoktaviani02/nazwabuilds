import React from "react";
import { styles } from "../../styles/styles";

function NoteItem({ note, view, onEdit, onDelete }) {
  return (
    <div style={styles.noteCard}>
      <div style={styles.noteHeader}>
        <h3 style={{ margin: 0 }}>{note.title}</h3>
        <div style={styles.actions}>
          <button onClick={onEdit} style={styles.editBtn}>Edit</button>
          <button onClick={onDelete} style={styles.delBtn}>Delete</button>
        </div>
      </div>
      <p><strong>Author:</strong> {note.author}</p>
      <p>{note.content}</p>
    </div>
  );
}

export default NoteItem;