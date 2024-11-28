'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch('http://localhost:5000/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión')
      }

      // Guardar en localStorage y cookie
      localStorage.setItem('user', JSON.stringify(data));
      document.cookie = `user=${JSON.stringify(data)}; path=/; max-age=86400`; // Expira en 24 horas

      // Modificar la parte de redirección
      if (data.rol === 'Admin') {
        router.push('/admin/dashboard')  // Asegúrate de que esta ruta coincida con tu estructura
      } else {
        router.push('/user/dashboard')  // Ruta para usuarios normales
      }
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl text-blue-500 font-bold text-center mb-6">Iniciar Sesión</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
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
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-black w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            Ingresar
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link
            href="/signup"
            className="text-blue-500 hover:text-blue-600"
          >
            Crear cuenta
          </Link>
          <span className="mx-2">|</span>
          <Link
            href="/forgot-password"
            className="text-blue-500 hover:text-blue-600"
          >
            Olvidé mi contraseña
          </Link>
        </div>
      </div>
    </div>
  )
}