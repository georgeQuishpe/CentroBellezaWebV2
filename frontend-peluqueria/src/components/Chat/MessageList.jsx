"use client";
import { useEffect, useRef } from "react";
import { useChat } from "../../context/ChatContext";
import moment from "moment";
import "moment/locale/es";

moment.locale("es");

export function MessageList() {
  const { messages } = useChat();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (timestamp) => {
    const messageDate = moment(timestamp);
    const now = moment();

    if (messageDate.isSame(now, "day")) {
      return messageDate.format("HH:mm"); // Solo hora para mensajes de hoy
    } else if (messageDate.isSame(now.subtract(1, "day"), "day")) {
      return "Ayer " + messageDate.format("HH:mm");
    } else {
      return messageDate.format("DD/MM/YYYY HH:mm"); // Fecha completa para otros días
    }
  };

  if (!messages || messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        No hay mensajes aún
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.usuarioId === "admin" ? "justify-start" : "justify-end"
          }`}
        >
          <div
            className={`max-w-[80%] rounded-lg p-3 ${
              message.usuarioId === "admin"
                ? "bg-gray-100"
                : "bg-blue-500 text-white"
            }`}
          >
            <p className="text-sm">{message.mensaje}</p>
            <span className="text-xs mt-1 opacity-75 block">
              {formatTime(message.fechaEnvio)}
            </span>
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
