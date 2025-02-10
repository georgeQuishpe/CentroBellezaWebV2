'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminChat } from '../../../components/Chat/AdminChat';
import { ChatProvider } from '../../../context/ChatContext';
import { EditAppointmentModal } from "../../../components/Citas/EditAppointmentModal"
import { ConfirmationModal } from '../../../components/ConfirmationModal';
import { useAuth } from '../../../hooks/useAuth';  // Añade esta línea
import { useAuthFetch } from '../../../hooks/useAuthFetch';  // Añade esta línea

export default function AdminDashboard() {

    const { user, loading } = useAuth();
    const router = useRouter();

    const [users, setUsers] = useState([]);
    const [services, setServices] = useState([]);
    const [editingService, setEditingService] = useState(null);
    const [selectedRole, setSelectedRole] = useState('');
    const [appointments, setAppointments] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [error, setError] = useState('');
    const [confirmationModal, setConfirmationModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: null
    });



    const [mounted, setMounted] = useState(false);


    const [newService, setNewService] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        duracion: '',
        estado: true
    });
    const [success, setSuccess] = useState('');
    const [editingUser, setEditingUser] = useState(null);

    const { fetchWithAuth } = useAuthFetch();


    const handleLogout = () => {
        localStorage.removeItem('user');
        document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        router.push('/login');
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/login');
            } else if (user.rol !== 'Admin') {
                console.log('Usuario no admin intentando acceder:', user);
                router.push('/user/dashboard');
            }
        }
    }, [user, loading, router]);


    // Efecto para cargar datos (combinado con autenticación)
    useEffect(() => {
        const initializeAdmin = async () => {

            if (!user || user.rol !== 'Admin') {
                router.push('/login');
                return;
            }

            try {
                // Cargar datos solo si es admin
                const [servicesResponse, usersResponse] = await Promise.all([
                    fetch('http://localhost:5002/api/v1/services/'),
                    fetch('http://localhost:5001/api/v1/users/')
                ]);

                if (!servicesResponse.ok || !usersResponse.ok) {
                    throw new Error('Error al cargar los datos');
                }

                const [servicesData, usersData] = await Promise.all([
                    servicesResponse.json(),
                    usersResponse.json()
                ]);

                setServices(servicesData);
                setUsers(usersData);
            } catch (err) {
                setError('Error al cargar los datos: ' + err.message);
                console.error(err);
                router.push('/login');
            }
        };

        if (!loading) {
            initializeAdmin();
        }
    }, [user, loading, router]);

    if (loading) return <div>Cargando...</div>;
    if (!user || user.rol !== 'Admin') return null;


    // Función para mostrar el modal de confirmación
    const showConfirmation = (title, message, onConfirm) => {
        setConfirmationModal({
            isOpen: true,
            title,
            message,
            onConfirm: () => {
                onConfirm();
                setConfirmationModal({ isOpen: false, title: '', message: '', onConfirm: null });
            }
        });
    };

    // Todas las funciones de manejo
    const createService = async (e) => {
        e.preventDefault();
        try {
            const userData = JSON.parse(localStorage.getItem('user'));
            if (!userData || !userData.token) {
                throw new Error('No hay sesión activa');
            }

            const response = await fetch('http://localhost:5002/api/v1/services/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userData.token}`
                },
                body: JSON.stringify(newService),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'No se pudo crear el servicio.');
            }

            const createdService = await response.json();
            setServices([...services, createdService.data]);
            setNewService({ nombre: '', descripcion: '', precio: '', duracion: '', estado: true });
            setSuccess('Servicio creado exitosamente.');
        } catch (err) {
            setError(err.message);
            console.error('Error al crear servicio:', err);
        }
    };

    // Actualizar servicio
    const updateService = async (serviceId) => {
        showConfirmation(
            "Guardar Cambios",
            "¿Deseas guardar los cambios realizados en este servicio?",
            async () => {
                try {
                    const serviceToUpdate = services.find(s => s.id === serviceId);

                    const updatedData = await fetchWithAuth(
                        `http://localhost:5002/api/v1/services/${serviceId}`,
                        {
                            method: 'PUT',
                            body: JSON.stringify(serviceToUpdate)
                        }
                    );

                    setServices(services.map(service =>
                        service.id === serviceId ? updatedData : service
                    ));
                    setSuccess('Servicio actualizado exitosamente.');
                    setEditingService(null);
                } catch (err) {
                    setError(err.message);
                }
            })
    };

    // Eliminar servicio
    const deleteService = async (id) => {
        showConfirmation(
            "Eliminar Servicio",
            "¿Estás seguro de que deseas eliminar este servicio? Esta acción no se puede deshacer.",
            async () => {
                try {
                    const userData = JSON.parse(localStorage.getItem('user'));
                    if (!userData || !userData.token) {
                        throw new Error('No hay sesión activa');
                    }

                    const response = await fetch(`http://localhost:5002/api/v1/services/${id}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${userData.token}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || 'No se pudo eliminar el servicio.');
                    }

                    setServices(services.filter((service) => service.id !== id));
                    setSuccess('Servicio eliminado exitosamente.');
                } catch (err) {
                    setError(err.message);
                    console.error('Error al eliminar servicio:', err);
                }
            })
    };

    // Modificar rol de usuario
    const updateUserRole = async (userId, newRole) => {
        showConfirmation(
            "Cambiar Rol de Usuario",
            `¿Estás seguro de que deseas cambiar el rol del usuario a ${newRole}?`,
            async () => {
                try {
                    const response = await fetch(`http://localhost:5001/api/v1/users/${userId}`, {
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
            })
    };




    if (!mounted || !user) {
        return null;
    }

    // Renderizado
    if (loading) return <div>Cargando...</div>;
    if (!user || user.rol !== 'Admin') return null;

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-blue-500 text-2xl font-bold">Panel de {user?.rol}</h1>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Cerrar Sesión
                    </button>
                </div>
                {/* Mensajes de Error y Éxito */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
                        {success}
                    </div>
                )}

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Gestión de Servicios */}
                    <div className="bg-white shadow-md rounded-xl p-6">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Gestión de Servicios</h2>

                        {/* Formulario de Crear Servicio */}
                        <form onSubmit={createService} className="space-y-4 mb-6">
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Nombre del Servicio"
                                    value={newService.nombre}
                                    onChange={(e) => setNewService({ ...newService, nombre: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-md text-gray-700"
                                    required
                                />
                                <input
                                    type="number"
                                    placeholder="Precio"
                                    value={newService.precio}
                                    onChange={(e) => setNewService({ ...newService, precio: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-md text-gray-700"
                                    required
                                />
                                <textarea
                                    placeholder="Descripción"
                                    value={newService.descripcion}
                                    onChange={(e) => setNewService({ ...newService, descripcion: e.target.value })}
                                    className="col-span-2 w-full p-2 border border-gray-300 rounded-md text-gray-700"
                                />
                                <input
                                    type="number"
                                    placeholder="Duración (minutos)"
                                    value={newService.duracion}
                                    onChange={(e) => setNewService({ ...newService, duracion: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-md text-gray-700"
                                    required
                                />
                                <select
                                    value={newService.estado}
                                    onChange={(e) => setNewService({ ...newService, estado: e.target.value === 'true' })}
                                    className="w-full p-2 border border-gray-300 rounded-md text-gray-700"
                                >
                                    <option value="true">Activo</option>
                                    <option value="false">Inactivo</option>
                                </select>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Crear Servicio
                            </button>
                        </form>

                        {/* Lista de Servicios */}
                        <div className="border-t pt-4">
                            <h3 className="text-lg font-medium text-gray-800 mb-4">Servicios Existentes</h3>
                            {services.length === 0 ? (
                                <p className="text-gray-600">No hay servicios disponibles</p>
                            ) : (
                                services.map((service) => (
                                    <div
                                        key={service.id}
                                        className="flex justify-between items-center bg-gray-50 p-3 rounded-md mb-2"
                                    >
                                        {editingService === service.id ? (
                                            <div className="grid grid-cols-2 gap-3 w-full">
                                                <div className="col-span-2 grid grid-cols-2 gap-2">
                                                    <input
                                                        type="text"
                                                        placeholder="Nombre"
                                                        value={service.nombre}
                                                        onChange={(e) => {
                                                            const updatedServices = services.map(s =>
                                                                s.id === service.id ? { ...s, nombre: e.target.value } : s
                                                            );
                                                            setServices(updatedServices);
                                                        }}
                                                        className="p-2 border border-gray-300 rounded-md text-gray-700"
                                                    />
                                                    <input
                                                        type="number"
                                                        placeholder="Precio"
                                                        value={service.precio}
                                                        onChange={(e) => {
                                                            const updatedServices = services.map(s =>
                                                                s.id === service.id ? { ...s, precio: e.target.value } : s
                                                            );
                                                            setServices(updatedServices);
                                                        }}
                                                        className="p-2 border border-gray-300 rounded-md text-gray-700"
                                                    />
                                                </div>

                                                <textarea
                                                    placeholder="Descripción"
                                                    value={service.descripcion}
                                                    onChange={(e) => {
                                                        const updatedServices = services.map(s =>
                                                            s.id === service.id ? { ...s, descripcion: e.target.value } : s
                                                        );
                                                        setServices(updatedServices);
                                                    }}
                                                    className="col-span-2 p-2 border border-gray-300 rounded-md text-gray-700 h-24"
                                                />

                                                <div className="grid grid-cols-2 gap-2">
                                                    <input
                                                        type="number"
                                                        placeholder="Duración (minutos)"
                                                        value={service.duracion}
                                                        onChange={(e) => {
                                                            const updatedServices = services.map(s =>
                                                                s.id === service.id ? { ...s, duracion: e.target.value } : s
                                                            );
                                                            setServices(updatedServices);
                                                        }}
                                                        className="p-2 border border-gray-300 rounded-md text-gray-700"
                                                    />
                                                    <select
                                                        value={service.estado}
                                                        onChange={(e) => {
                                                            const updatedServices = services.map(s =>
                                                                s.id === service.id ? { ...s, estado: e.target.value === 'true' } : s
                                                            );
                                                            setServices(updatedServices);
                                                        }}
                                                        className="p-2 border border-gray-300 rounded-md text-gray-700"
                                                    >
                                                        <option value="true">Activo</option>
                                                        <option value="false">Inactivo</option>
                                                    </select>
                                                </div>

                                                <div className="col-span-2 flex justify-between">
                                                    <button
                                                        onClick={() => updateService(service.id)}
                                                        className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 w-full mr-2"
                                                    >
                                                        Guardar Cambios
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingService(null)}
                                                        className="bg-gray-300 text-gray-700 p-2 rounded-md hover:bg-gray-400 w-full"
                                                    >
                                                        Cancelar
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div>
                                                    <span className="font-semibold text-gray-800">{service.nombre}</span>
                                                    <span className="text-gray-600 ml-2">${service.precio}</span>
                                                </div>
                                                <div>
                                                    <button
                                                        onClick={() => setEditingService(service.id)}
                                                        className="mr-2 text-blue-600 hover:text-blue-800"
                                                    >
                                                        Editar
                                                    </button>
                                                    <button
                                                        onClick={() => deleteService(service.id)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        Eliminar
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Gestión de Usuarios */}
                    <div className="bg-white shadow-md rounded-xl p-6 w-full">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Gestión de Usuarios</h2>
                        <div className="space-y-2">
                            {users.map((user) => (
                                <div
                                    key={user.id}
                                    className="flex justify-between items-center bg-gray-50 p-3 rounded-md"
                                >
                                    <div className="flex-grow min-w-0">
                                        <div className="flex items-center">
                                            <span className="font-semibold text-gray-800 truncate mr-2">{user.nombre}</span>
                                            <span className="text-gray-600 truncate">{user.email}</span>
                                        </div>

                                        {editingUser === user.id ? (
                                            <div className="flex items-center mt-2">
                                                <select
                                                    value={user.rol}
                                                    onChange={(e) => updateUserRole(user.id, e.target.value)}
                                                    className="p-1 border border-gray-300 rounded-md mr-2 text-gray-700"
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
                                            <div className="mt-1">
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
                                                    className="ml-2 text-blue-600 hover:text-blue-800"
                                                >
                                                    Editar Rol
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>


                    {/* Gestión de Citas */}
                    <AppointmentManager />


                    {/* Chat en la tercera columna */}
                    <div className="col-span-1">
                        <ChatProvider>
                            <AdminChat isAdmin={true} userId={`admin_${user?.id}`} />
                        </ChatProvider>
                    </div>
                </div>
            </div>
            <ConfirmationModal
                isOpen={confirmationModal.isOpen}
                onClose={() => setConfirmationModal({ isOpen: false, title: '', message: '', onConfirm: null })}
                onConfirm={confirmationModal.onConfirm}
                title={confirmationModal.title}
                message={confirmationModal.message}
            />
        </div>
    );
}

function AppointmentManager() {
    const [appointments, setAppointments] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingAppointment, setEditingAppointment] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [confirmationModal, setConfirmationModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: null
    });

    const getAuthHeaders = () => {
        const userData = JSON.parse(localStorage.getItem('user'));
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userData?.token}`
        };
    };

    useEffect(() => {
        fetchAppointments();
        fetchServices();
    }, []);

    const showConfirmation = (title, message, onConfirm) => {
        setConfirmationModal({
            isOpen: true,
            title,
            message,
            onConfirm: () => {
                onConfirm();
                setConfirmationModal({ isOpen: false, title: '', message: '', onConfirm: null });
            }
        });
    };

    const fetchServices = async () => {
        try {
            const response = await fetch("http://localhost:5002/api/v1/services", {
                headers: getAuthHeaders()
            });
            if (!response.ok) throw new Error('Error al cargar servicios');
            const data = await response.json();
            setServices(data);
        } catch (error) {
            console.error('Error al cargar servicios:', error);
        }
    };

    const handleEditAppointment = async (appointmentData) => {
        try {
            const response = await fetch(`http://localhost:5003/api/v1/appointments/${appointmentData.id}`, {
                method: "PUT",
                headers: getAuthHeaders(),
                body: JSON.stringify(appointmentData),
            });

            if (!response.ok) throw new Error("Error al actualizar la cita");
            setShowEditModal(false);
            fetchAppointments(); // Recargar citas
        } catch (error) {
            console.error("Error:", error);
            alert("Error al actualizar la cita");
        }
    };

    const handleDeleteAppointment = async (id) => {
        showConfirmation(
            "Eliminar Cita",
            "¿Estás seguro de que deseas eliminar esta cita? Esta acción no se puede deshacer.",
            async () => {
                try {
                    const response = await fetch(`http://localhost:5003/api/v1/appointments/${id}`, {
                        method: "DELETE",
                        headers: getAuthHeaders()
                    });

                    if (!response.ok) throw new Error("Error al eliminar la cita");
                    fetchAppointments(); // Recargar citas
                } catch (error) {
                    console.error("Error:", error);
                    alert("Error al eliminar la cita");
                }

            }
        );
    };

    const fetchAppointments = async () => {
        try {
            // Añadir logs para debug
            console.log('Intentando obtener citas...');
            const headers = getAuthHeaders();
            console.log('Headers:', headers);


            const response = await fetch("http://localhost:5003/api/v1/appointments", {
                headers: getAuthHeaders()
            });
            if (!response.ok) throw new Error('Error al cargar citas');
            const data = await response.json();
            console.log("Fetched appointments:", data);
            setAppointments(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error al cargar citas:", error);
            setAppointments([]); // Si ocurre un error, aseguramos que sea un arreglo vacío
        } finally {
            setLoading(false);
        }
    };

    const updateAppointmentStatus = async (appointmentId, newStatus) => {
        showConfirmation(
            "Cambiar Estado de Cita",
            `¿Estás seguro de que deseas cambiar el estado de la cita a "${newStatus}"?`,
            async () => {
                try {
                    const response = await fetch(`http://localhost:5003/api/v1/appointments/${appointmentId}`, {
                        method: "PUT",
                        headers: getAuthHeaders(),
                        body: JSON.stringify({ estado: newStatus }),
                    });

                    if (!response.ok) throw new Error("Error al actualizar el estado");
                    fetchAppointments();
                } catch (error) {
                    console.error("Error al actualizar cita:", error);
                    alert("Error al actualizar el estado de la cita");
                }
            }
        );
    };

    if (loading) {
        return <div>Cargando citas...</div>;
    }

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-gray-800 text-2xl font-semibold mb-4">Gestión de Citas</h2>
            {loading ? (
                <p>Cargando citas...</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Servicio</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {appointments.map((appointment) => (
                                <tr key={appointment.id}>
                                    <td className="text-black px-6 py-4 whitespace-nowrap">
                                        {appointment.usuario?.nombre}
                                    </td>
                                    <td className="text-black px-6 py-4 whitespace-nowrap">
                                        {appointment.servicio?.nombre}
                                    </td>
                                    <td className="text-black px-6 py-4 whitespace-nowrap">
                                        {new Date(appointment.fecha).toLocaleString()}
                                    </td>
                                    <td className="text-black px-6 py-4 whitespace-nowrap">
                                        <select
                                            value={appointment.estado}
                                            onChange={(e) => updateAppointmentStatus(appointment.id, e.target.value)}
                                            className="rounded border p-1"
                                        >
                                            <option value="Pendiente">Pendiente</option>
                                            <option value="Confirmada">Confirmada</option>
                                            <option value="Completada">Completada</option>
                                            <option value="Cancelada">Cancelada</option>
                                        </select>
                                    </td>
                                    <td className="text-black px-6 py-4 whitespace-nowrap">
                                        {/* <button
                                            onClick={() => handleEditAppointment(appointment)}
                                            className="text-blue-600 hover:text-blue-900 mr-2"
                                        >
                                            Editar
                                        </button> */}
                                        <button
                                            onClick={() => handleDeleteAppointment(appointment.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <EditAppointmentModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                appointment={editingAppointment}
                services={services}
                onSave={handleEditAppointment}
            />
            <ConfirmationModal
                isOpen={confirmationModal.isOpen}
                onClose={() => setConfirmationModal({ isOpen: false, title: '', message: '', onConfirm: null })}
                onConfirm={confirmationModal.onConfirm}
                title={confirmationModal.title}
                message={confirmationModal.message}
            />
        </div>
    );
}