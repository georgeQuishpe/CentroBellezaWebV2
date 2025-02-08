import { ChatProvider } from "../context/ChatContext";
import './globals.css';

export const metadata = {
  title: 'Peluquería Web',
  description: 'Sistema de gestión para peluquerías',
};

export default function RootLayout({ children }) {
  const userId = typeof window !== "undefined" && localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).id
    : "guest";

  return (


    <html lang="es">
      <body>
        {/* Envuelve toda la aplicación con el ChatProvider */}
        <ChatProvider userId={userId}>
          {children}
        </ChatProvider>
      </body>
    </html>
  );
}
