import './globals.css'

export const metadata = {
  title: 'Peluquería Web',
  description: 'Sistema de gestión para peluquerías',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  )
}