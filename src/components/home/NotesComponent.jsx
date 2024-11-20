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
            {/* <div className="mt-6">
                <h4 className="text-lg font-semibold mb-2">Lista de Notas</h4>
                {categories.map((category) => (
                    <div key={category} className="mb-4">
                        <h5 className="text-md font-bold">{category}</h5>
                        <ul>
                            {notes
                                .filter((note) => note.category === category)
                                .map((note) => (
                                    <li
                                        key={note.id}
                                        className="border rounded p-4 mb-2 bg-gray-100 flex justify-between items-center"
                                    >
                                        <div>
                                            <p className="font-bold">{note.title}</p>
                                            <p>{note.description}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEditNote(note.id)} // Llama a handleEditNote con el ID
                                                className="text-blue-500 hover:underline"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDeleteNote(note.id)}
                                                className="text-red-500 hover:underline"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </li>
                                ))}
                        </ul>
                    </div>
                ))}
            </div> */}
        </div>
    );
}

export default NotesComponent;
