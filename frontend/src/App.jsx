import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ChatTest } from "./pages/ChatTest";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/chat-test" element={<ChatTest />} />
        <Route path="/admin-chat" element={<AdminChat />} />
      </Routes>
    </Router>
  );
}

export default App; // Asegúrate de que esta línea esté presente
