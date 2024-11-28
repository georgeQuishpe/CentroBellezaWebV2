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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...appointment,
      fecha: `${formData.fecha}T${formData.hora}`,
      servicioId: formData.servicioId,
      estado: formData.estado,
    });
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
                    {service.nombre}
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
