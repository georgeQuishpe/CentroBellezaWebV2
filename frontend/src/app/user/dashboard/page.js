'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChatProvider } from '../../../context/ChatContext';
import { ChatWindow } from '../../../components/Chat/ChatWindow';

export default function UserDashboard() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [mounted, setMounted] = useState(false);
    const [services, setServices] = useState([]);

    // Efecto para la hidratación
    useEffect(() => {
        setMounted(true);
    }, []);

    // Efecto para autenticación y carga de datos
    useEffect(() => {
        const initializeUser = async () => {
            try {
                const userData = localStorage.getItem('user');
                if (!userData) {
                    router.push('/login');
                    return;
                }

                const parsedUser = JSON.parse(userData);
                if (parsedUser.rol === 'Admin') {
                    router.push('/admin/dashboard');
                    return;
                }

                setUser(parsedUser);

                // Cargar servicios
                const servicesResponse = await fetch('http://localhost:5000/api/v1/services');
                if (!servicesResponse.ok) {
                    throw new Error('Error al cargar los servicios');
                }

                const servicesData = await servicesResponse.json();
                setServices(servicesData);
            } catch (err) {
                console.error(err);
                router.push('/login');
            }
        };

        initializeUser();
    }, [router]);

    if (!mounted || !user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold mb-4">Panel de Usuario</h1>

                <div className="grid gap-6">
                    {/* Lista de Servicios (2/3 del espacio) */}
                    <div className="col-span-2 bg-white p-4 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4">Servicios Disponibles</h2>
                        <div className="space-y-4">
                            {services.map((service) => (
                                <div
                                    key={service.id}
                                    className="border p-3 rounded-lg"
                                >
                                    <h3 className="font-bold">{service.nombre}</h3>
                                    <p className="text-gray-600">{service.descripcion}</p>
                                    <div className="mt-2 flex justify-between items-center">
                                        <span className="text-gray-500">
                                            ${service.precio} - {service.duracion} min
                                        </span>
                                        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                                            Reservar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <ChatProvider userId={user.id}>
                        <ChatWindow isAdmin={false} />
                    </ChatProvider>
                </div>
            </div>
        </div>
    );
}