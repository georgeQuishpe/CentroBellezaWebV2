"use client";
import { useEffect, useState } from 'react';
import { Scissors, Droplet, Award } from 'lucide-react';

export default function ClientDashboard() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      const response = await fetch('https://peluqueriawebapi.onrender.com/api/v1/services');
      const data = await response.json();
      setServices(data);
    };

    fetchServices();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-8">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl overflow-hidden">
        <div className="bg-gray-100 border-b border-gray-200 p-6 text-center">
          <h1 className="text-4xl font-light text-gray-800 flex items-center justify-center gap-4">
            <Scissors className="text-gray-600" size={40} />
            Servicios del Salón
            <Droplet className="text-gray-600" size={40} />
          </h1>
        </div>

        <div className="p-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div 
                key={service.id} 
                className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <Award className="text-gray-500 mr-3" size={24} />
                    <h2 className="text-xl font-medium text-gray-800">{service.nombre}</h2>
                  </div>
                  <p className="text-gray-600 mb-4">{service.descripcion}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-700">
                      ${service.precio}
                    </span>
                    <button className="bg-gray-800 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition-colors">
                      Reservar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}