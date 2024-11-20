import React, { useState, useEffect } from "react";
import { useAuth } from '../../contexts/authContext';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc, onSnapshot } from "firebase/firestore";
import { database } from "../../firebase/firebase";
import CalendarComponent from "./CalendarComponent";
import TasksComponent from "./TasksComponent";
import NotesComponent from "./NotesComponent";

const Home = () => {
    const { currentUser } = useAuth();

    const [tasks, setTasks] = useState([]);
    const [notes, setNotes] = useState([]);
    const [newTask, setNewTask] = useState("");
    const [taskCategory, setTaskCategory] = useState("Urgente");
    const [newNoteTitle, setNewNoteTitle] = useState("");
    const [newNoteDescription, setNewNoteDescription] = useState("");
    const [noteCategory, setNoteCategory] = useState("Urgente");
    const [editingNoteId, setEditingNoteId] = useState(null);

    const categories = ["Urgente", "Tarea semanal", "Algún día/Tal vez"];

    // Función para obtener las tareas de un usuario específico
    const fetchTasks = async () => {
        if (!currentUser) return;
        const tasksSnapshot = await getDocs(collection(database, "users", currentUser.uid, "tasks"));
        const tasksData = tasksSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setTasks(tasksData);
    };

    // Función para obtener las notas de un usuario específico
    const fetchNotes = async () => {
        if (!currentUser) return;
        const notesSnapshot = await getDocs(collection(database, "users", currentUser.uid, "notes"));
        const notesData = notesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setNotes(notesData);
    };

    useEffect(() => {
        if (currentUser) {
            fetchTasks();
            fetchNotes();
        }
    }, [currentUser]);

    const handleCreateTask = async () => {
        if (newTask.trim() && currentUser) {
            const newTaskData = {
                text: newTask,
                category: taskCategory,
                completed: false,
            };
            const docRef = await addDoc(collection(database, "users", currentUser.uid, "tasks"), newTaskData);
            setTasks([{ id: docRef.id, ...newTaskData }, ...tasks]);
            setNewTask("");
            setTaskCategory("Urgente");
        }
    };

    const toggleTaskCompletion = async (id) => {
        const taskToUpdate = tasks.find((task) => task.id === id);
        if (taskToUpdate && currentUser) {
            const taskRef = doc(database, "users", currentUser.uid, "tasks", id);
            await updateDoc(taskRef, { completed: !taskToUpdate.completed });
            setTasks(
                tasks.map((task) =>
                    task.id === id ? { ...task, completed: !task.completed } : task
                )
            );
        }
    };

    const handleDeleteTask = async (id) => {
        if (currentUser) {
            await deleteDoc(doc(database, "users", currentUser.uid, "tasks", id));
            setTasks(tasks.filter((task) => task.id !== id));
        }
    };

    const handleCreateOrUpdateNote = async () => {
        if (currentUser) {
            if (editingNoteId) {
                const noteRef = doc(database, "users", currentUser.uid, "notes", editingNoteId);
                await updateDoc(noteRef, {
                    title: newNoteTitle,
                    description: newNoteDescription,
                    category: noteCategory,
                });
                setNotes(
                    notes.map((note) =>
                        note.id === editingNoteId
                            ? { ...note, title: newNoteTitle, description: newNoteDescription, category: noteCategory }
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
                    const docRef = await addDoc(collection(database, "users", currentUser.uid, "notes"), newNoteData);
                    setNotes([{ id: docRef.id, ...newNoteData }, ...notes]);
                }
            }
            setNewNoteTitle("");
            setNewNoteDescription("");
            setNoteCategory("Urgente");
        }
    };

    const handleDeleteNote = async (id) => {
        if (currentUser) {
            await deleteDoc(doc(database, "users", currentUser.uid, "notes", id));
            setNotes(notes.filter((note) => note.id !== id));
            if (editingNoteId === id) {
                setEditingNoteId(null);
                setNewNoteTitle("");
                setNewNoteDescription("");
                setNoteCategory("Urgente");
            }
        }
    };

    // Editar una nota existente
    const handleEditNote = async (id) => {
        const noteToEdit = notes.find((note) => note.id === id);
        if (noteToEdit) {
            setNewNoteTitle(noteToEdit.title);
            setNewNoteDescription(noteToEdit.description);
            setNoteCategory(noteToEdit.category);
            setEditingNoteId(id);
        }
    };

    useEffect(() => {
        if (currentUser) {
            const notesCollectionRef = collection(database, `users/${currentUser.uid}/notes`);
            const unsubscribe = onSnapshot(notesCollectionRef, (snapshot) => {
                const notesData = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setNotes(notesData);
            });
            return () => unsubscribe();
        }
    }, [currentUser]);

    return (
        <div className='text-2xl font-bold pt-14'>
            Hello {currentUser.displayName ? currentUser.displayName : currentUser.email}, you are now logged in.
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

                    {/* Copiado de tareas y notas */}
                    <h1>copia:</h1>
                    <div className="grid grid-cols-3 gap-4 px-8">
                        {categories.map((category) => (
                            <div key={category} className="p-4 bg-white shadow rounded">
                                <h3 className="text-lg font-bold mb-4">{category}</h3>

                                {/* Tareas por categoría */}
                                <h4 className="text-md font-semibold mb-2">Tareas:</h4>
                                <ul>
                                    {tasks
                                        .filter((task) => task.category === category) // Filtrar por categoría
                                        .map((task) => (
                                            <li
                                                key={task.id}
                                                className={`flex flex-col sm:flex-row justify-between items-center p-2 rounded border ${task.completed
                                                    ? "line-through text-gray-500"
                                                    : ""
                                                    }`}
                                            >
                                                <span>{task.text}</span>
                                                <div>
                                                    <button
                                                        onClick={() => toggleTaskCompletion(task.id)}
                                                        className={`text-${task.completed ? "gray" : "blue"}-500 hover:underline`}
                                                    >
                                                        {task.completed ? "Desmarcar" : "Marcar como hecho"}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteTask(task.id)}
                                                        className="text-red-500 ml-4 hover:underline"
                                                    >
                                                        Eliminar
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                </ul>

                                {/* Notas por categoría */}
                                <h4 className="text-md font-semibold mb-2">Notas:</h4>
                                <ul>
                                    {notes
                                        .filter((note) => note.category === category) // Filtrar por categoría
                                        .map((note) => (
                                            <li key={note.id} className="mb-4">
                                                <div className="border p-4 rounded shadow">
                                                    <h3 className="font-semibold text-lg">{note.title}</h3>
                                                    <p className="text-gray-700">{note.description}</p>
                                                    <button
                                                        onClick={() => handleEditNote(note.id)}
                                                        className="text-blue-500 hover:underline"
                                                    >
                                                        Editar
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteNote(note.id)}
                                                        className="text-red-500 ml-4 hover:underline"
                                                    >
                                                        Eliminar
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
