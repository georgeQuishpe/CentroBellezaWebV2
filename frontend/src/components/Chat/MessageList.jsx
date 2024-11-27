"use client";
import { useEffect, useRef } from "react";
import { useChat } from "../../context/ChatContext";
import moment from "moment";
import "moment/locale/es";

moment.locale("es");
// Agregar al inicio del componente

export function MessageList() {
  const { messages, selectedUserId, isAdmin } = useChat();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (timestamp) => {
    const messageDate = moment(timestamp);
    const now = moment();

    if (messageDate.isSame(now, "day")) {
      return messageDate.format("HH:mm");
    } else if (messageDate.isSame(now.subtract(1, "day"), "day")) {
      return "Ayer " + messageDate.format("HH:mm");
    } else {
      return messageDate.format("DD/MM/YYYY HH:mm");
    }
  };

  // Filtrar mensajes según el contexto
  const filteredMessages =
    isAdmin && selectedUserId
      ? messages.filter(
          (msg) =>
            msg.usuarioId === selectedUserId ||
            (msg.usuarioId.startsWith("admin_") &&
              msg.toUserId === selectedUserId)
        )
      : messages;

  if (!filteredMessages || filteredMessages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        {isAdmin && !selectedUserId
          ? "Selecciona un chat para ver los mensajes"
          : "No hay mensajes aún"}
      </div>
    );
  }

  const { connected } = useChat();

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {filteredMessages.map((message, index) => (
        <div
          key={message.id || index}
          className={`flex ${
            (
              isAdmin
                ? message.usuarioId.startsWith("admin")
                : !message.usuarioId.startsWith("admin")
            )
              ? "justify-end"
              : "justify-start"
          }`}
        >
          <div
            className={`max-w-[80%] rounded-lg p-3 ${
              (
                isAdmin
                  ? message.usuarioId.startsWith("admin")
                  : !message.usuarioId.startsWith("admin")
              )
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-black"
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
      {!connected && (
        <div className="absolute bottom-0 left-0 right-0 bg-yellow-100 text-yellow-800 px-4 py-2 text-sm">
          Reconectando...
        </div>
      )}
    </div>
  );
}
