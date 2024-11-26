import { ChatProvider } from "../context/ChatContext";
import './globals.css'

export const metadata = {
  title: 'Peluquería Web',
  description: 'Sistema de gestión para peluquerías',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {/* Envuelve toda la aplicación con el ChatProvider */}
        <ChatProvider userId="guest">
          {children}
        </ChatProvider>
      </body>
    </html>
  );
}