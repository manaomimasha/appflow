import React, { useEffect, useState } from "react";
import { database } from "../../firebase/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const CrearNota = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [noteId, setNoteId] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState([]);
  const [userId, setUserId] = useState(null);

  const auth = getAuth();

  // Detectar usuario autenticado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUserId(user.uid);
      else setUserId(null);
    });
    return () => unsubscribe();
  }, [auth]);

  // Obtener notas del usuario
  useEffect(() => {
    if (userId) {
      const fetchNotes = async () => {
        const userCollection = collection(database, `users/${userId}/notes`);
        const dbNotes = await getDocs(userCollection);
        setNotes(
          dbNotes.docs.map((doc) => ({ ...doc.data(), id: doc.id })).reverse()
        );
      };
      fetchNotes();
    }
  }, [userId]);

  // Crear nueva nota
  const handleCreateNote = async () => {
    if (userId && title.trim() && description.trim()) {
      const userCollection = collection(database, `users/${userId}/notes`);
      const newDoc = await addDoc(userCollection, {
        title,
        description,
      });
      setNotes((prev) => [
        { id: newDoc.id, title, description },
        ...prev,
      ]);
      setTitle("");
      setDescription("");
    }
  };

  // Editar una nota existente
  const handleEditNote = async () => {
    if (userId && noteId && title.trim() && description.trim()) {
      const noteDoc = doc(database, `users/${userId}/notes`, noteId);
      await updateDoc(noteDoc, { title, description });
      setNotes((prev) =>
        prev.map((note) =>
          note.id === noteId ? { ...note, title, description } : note
        )
      );
      setTitle("");
      setDescription("");
      setNoteId("");
      setIsEditing(false);
    }
  };

  // Eliminar nota
  const handleDeleteNote = async (id) => {
    if (userId) {
      const noteDoc = doc(database, `users/${userId}/notes`, id);
      await deleteDoc(noteDoc);
      setNotes((prev) => prev.filter((note) => note.id !== id));
    }
  };

  // Configurar para editar una nota
  const setupEditNote = (id, title, description) => {
    setTitle(title);
    setDescription(description);
    setNoteId(id);
    setIsEditing(true);
  };

  return (
    <div className="container mx-auto p-4">
      {userId ? (
        <>
          {/* Formulario para Crear/Editar Nota */}
          <div className="bg-white p-4 rounded shadow mb-4">
            <h2 className="text-2xl font-bold mb-4">
              {isEditing ? "Editar Nota" : "Crear Nota"}
            </h2>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 mb-3 border rounded-lg"
              placeholder="Título"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 mb-3 border rounded-lg"
              placeholder="Descripción"
            />
            <button
              onClick={isEditing ? handleEditNote : handleCreateNote}
              className={`w-full px-4 py-2 rounded ${
                isEditing
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white`}
            >
              {isEditing ? "Actualizar Nota" : "Crear Nota"}
            </button>
          </div>

          {/* Lista de Notas */}
          <div className="grid gap-4">
            {notes.map((note) => (
              <div
                key={note.id}
                className="bg-gray-100 p-4 rounded shadow flex justify-between items-center"
              >
                <div>
                  <h3 className="text-lg font-semibold">{note.title}</h3>
                  <p className="text-gray-600">{note.description}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() =>
                      setupEditNote(note.id, note.title, note.description)
                    }
                    className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="text-center text-red-500">
          Por favor, inicia sesión para gestionar tus notas.
        </p>
      )}
    </div>
  );
};

export default CrearNota;
