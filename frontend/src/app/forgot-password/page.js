'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setMessage('')
        setLoading(true)

        try {
            const response = await fetch('http://localhost:5000/api/v1/auth/recover-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            })

            // Registrar la respuesta para depuración
            console.log('Response status:', response.status);
            const responseText = await response.text();
            console.log('Response text:', responseText);

            let data;
            try {
                data = JSON.parse(responseText);
            } catch (e) {
                console.error('Error parsing JSON:', e);
                throw new Error('Error en la respuesta del servidor');
            }

            if (!response.ok) {
                throw new Error(data.message || 'Error al procesar la solicitud');
            }

            setMessage('Se ha enviado un código de recuperación a tu correo electrónico.');

            // Almacenar el código temporalmente (solo para desarrollo)
            if (data.code) {
                localStorage.setItem('tempRecoveryCode', data.code);
            }

            // Redirigir después de mostrar el mensaje
            setTimeout(() => {
                router.push(`/reset-password?email=${encodeURIComponent(email)}`);
            }, 2000);

        } catch (err) {
            setError(err.message);
            console.error('Error completo:', err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h1 className="text-blue-500 text-2xl font-bold text-center mb-6">Recuperar Contraseña</h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="text-black w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500"
                            placeholder="ejemplo@correo.com"
                            required
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        className={`w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        disabled={loading}
                    >
                        {loading ? 'Enviando...' : 'Enviar código de recuperación'}
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <Link
                        href="/login"
                        className="text-blue-500 hover:text-blue-600"
                    >
                        Volver al inicio de sesión
                    </Link>
                </div>
            </div>
        </div>
    )
}