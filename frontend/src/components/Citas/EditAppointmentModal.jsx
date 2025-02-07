"use client";
import { useState, useEffect } from "react";

export function EditAppointmentModal({
  isOpen,
  onClose,
  appointment,
  onSave,
  services,
}) {
  const [formData, setFormData] = useState({
    fecha: "",
    hora: "",
    servicioId: "",
    estado: "",
  });

  useEffect(() => {
    if (appointment) {
      const date = new Date(appointment.fecha);
      setFormData({
        fecha: date.toISOString().split("T")[0],
        hora: date.toTimeString().slice(0, 5),
        servicioId: appointment.servicioId,
        estado: appointment.estado,
      });
    }
  }, [appointment]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      if (!userData || !userData.token) {
        throw new Error("No hay sesión activa");
      }

      const appointmentData = {
        fecha: selectedDate,
        servicioId: selectedService,
        usuarioId: userData.id, // Asegúrate de incluir el ID del usuario
        estado: "Pendiente",
      };

      const response = await fetch(
        "http://localhost:5000/api/v1/appointments/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData.token}`, // Añadir el token aquí
          },
          body: JSON.stringify(appointmentData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear la cita");
      }

      const data = await response.json();

      // Manejar la respuesta exitosa
      setSuccess("Cita agendada exitosamente");
      // Limpiar el formulario o redirigir según necesites
    } catch (error) {
      console.error("Error al agendar cita:", error);
      setError(error.message || "No se pudo agendar la cita");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4">Editar Cita</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Fecha</label>
              <input
                type="date"
                value={formData.fecha}
                onChange={(e) =>
                  setFormData({ ...formData, fecha: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Hora</label>
              <input
                type="time"
                value={formData.hora}
                onChange={(e) =>
                  setFormData({ ...formData, hora: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Servicio</label>
              <select
                value={formData.servicioId}
                onChange={(e) =>
                  setFormData({ ...formData, servicioId: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              >
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.id}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Estado</label>
              <select
                value={formData.estado}
                onChange={(e) =>
                  setFormData({ ...formData, estado: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              >
                <option value="Pendiente">Pendiente</option>
                <option value="Confirmada">Confirmada</option>
                <option value="Completada">Completada</option>
                <option value="Cancelada">Cancelada</option>
              </select>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}