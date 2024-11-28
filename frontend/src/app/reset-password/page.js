'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ResetPasswordPage() {
    const [formData, setFormData] = useState({
        email: '',
        code: '',
        newPassword: '',
        confirmPassword: ''
    })
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setMessage('')
        setLoading(true)

        if (formData.newPassword !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden')
            setLoading(false)
            return
        }

        try {
            const response = await fetch('http://localhost:5000/api/v1/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    code: formData.code,
                    newPassword: formData.newPassword
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Error al restablecer la contraseña')
            }

            setMessage('Contraseña restablecida exitosamente')

            // Redirigir al login después de unos segundos
            setTimeout(() => {
                router.push('/login')
            }, 2000)

        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h1 className="text-blue-500 text-2xl font-bold text-center mb-6">Restablecer Contraseña</h1>

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
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="text-black w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-2">Código de verificación</label>
                        <input
                            type="text"
                            name="code"
                            value={formData.code}
                            onChange={handleChange}
                            className="text-black w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-2">Nueva contraseña</label>
                        <input
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            className="text-black w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500"
                            required
                            minLength="8"
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-2">Confirmar contraseña</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="text-black w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500"
                            required
                            minLength="8"
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        className={`w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        disabled={loading}
                    >
                        {loading ? 'Procesando...' : 'Restablecer contraseña'}
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