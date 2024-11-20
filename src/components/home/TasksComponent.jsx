import React from "react";

function TasksComponent({
  tasks,
  newTask,
  setNewTask,
  taskCategory,
  setTaskCategory,
  handleCreateTask,
  toggleTaskCompletion,
  handleDeleteTask,
  categories,
}) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Tareas</h2>
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Nueva tarea"
        className="border rounded p-2 w-full mb-2"
      />
      <select
        value={taskCategory}
        onChange={(e) => setTaskCategory(e.target.value)}
        className="border rounded p-2 w-full mb-2"
      >
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <button
        onClick={handleCreateTask}
        className="bg-blue-500 text-white px-4 py-2 rounded w-full"
      >
        Añadir Tarea
      </button>
    </div>
  );
}

export default TasksComponent;
