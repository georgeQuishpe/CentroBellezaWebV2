import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Peluquería Web</h1>
      <nav className="space-y-2">
        <Link
          href="/chat"
          className="block p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Ir al Chat
        </Link>
      </nav>
    </main>
  )
}