import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const CalendarComponent = () => {
  const [selectedDate, setSelectedDate] = useState(new Date()); // Fecha seleccionada

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Calendario</h2>
        <Calendar
          value={selectedDate}
          onChange={(date) => setSelectedDate(date)} // Actualizar la fecha seleccionada
        />
        <p className="mt-4">
          <strong>Fecha seleccionada:</strong> {selectedDate.toDateString()}
        </p>
      </div>
    </div>
  );
};

export default CalendarComponent;
