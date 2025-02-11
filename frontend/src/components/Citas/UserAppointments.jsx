"use client";
import { useEffect, useState } from "react";
import { Clock, Calendar, X } from "lucide-react";

export function UserAppointments({ userId }) {
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const getAuthHeaders = () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userData?.token}`,
    };
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:5000/api/v1/appointments/user/${userId}`,
          {
            headers: getAuthHeaders(),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message ||
            `Error al obtener las citas: ${response.status}`
          );
        }

        const data = await response.json();
        setAppointments(data);
      } catch (err) {
        console.error("Error al cargar citas:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:5000/api/v1/services/`,
          {
            headers: getAuthHeaders(),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message ||
            `Error al obtener los servicios: ${response.status}`
          );
        }

        const data = await response.json();
        setServices(data);
      } catch (err) {
        console.error("Error al cargar servicios:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchAppointments();
      fetchServices();
    } else {
      setAppointments([]); // Limpia las citas si no hay usuario
      setAppointments([]);
      setLoading(false);
    }
  }, [userId]);

  const handleDelete = async (id, userId) => {
    const confirmDelete = window.confirm("¿Estás seguro de que quieres cancelar esta cita?");
    if (!confirmDelete) return;
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      if (!userData || !userData.token) {
        throw new Error("No hay sesión activa");
      }
  
      const response = await fetch(`http://localhost:5000/api/v1/appointments/${id}/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${userData.token}`,
          "Content-Type": "application/json",
        },
      });
  
      // Add more detailed error handling
      if (!response.ok) {
        // Try to parse error response, but handle cases where it might not be JSON
        let errorMessage = "Error al eliminar la cita";
        try {
          const errorData = await response.text(); // Use text() instead of json()
          console.error("Error response:", errorData);
          errorMessage = errorData || errorMessage;
        } catch (parseError) {
          console.error("Could not parse error response", parseError);
        }
  
        throw new Error(errorMessage);
      }
  
      // Check if response is empty before trying to parse
      const data = response.status !== 204 ? await response.json() : {};
      
      setAppointments((prev) => prev.filter((appt) => appt.id !== id));
      alert("Cita cancelada exitosamente.");
    } catch (error) {
      console.error("Error al eliminar cita:", error);
      alert(error.message || "No se pudo eliminar la cita.");
    }
  };

  if (loading) {
    return <div className="text-center py-4">Cargando citas...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg p-6 m-6">
      <h2 className="text-stone-500 text-xl font-semibold mb-4">Mis Citas</h2>

      {Array.isArray(appointments) && appointments.length === 0 ? (
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
                    {services.find((service) => service.id === appointment.servicioId)?.nombre}
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

                {/* {appointment.estado === "Pendiente" && (
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
                )} */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}