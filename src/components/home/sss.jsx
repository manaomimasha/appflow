import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import CalendarComponent from "./CalendarComponent";
import TasksComponent from "./TasksComponent";
import NotesComponent from "./NotesComponent";

function App() {


    const [tasks, setTasks] = useState([]);
    const [notes, setNotes] = useState([]);
    const [newTask, setNewTask] = useState("");
    const [taskCategory, setTaskCategory] = useState("Urgente");
    const [newNoteTitle, setNewNoteTitle] = useState("");
    const [newNoteDescription, setNewNoteDescription] = useState("");
    const [noteCategory, setNoteCategory] = useState("Urgente");
    const [editingNoteId, setEditingNoteId] = useState(null);

    const categories = ["Urgente", "Tarea semanal", "Algún día/Tal vez"];

    // Función para obtener datos de Firestore
    const fetchTasks = async () => {
        const tasksSnapshot = await getDocs(collection(db, "tasks"));
        const tasksData = tasksSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setTasks(tasksData);
    };

    const fetchNotes = async () => {
        const notesSnapshot = await getDocs(collection(db, "notes"));
        const notesData = notesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setNotes(notesData);
    };

    useEffect(() => {
        fetchTasks();
        fetchNotes();
    }, []);

    const handleCreateTask = async () => {
        if (newTask.trim()) {
            const newTaskData = {
                text: newTask,
                category: taskCategory,
                completed: false,
            };
            const docRef = await addDoc(collection(db, "tasks"), newTaskData);
            setTasks([{ id: docRef.id, ...newTaskData }, ...tasks]);
            setNewTask("");
            setTaskCategory("Urgente");
        }
    };

    const toggleTaskCompletion = async (id) => {
        const taskToUpdate = tasks.find((task) => task.id === id);
        if (taskToUpdate) {
            const taskRef = doc(db, "tasks", id);
            await updateDoc(taskRef, { completed: !taskToUpdate.completed });
            setTasks(
                tasks.map((task) =>
                    task.id === id ? { ...task, completed: !task.completed } : task
                )
            );
        }
    };

    const handleDeleteTask = async (id) => {
        await deleteDoc(doc(db, "tasks", id));
        setTasks(tasks.filter((task) => task.id !== id));
    };

    const handleCreateOrUpdateNote = async () => {
        if (editingNoteId) {
            const noteRef = doc(db, "notes", editingNoteId);
            await updateDoc(noteRef, {
                title: newNoteTitle,
                description: newNoteDescription,
                category: noteCategory,
            });
            setNotes(
                notes.map((note) =>
                    note.id === editingNoteId
                        ? {
                            ...note,
                            title: newNoteTitle,
                            description: newNoteDescription,
                            category: noteCategory,
                        }
                        : note
                )
            );
            setEditingNoteId(null);
        } else {
            if (newNoteTitle.trim() && newNoteDescription.trim()) {
                const newNoteData = {
                    title: newNoteTitle,
                    description: newNoteDescription,
                    category: noteCategory,
                };
                const docRef = await addDoc(collection(db, "notes"), newNoteData);
                setNotes([{ id: docRef.id, ...newNoteData }, ...notes]);
            }
        }
        setNewNoteTitle("");
        setNewNoteDescription("");
        setNoteCategory("Urgente");
    };

    const handleDeleteNote = async (id) => {
        await deleteDoc(doc(db, "notes", id));
        setNotes(notes.filter((note) => note.id !== id));
        if (editingNoteId === id) {
            setEditingNoteId(null);
            setNewNoteTitle("");
            setNewNoteDescription("");
            setNoteCategory("Urgente");
        }
    };

    return (

        <div className="flex flex-col min-h-screen bg-gray-100">
            <div className="flex flex-col items-center px-4 py-6 sm:px-8 mx-8">
                <div className="flex flex-col lg:flex-row lg:space-x-8 gap-4 sm:p-4 max-w-5xl bg-white rounded-lg shadow-lg self-start">
                    <TasksComponent
                        tasks={tasks}
                        newTask={newTask}
                        setNewTask={setNewTask}
                        taskCategory={taskCategory}
                        setTaskCategory={setTaskCategory}
                        handleCreateTask={handleCreateTask}
                        toggleTaskCompletion={toggleTaskCompletion}
                        handleDeleteTask={handleDeleteTask}
                        categories={categories}
                    />
                    <NotesComponent
                        notes={notes}
                        newNoteTitle={newNoteTitle}
                        setNewNoteTitle={setNewNoteTitle}
                        newNoteDescription={newNoteDescription}
                        setNewNoteDescription={setNewNoteDescription}
                        noteCategory={noteCategory}
                        setNoteCategory={setNoteCategory}
                        editingNoteId={editingNoteId}
                        handleCreateOrUpdateNote={handleCreateOrUpdateNote}
                        handleEditNote={handleEditNote}
                        handleDeleteNote={handleDeleteNote}
                        categories={categories}
                    />
                    <CalendarComponent />
                </div>
            </div>
        </div>
    );
}

export default App;






// import React from "react";

// function NotesComponent({
//   notes,
//   newNoteTitle,
//   setNewNoteTitle,
//   newNoteDescription,
//   setNewNoteDescription,
//   noteCategory,
//   setNoteCategory,
//   editingNoteId,
//   handleCreateOrUpdateNote,
//   handleEditNote,
//   handleDeleteNote,
//   categories,
// }) {
//   return (


//     <div>
//       <h2 className="text-xl font-bold mb-4">Notas</h2>
//       <input
//         type="text"
//         value={newNoteTitle}
//         onChange={(e) => setNewNoteTitle(e.target.value)}
//         placeholder="Título de la nota"
//         className="border rounded p-2 w-full mb-2"
//       />
//       <textarea
//         value={newNoteDescription}
//         onChange={(e) => setNewNoteDescription(e.target.value)}
//         placeholder="Descripción de la nota"
//         className="border rounded p-2 w-full mb-2"
//       />
//       <select
//         value={noteCategory}
//         onChange={(e) => setNoteCategory(e.target.value)}
//         className="border rounded p-2 w-full mb-2"
//       >
//         {categories.map((category) => (
//           <option key={category} value={category}>
//             {category}
//           </option>
//         ))}
//       </select>
//       <button
//         onClick={handleCreateOrUpdateNote}
//         className="bg-green-500 text-white px-4 py-2 rounded w-full"
//       >
//         {editingNoteId ? "Actualizar Nota" : "Añadir Nota"}
//       </button>
//     </div>
//   );
// }

// export default NotesComponent;



import React from "react";

function NotesComponent({
    notes,
    newNoteTitle,
    setNewNoteTitle,
    newNoteDescription,
    setNewNoteDescription,
    noteCategory,
    setNoteCategory,
    editingNoteId,
    handleCreateOrUpdateNote,
    handleEditNote,
    handleDeleteNote,
    categories,
}) {
    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Notas</h2>

            {/* Formulario para añadir/editar notas */}
            <input
                type="text"
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
                placeholder="Título de la nota"
                className="border rounded p-2 w-full mb-2"
            />
            <textarea
                value={newNoteDescription}
                onChange={(e) => setNewNoteDescription(e.target.value)}
                placeholder="Descripción de la nota"
                className="border rounded p-2 w-full mb-2"
            />
            <select
                value={noteCategory}
                onChange={(e) => setNoteCategory(e.target.value)}
                className="border rounded p-2 w-full mb-2"
            >
                {categories.map((category) => (
                    <option key={category} value={category}>
                        {category}
                    </option>
                ))}
            </select>
            <button
                onClick={handleCreateOrUpdateNote}
                className="bg-green-500 text-white px-4 py-2 rounded w-full"
            >
                {editingNoteId ? "Actualizar Nota" : "Añadir Nota"}
            </button>

            {/* Listado de notas */}
            
        </div>
    );
}

export default NotesComponent;
