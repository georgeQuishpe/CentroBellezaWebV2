import { ChatProvider } from "./context/ChatContext";
import { ChatWindow } from "./components/Chat/ChatWindow";

function App() {
  return (
    <ChatProvider userId="usuario_actual_id">
      {/* Resto de tu aplicación */}
      <ChatWindow />
    </ChatProvider>
  );
}
