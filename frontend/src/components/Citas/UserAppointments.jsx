"use client";
import { useEffect, useState } from "react";
import { Clock, Calendar, X } from "lucide-react";

export function UserAppointments({ userId }) {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!userId) return;
      setIsLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5000/api/v1/appointments/user/${userId}`
        );
        
        if (!response.ok) {
          throw new Error(`Error al obtener las citas: ${response.status}`);
        }
        
        const data = await response.json();
        setAppointments(data);
      } catch (err) {
        console.error("Error al cargar citas:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAppointments();
  }, [userId]);

  const handleDelete = async (id, userId) => {
    const confirmDelete = window.confirm("¿Estás seguro de que quieres cancelar esta cita?");
    if (!confirmDelete) return;
    try {
      const response = await fetch(`http://localhost:5000/api/v1/appointments/${id}/${userId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Error al eliminar cita: ${response.status}`);
      }
      setAppointments((prev) => prev.filter((appt) => appt.id !== id));
      alert("Cita cancelada exitosamente.");
    } catch (error) {
      console.error("Error al eliminar cita:", error);
      alert("No se pudo cancelar la cita.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Cargando citas...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
        Error al cargar las citas: {error}
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg p-6 m-6">
      <h2 className="text-stone-500 text-xl font-semibold mb-4">Mis Citas</h2>
      
      {appointments.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          <Calendar className="mx-auto mb-4 text-gray-300" size={48} />
          <p>No tienes citas agendadas.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div 
              key={appointment.id} 
              className="rounded-lg p-4 relative border border-gray-200 hover:shadow-sm transition-all"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold font-medium text-gray-800">
                    {appointment.servicio?.nombre || "Servicio no especificado"}
                  </div>
                  <div className="text-sm text-gray-600 flex items-center mt-1">
                    <Calendar className="mr-2 text-gray-400" size={16} />
                    {appointment.fecha}
                  </div>
                  {appointment.hora && (
                    <div className="text-sm text-gray-600 flex items-center mt-1">
                      <Clock className="mr-2 text-gray-400" size={16} />
                      {appointment.hora}
                    </div>
                  )}
                  <span className={`
                    inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium
                    ${appointment.estado === 'Pendiente' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-green-100 text-green-800'
                    }
                  `}>
                    {appointment.estado}
                  </span>
                </div>

                {appointment.estado === "Pendiente" && (
                  <button 
                    onClick={() => handleDelete(appointment.id, appointment.usuarioId)} 
                    className="
                      text-red-500 hover:bg-red-50 p-2 rounded-full 
                      transition-colors absolute top-2 right-2
                      focus:outline-none focus:ring-2 focus:ring-red-200
                    "
                    title="Cancelar cita"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}