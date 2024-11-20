import React, { useEffect, useState } from 'react';
import { database } from '../../firebase/firebase';
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function CrearNota() {
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [id, setId] = useState('');
  const [show, setShow] = useState(false);
  const [val, setVal] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [view, setView] = useState('notes'); // 'notes' o 'tasks'
  const [newTask, setNewTask] = useState('');
  const [userId, setUserId] = useState(null);

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUserId(user.uid);
      else setUserId(null);
    });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    if (userId) {
      const getData = async () => {
        const userCollection = collection(database, `users/${userId}/notes`);
        const dbVal = await getDocs(userCollection);
        setVal(dbVal.docs.map((doc) => ({ ...doc.data(), id: doc.id })).reverse());
      };
      getData();
    }
  }, [userId]);

  const handleCreateNote = async () => {
    if (userId) {
      const userCollection = collection(database, `users/${userId}/notes`);
      const newDoc = await addDoc(userCollection, { name1: fname, name2: lname });
      setVal((prev) => [{ id: newDoc.id, name1: fname, name2: lname }, ...prev]);
      setFname('');
      setLname('');
    }
  };

  const handleCreateTask = () => {
    if (newTask.trim()) {
      setTasks((prev) => [...prev, { text: newTask, completed: false }]);
      setNewTask('');
    }
  };

  const toggleTaskCompletion = (index) => {
    setTasks((prev) =>
      prev.map((task, i) => (i === index ? { ...task, completed: !task.completed } : task))
    );
  };

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {/* Columna Izquierda: Tareas */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Tareas</h2>
        {view === 'tasks' ? (
          <>
            <input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Nueva tarea"
              className="border p-2 w-full mb-2"
            />
            <button
              onClick={handleCreateTask}
              className="bg-blue-500 text-white px-4 py-2 rounded w-full"
            >
              Añadir Tarea
            </button>
          </>
        ) : (
          <ul>
            {tasks.map((task, index) => (
              <li
                key={index}
                className={`p-2 mb-2 rounded border ${
                  task.completed ? 'line-through text-gray-500' : ''
                }`}
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTaskCompletion(index)}
                  className="mr-2"
                />
                {task.text}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Columna Derecha: Notas */}
      <div className="bg-white p-4 rounded shadow">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setView('notes')}
            className={`px-4 py-2 rounded ${
              view === 'notes' ? 'bg-blue-500 text-white' : 'bg-gray-300'
            }`}
          >
            Crear Nota
          </button>
          <button
            onClick={() => setView('tasks')}
            className={`px-4 py-2 rounded ${
              view === 'tasks' ? 'bg-blue-500 text-white' : 'bg-gray-300'
            }`}
          >
            Añadir Tarea
          </button>
        </div>
        {view === 'notes' && (
          <>
            <input
              value={fname}
              onChange={(e) => setFname(e.target.value)}
              className="w-full p-2 mb-3 border rounded-lg"
              placeholder="Title"
            />
            <input
              value={lname}
              onChange={(e) => setLname(e.target.value)}
              className="w-full p-2 mb-3 border rounded-lg"
              placeholder="Description"
            />
            <button
              onClick={handleCreateNote}
              className="bg-blue-500 text-white px-4 py-2 rounded w-full"
            >
              Create
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default CrearNota;






  
const [fname, setFname] = useState('');
const [lname, setLname] = useState('');
const [id, setId] = useState('');
const [show, setShow] = useState(false);
const [val, setVal] = useState([]);
const [userId, setUserId] = useState(null); // UID del usuario

const auth = getAuth();

useEffect(() => {
  // Observar el estado de autenticación
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      setUserId(user.uid); // Establece el UID del usuario
    } else {
      setUserId(null); // El usuario no está autenticado
    }
  });
  return () => unsubscribe();
}, [auth]);

useEffect(() => {
  // Obtener datos solo si el usuario está autenticado
  if (userId) {
    const getData = async () => {
      const userCollection = collection(database, `users/${userId}/notes`);
      const dbVal = await getDocs(userCollection);
      // setVal(dbVal.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      // Invierte el orden de los documentos
         setVal(dbVal.docs.map((doc) => ({ ...doc.data(), id: doc.id })).reverse());
  
    };
    getData();
  }
}, [userId]);

// const handleCreate = async () => {
//   if (userId) {
//     const userCollection = collection(database, `users/${userId}/notes`);
//     await addDoc(userCollection, { name1: fname, name2: lname });
//     setFname('');
//     setLname('');
//   }
// };

const handleCreate = async () => {
  if (userId) {
    const userCollection = collection(database, `users/${userId}/notes`);
    const newDoc = await addDoc(userCollection, { name1: fname, name2: lname });
    
    // Agregar la nueva nota al estado local
    setVal((prev) => [{ id: newDoc.id, name1: fname, name2: lname }, ...prev]);

    setFname('');
    setLname('');
  }
};

// const handleDelete = async (id) => {
//   if (userId) {
//     const deleteVal = doc(database, `users/${userId}/notes`, id);
//     await deleteDoc(deleteVal);
//   }
// };
const handleDelete = async (id) => {
  if (userId) {
    const deleteVal = doc(database, `users/${userId}/notes`, id);
    await deleteDoc(deleteVal);

    // Actualizar el estado local eliminando la nota
    setVal((prev) => prev.filter((note) => note.id !== id));
  }
};
const handleEdit = (id, name1, name2) => {
  setFname(name1);
  setLname(name2);
  setId(id);
  setShow(true);
};

const handleUpdate = async () => {
  if (userId) {
    const updateData = doc(database, `users/${userId}/notes`, id);
    await updateDoc(updateData, { name1: fname, name2: lname });
    setShow(false);
    setFname('');
    setLname('');
  }
};
