"use client";
import { useEffect, useRef } from "react";
import { useChat } from "../../context/ChatContext";
import moment from "moment";
import "moment/locale/es";

moment.locale("es");

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
    }
    return messageDate.format("DD/MM/YYYY HH:mm");
  };

  const filteredMessages =
    isAdmin && selectedUserId
      ? messages.filter(
          (msg) =>
            msg.usuarioId === selectedUserId || msg.toUserId === selectedUserId
        )
      : messages;

  if (!filteredMessages?.length) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        {isAdmin && !selectedUserId
          ? "Selecciona un chat para ver los mensajes"
          : "No hay mensajes aún"}
      </div>
    );
  }

  const isUserMessage = (message) => {
    if (isAdmin) {
      return !message.usuarioId.startsWith("admin");
    }
    return message.usuarioId === selectedUserId;
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {filteredMessages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            isUserMessage(message) ? "justify-start" : "justify-end"
          }`}
        >
          <div
            className={`max-w-[80%] rounded-lg p-3 ${
              isUserMessage(message)
                ? "bg-gray-100 text-black"
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
