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

  return (
    <div className="container mx-auto p-4">
      {userId ? (
        <>
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              {show ? 'Editar Nota' : 'Crear Nota'}
            </h1>
            <input
              value={fname}
              onChange={(e) => setFname(e.target.value)}
              className="w-full p-2 mb-3 border rounded-lg"
              placeholder="Título"
            />
            <input
              value={lname}
              onChange={(e) => setLname(e.target.value)}
              className="w-full p-2 mb-3 border rounded-lg"
              placeholder="Descripcio"
            />
            {!show ? (
              <button
                onClick={handleCreate}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 w-full"
              >
                Crear
              </button>
            ) : (
              <button
                onClick={handleUpdate}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 w-full"
              >
                Actualizar
              </button>
            )}
          </div>

          <div className="mt-8 grid gap-4">
            {val.map((values) => (
              <div
                key={values.id}
                className="bg-gray-100 p-4 rounded-lg shadow-md flex justify-between items-center"
              >
                <div>
                  <h2 className="text-lg font-semibold">{values.name1}</h2>
                  <p className="text-gray-600">{values.name2}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(values.id, values.name1, values.name2)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(values.id)}
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
        <p className="text-center text-red-500">Inicia sesión para gestionar tus notas.</p>
      )}
    </div>
  );
}

export default CrearNota;
