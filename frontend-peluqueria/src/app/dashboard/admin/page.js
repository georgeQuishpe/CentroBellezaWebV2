'use client';
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [services, setServices] = useState([]);
  const [users, setUsers] = useState([]);
  const [newService, setNewService] = useState({ 
    nombre: '', 
    descripcion: '', 
    precio: '', 
    duracion: '', 
    estado: true 
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingUser, setEditingUser] = useState(null);

  // Cargar servicios y usuarios
  useEffect(() => {
    const fetchServicesAndUsers = async () => {
      try {
        const servicesResponse = await fetch('https://peluqueriawebapi.onrender.com/api/v1/services');
        const usersResponse = await fetch('https://peluqueriawebapi.onrender.com/api/v1/users');

        if (!servicesResponse.ok) {
          throw new Error('Error al cargar los servicios');
        }

        if (!usersResponse.ok) {
          throw new Error('Error al cargar los usuarios');
        }

        const servicesData = await servicesResponse.json();
        const usersData = await usersResponse.json();

        console.log('Servicios:', servicesData);
        console.log('Usuarios:', usersData);

        setServices(servicesData);
        setUsers(usersData);
      } catch (err) {
        setError('Error al cargar los datos: ' + err.message);
        console.error(err);
      }
    };

    fetchServicesAndUsers();
  }, []);

  // Crear un nuevo servicio
  const createService = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://peluqueriawebapi.onrender.com/api/v1/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newService),
      });

      if (!response.ok) {
        throw new Error('No se pudo crear el servicio.');
      }

      const createdService = await response.json();
      setServices([...services, createdService.data]);
      setNewService({ nombre: '', descripcion: '', precio: '', duracion: '', estado: true });
      setSuccess('Servicio creado exitosamente.');
    } catch (err) {
      setError(err.message);
    }
  };

  // Eliminar servicio
  const deleteService = async (id) => {
    try {
      const response = await fetch(`https://peluqueriawebapi.onrender.com/api/v1/services/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('No se pudo eliminar el servicio.');
      }

      setServices(services.filter((service) => service.id !== id));
      setSuccess('Servicio eliminado exitosamente.');
    } catch (err) {
      setError(err.message);
    }
  };

  // Modificar rol de usuario
  const updateUserRole = async (userId, newRole) => {
    try {
      const response = await fetch(`https://peluqueriawebapi.onrender.com/api/v1/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rol: newRole }),
      });

      if (!response.ok) {
        throw new Error('No se pudo actualizar el rol.');
      }

      const updatedUsers = users.map(user => 
        user.id === userId ? { ...user, rol: newRole } : user
      );
      
      setUsers(updatedUsers);
      setSuccess('Rol de usuario actualizado exitosamente.');
      setEditingUser(null);
    } catch (err) {
      setError(err.message);
      console.error('Error updating user role:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Panel de Administración</h1>

        {/* Mensajes de Error y Éxito */}
        {error && (
          <div className="bg-red-50 border border-red-500 text-red-900 px-4 py-3 rounded-lg relative mb-4" role="alert">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-500 text-green-900 px-4 py-3 rounded-lg relative mb-4" role="alert">
            {success}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Gestión de Servicios */}
          <div className="bg-white shadow-md rounded-xl p-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">Gestión de Servicios</h2>
            
            {/* Formulario de Crear Servicio */}
            <form onSubmit={createService} className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Nombre del Servicio"
                  value={newService.nombre}
                  onChange={(e) => setNewService({ ...newService, nombre: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
                <input
                  type="number"
                  placeholder="Precio"
                  value={newService.precio}
                  onChange={(e) => setNewService({ ...newService, precio: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
                <textarea
                  placeholder="Descripción"
                  value={newService.descripcion}
                  onChange={(e) => setNewService({ ...newService, descripcion: e.target.value })}
                  className="col-span-2 w-full p-2 border border-gray-300 rounded-md"
                />
                <input
                  type="number"
                  placeholder="Duración (minutos)"
                  value={newService.duracion}
                  onChange={(e) => setNewService({ ...newService, duracion: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
                <select
                  value={newService.estado}
                  onChange={(e) => setNewService({ ...newService, estado: e.target.value === 'true' })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="true">Activo</option>
                  <option value="false">Inactivo</option>
                </select>
              </div>
              <button 
                type="submit" 
                className="w-full bg-gray-800 text-white p-2 rounded-md hover:bg-gray-700 transition-colors"
              >
                Crear Servicio
              </button>
            </form>

            {/* Lista de Servicios */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Servicios Existentes</h3>
              {services.length === 0 ? (
                <p className="text-gray-500">No hay servicios disponibles</p>
              ) : (
                services.map((service) => (
                  <div 
                    key={service.id} 
                    className="flex justify-between items-center bg-gray-50 p-3 rounded-md mb-2"
                  >
                    <div>
                      <span className="font-semibold">{service.nombre}</span>
                      <span className="text-gray-500 ml-2">${service.precio}</span>
                    </div>
                    <button
                      onClick={() => deleteService(service.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Gestión de Usuarios */}
          <div className="bg-white shadow-md rounded-xl p-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">Gestión de Usuarios</h2>
            {users.map((user) => (
              <div 
                key={user.id} 
                className="flex justify-between items-center bg-gray-50 p-3 rounded-md mb-2"
              >
                <div>
                  <span className="font-semibold">{user.nombre}</span>
                  <span className="text-gray-500 ml-2">{user.email}</span>
                </div>
                
                {editingUser === user.id ? (
                  <div className="flex items-center">
                    <select
                      value={user.rol}
                      onChange={(e) => updateUserRole(user.id, e.target.value)}
                      className="p-1 border border-gray-300 rounded-md mr-2"
                    >
                      <option value="Admin">Admin</option>
                      <option value="Cliente">Cliente</option>
                    </select>
                    <button
                      onClick={() => setEditingUser(null)}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <div>
                    <span 
                      className={`
                        px-2 py-1 rounded-full text-sm font-medium 
                        ${user.rol === 'Admin' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}
                      `}
                    >
                      {user.rol}
                    </span>
                    <button
                      onClick={() => setEditingUser(user.id)}
                      className="ml-2 text-gray-600 hover:text-gray-800"
                    >
                      Editar Rol
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}