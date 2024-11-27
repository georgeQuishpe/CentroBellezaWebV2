import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ChatTest } from "./pages/ChatTest";
import { AdminChat } from "./pages/AdminChat";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/forgotPassword";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/chat-test" element={<ChatTest />} />
        <Route path="/admin-chat" element={<AdminChat />} />

      </Routes>
    </Router>
  );
}

export default App; // Asegúrate de que esta línea esté presente
