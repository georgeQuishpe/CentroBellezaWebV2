"use client";
import { useEffect, useState } from "react";

export function UserAppointments({ userId }) {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/v1/appointments/user/${userId}`
        );
        if (!response.ok) {
          throw new Error(`Error al obtener las citas: ${response.status}`);
        }
        const data = await response.json();
        setAppointments(data); // Guardar las citas obtenidas
      } catch (err) {
        console.error("Error al cargar citas:", err);
        setError(err.message); // Manejar errores de manera explícita
      }
    };

    if (userId) {
      fetchAppointments();
    }
  }, [userId]);

  if (error) {
    return <div>Error al cargar las citas: {error}</div>;
  }

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/v1/appointments/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Error al eliminar cita: ${response.status}`);
      }

      setAppointments((prev) => prev.filter((appt) => appt.id !== id));
      alert("Cita eliminada.");
    } catch (error) {
      console.error("Error al eliminar cita:", error);
      alert("No se pudo eliminar la cita.");
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Mis Citas</h2>
      {appointments.length === 0 ? (
        <p>No tienes citas agendadas.</p>
      ) : (
        <ul>
          {appointments.map((appointment) => (
            <li key={appointment.id} className="border-b py-2">
              <div className="font-medium">{appointment.fecha}</div>
              <div className="text-sm text-gray-500">
                Servicio: {appointment.servicioId} - Estado:{" "}
                {appointment.estado}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
