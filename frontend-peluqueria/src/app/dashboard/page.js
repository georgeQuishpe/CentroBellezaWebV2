"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChatWindow } from "../../components/Chat/ChatWindow";
import { useChat } from "../../context/ChatContext";

export default function Dashboard() {
    const [services, setServices] = useState([]);
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const router = useRouter();
    const { chatOpen, setChatOpen } = useChat();

    useEffect(() => {
        // Verificar si el usuario está autenticado
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser) {
            router.push("/login");
        } else {
            setUser(storedUser);
            setIsAdmin(storedUser.rol === "Admin");
        }
    }, [router]);

    useEffect(() => {
        // Obtener los servicios desde el backend
        const fetchServices = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/v1/services");
                const data = await response.json();
                if (response.ok) {
                    setServices(data);
                } else {
                    console.error("Error al obtener servicios:", data.message);
                }
            } catch (error) {
                console.error("Error en la solicitud:", error);
            }
        };

        fetchServices();
    }, []);

    const handleRoleChange = async (userId, newRole) => {
        if (!isAdmin) return;
        try {
            const response = await fetch(
                `http://localhost:5000/api/v1/users/${userId}/role`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ role: newRole }),
                }
            );
            const data = await response.json();
            if (response.ok) {
                alert(`Rol actualizado a ${newRole}`);
            } else {
                console.error("Error al cambiar rol:", data.message);
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Panel de Servicios */}
                <div className="flex-1 bg-white p-4 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Servicios</h2>
                    <ul className="space-y-4">
                        {services.map((service) => (
                            <li
                                key={service.id}
                                className="border p-3 rounded-lg flex justify-between items-center"
                            >
                                <div>
                                    <h3 className="font-bold">{service.nombre}</h3>
                                    <p>{service.descripcion}</p>
                                    <span className="text-gray-500">
                                        ${service.precio} - {service.duracion} min
                                    </span>
                                </div>
                                {isAdmin && (
                                    <button className="text-blue-500 hover:underline">
                                        Editar
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Panel de Configuración */}
                {isAdmin && (
                    <div className="w-full lg:w-1/3 bg-white p-4 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4">Configuración</h2>
                        <p className="mb-2">
                            Bienvenido, administrador. Aquí puedes gestionar el sistema.
                        </p>
                        <ul className="space-y-2">
                            <li>
                                <button
                                    className="text-blue-500 hover:underline"
                                    onClick={() => handleRoleChange("some-user-id", "Admin")}
                                >
                                    Convertir usuario a Admin
                                </button>
                            </li>
                            <li>
                                <button className="text-blue-500 hover:underline">
                                    Agregar nuevo servicio
                                </button>
                            </li>
                        </ul>
                    </div>
                )}
            </div>

            {/* Chat */}
            <div>
                {!chatOpen && (
                    <button
                        className="fixed bottom-4 right-4 bg-blue-500 text-white rounded-full p-3 shadow-lg hover:bg-blue-600"
                        onClick={() => setChatOpen(true)}
                    >
                        Abrir Chat
                    </button>
                )}
                {chatOpen && <ChatWindow />}
            </div>
        </div>
    );
}
