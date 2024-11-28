"use client";
import { useEffect, useRef } from "react";
import { useChat } from "../../context/ChatContext";
import moment from "moment";
import "moment/locale/es";

moment.locale("es");

export function MessageList() {
  const { messages, selectedUserId, isAdmin, userId } = useChat();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const filteredMessages =
    isAdmin && selectedUserId
      ? messages.filter(
          (msg) =>
            msg.usuarioId === selectedUserId || msg.toUserId === selectedUserId
        )
      : messages;

  const isOwnMessage = (message) => {
    if (isAdmin) {
      return message.usuarioId.includes("admin");
    }
    return (
      message.usuarioId !== "admin" && !message.usuarioId.includes("admin")
    );
  };

  const isUserMessage = (message) => {
    if (isAdmin) {
      return message.usuarioId === selectedUserId;
    }
    return message.usuarioId === userId;
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {filteredMessages.map((message) => {
        const isOwn = isOwnMessage(message);
        return (
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
              <div className="text-xs mb-1">
                {isUserMessage(message)
                  ? isAdmin
                    ? message.usuario?.nombre
                    : "Tú"
                  : "Soporte"}
              </div>
              <p className="text-sm">{message.mensaje}</p>
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
