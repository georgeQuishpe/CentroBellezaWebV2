"use client";
import { useEffect, useRef } from "react";
import { useChat } from "../../context/ChatContext";
import moment from "moment";
import "moment/locale/es";

moment.locale("es");

export function MessageList() {
  // export function MessageList({ messages }) {
  // Agregar prop messages
  // Usar los mensajes que vienen como prop
  // const { messages, selectedUserId, isAdmin, userId } = useChat();
  // const { userId, isAdmin, selectedUserId } = useChat(); // Solo obtener userId e isAdmin del contexto

  const { messages, selectedUserId, isAdmin, userId } = useChat();

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!messages?.length) return null;

  // const filteredMessages =
  //   isAdmin && selectedUserId
  //     ? messages.filter(
  //         (msg) =>
  //           msg.usuarioId === selectedUserId || msg.toUserId === selectedUserId
  //       )
  //     : messages;

  // const filteredMessages =
  //   isAdmin && selectedUserId
  //     ? messages.filter(
  //         (msg) =>
  //           msg.usuarioId === selectedUserId ||
  //           msg.toUserId === selectedUserId ||
  //           (msg.usuarioId.includes("admin_") &&
  //             msg.toUserId === selectedUserId)
  //       )
  //     : messages.filter(
  //         (msg) => msg.usuarioId === userId || msg.toUserId === userId
  //       );

  // const filteredMessages =
  //   isAdmin && selectedUserId
  //     ? messages.filter(
  //         (msg) =>
  //           msg.usuarioId === selectedUserId ||
  //           msg.toUserId === selectedUserId ||
  //           (msg.usuarioId === `admin_${userId}` &&
  //             msg.toUserId === selectedUserId)
  //       )
  //     : messages.filter(
  //         (msg) =>
  //           msg.usuarioId === userId ||
  //           msg.toUserId === userId ||
  //           msg.usuarioId === "admin" ||
  //           msg.toUserId === "admin"
  //       );

  // const filteredMessages =
  //   isAdmin && selectedUserId
  //     ? messages.filter(
  //         (msg) =>
  //           msg.usuarioId === selectedUserId ||
  //           msg.toUserId === selectedUserId ||
  //           msg.usuarioId.startsWith("admin_")
  //       )
  //     : messages.filter(
  //         (msg) => msg.usuarioId === userId || msg.toUserId === userId
  //       );

  const filteredMessages = messages.filter((msg) => {
    console.log("Filtering message:", {
      msg,
      selectedUserId,
      conditions: {
        userIdMatch: msg.usuarioId === selectedUserId,
        toUserIdMatch: msg.toUserId === selectedUserId,
        isAdminMessage: msg.usuarioId.startsWith("admin_"),
      },
    });

    if (isAdmin && selectedUserId) {
      return (
        msg.usuarioId === selectedUserId ||
        msg.toUserId === selectedUserId ||
        msg.usuarioId.startsWith("admin_")
      );
    }
    return msg.usuarioId === userId || msg.toUserId === userId;
  });

  // const filteredMessages =
  //   isAdmin && selectedUserId
  //     ? messages.filter(
  //         (msg) =>
  //           // Solo mostrar mensajes entre el admin y el usuario seleccionado
  //           (msg.usuarioId === selectedUserId &&
  //             msg.toUserId.startsWith("admin_")) ||
  //           (msg.usuarioId.startsWith("admin_") &&
  //             msg.toUserId === selectedUserId)
  //       )
  //     : messages.filter(
  //         (msg) => msg.usuarioId === userId || msg.toUserId === userId
  //       );

  // const isOwnMessage = (message) => {
  //   if (isAdmin) {
  //     return message.usuarioId.includes("admin");
  //   }
  //   return (
  //     message.usuarioId !== "admin" && !message.usuarioId.includes("admin")
  //   );
  // };

  // const isOwnMessage = (message) => {
  //   if (isAdmin) {
  //     return message.usuarioId.includes("admin_");
  //   }
  //   return message.usuarioId === userId;
  // };

  // const isOwnMessage = (message) => {
  //   if (isAdmin) {
  //     return message.usuarioId === `admin_${userId}`;
  //   }
  //   return message.usuarioId === userId;
  // };

  // const isOwnMessage = (message) => {
  //   console.log("Checking message:", {
  //     message,
  //     isAdmin,
  //     userId,
  //     isStartingWithAdmin: message.usuarioId.startsWith("admin_"),
  //   });

  //   if (isAdmin) {
  //     // Si es admin, los mensajes propios son los que vienen del admin
  //     return (
  //       message.usuarioId.startsWith("admin_") || message.usuarioId === userId
  //     );
  //   }
  //   // Si es cliente, los mensajes propios son los que tienen su userId
  //   return message.usuarioId === userId;
  // };

  const isOwnMessage = (message) => {
    if (isAdmin) {
      // Si es admin, los mensajes propios son los que empiezan con admin_
      return message.usuarioId.startsWith("admin_");
    }
    // Si es cliente, los mensajes propios son los que tienen su userId exacto
    return message.usuarioId === userId;
  };

  // const isUserMessage = (message) => {
  //   if (isAdmin) {
  //     // En el chat del admin, los mensajes del usuario seleccionado van a la izquierda
  //     return message.usuarioId === selectedUserId;
  //   }
  //   // En el chat del cliente, sus propios mensajes van a la derecha
  //   return message.usuarioId === userId;
  // };

  // const isUserMessage = (message) => {
  //   if (isAdmin) {
  //     // En vista de admin:
  //     // - Mensajes del usuario seleccionado van a la izquierda (gris)
  //     // - Mensajes del admin van a la derecha (azul)
  //     return message.usuarioId === selectedUserId;
  //   } else {
  //     // En vista de cliente:
  //     // - Mensajes del cliente van a la derecha (azul)
  //     // - Mensajes del admin van a la izquierda (gris)
  //     return (
  //       message.usuarioId.startsWith("admin_") || message.usuarioId === "admin"
  //     );
  //   }
  // };

  const isUserMessage = (message) => {
    if (isAdmin) {
      // En vista de admin:
      // - Mensajes del usuario seleccionado van a la izquierda (gris)
      return message.usuarioId === selectedUserId;
    }
    // En vista de cliente:
    // - Mensajes propios van a la derecha (azul)
    // - Mensajes del admin van a la izquierda (gris)
    return !isOwnMessage(message);
  };

  console.log("Messages:", messages);
  console.log("Selected User:", selectedUserId);
  console.log("Filtered Messages:", filteredMessages);

  return (
    // <div className="flex-1 overflow-y-auto p-4 space-y-4">
    //   {filteredMessages.map((message) => {
    //     const isOwn = isOwnMessage(message);
    //     return (
    //       <div
    //         key={message.id}
    //         className={`flex ${
    //           isUserMessage(message) ? "justify-start" : "justify-end"
    //         }`}
    //       >
    //         <div
    //           className={`max-w-[80%] rounded-lg p-3 ${
    //             isUserMessage(message)
    //               ? "bg-gray-100 text-black"
    //               : "bg-blue-500 text-white"
    //           }`}
    //         >
    //           <div className="text-xs mb-1">
    //             {isUserMessage(message)
    //               ? isAdmin
    //                 ? message.usuario?.nombre
    //                 : "Tú"
    //               : "Soporte"}
    //           </div>
    //           <p className="text-sm">{message.mensaje}</p>
    //         </div>
    //       </div>
    //     );
    //   })}
    //   <div ref={bottomRef} />
    // </div>

    // <div className="flex-1 overflow-y-auto p-4 space-y-4">
    //   {messages.map((message, index) => (
    //     <div
    //       key={message.id || index}
    //       className={`flex ${
    //         message.usuarioId === userId ? "justify-end" : "justify-start"
    //       }`}
    //     >
    //       <div
    //         className={`max-w-[70%] rounded-lg p-3 ${
    //           message.usuarioId === userId
    //             ? "bg-blue-500 text-white"
    //             : "bg-gray-200 text-black"
    //         }`}
    //       >
    //         <p>{message.mensaje}</p>
    //         <span className="text-xs opacity-75">
    //           {new Date(message.fechaEnvio).toLocaleTimeString()}
    //         </span>
    //       </div>
    //     </div>
    //   ))}
    //   <div ref={bottomRef} />
    // </div>

    // <div className="flex-1 overflow-y-auto p-4 space-y-4">
    //   {filteredMessages.map((message) => (
    //     <div
    //       key={message.id}
    //       className={`flex ${
    //         message.usuarioId === userId ? "justify-end" : "justify-start"
    //       }`}
    //     >
    //       <div
    //         className={`max-w-[70%] rounded-lg p-3 ${
    //           message.usuarioId === userId
    //             ? "bg-blue-500 text-white"
    //             : "bg-gray-200 text-black"
    //         }`}
    //       >
    //         <p>{message.mensaje}</p>
    //         <span className="text-xs opacity-75">
    //           {moment(message.fechaEnvio).format("LT")}
    //         </span>
    //       </div>
    //     </div>
    //   ))}
    //   <div ref={bottomRef} />
    // </div>

    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      <div className="text-xs text-gray-500 mb-2">
        Debug: Admin: {isAdmin ? "true" : "false"}, UserId: {userId},
        SelectedUserId: {selectedUserId}
      </div>
      {filteredMessages.map((message, index) => (
        // <div
        //   // Usar una combinación única de id y index como key
        //   key={`${message.id}-${index}`}
        //   className={`flex ${
        //     message.usuarioId === userId ? "justify-end" : "justify-start"
        //   }`}
        // >
        // <div
        //   key={`${message.id}-${index}`}
        //   className={`flex ${
        //     isOwnMessage(message) ? "justify-end" : "justify-start"
        //   }`}
        // >
        //   <div
        //     className={`max-w-[70%] rounded-lg p-3 ${
        //       isOwnMessage(message)
        //         ? "bg-blue-500 text-white"
        //         : "bg-gray-200 text-black"
        //     }`}
        //   >
        //     <p>{message.mensaje}</p>
        //     <span className="text-xs opacity-75">
        //       {moment(message.fechaEnvio).format("LT")}
        //     </span>
        //   </div>

        <div
          key={`${message.id}-${index}`}
          className={`flex ${
            isOwnMessage(message) ? "justify-end" : "justify-start"
            // isUserMessage(message) ? "justify-start" : "justify-end"
          }`}
        >
          <div
            className={`max-w-[70%] rounded-lg p-3 ${
              isOwnMessage(message)
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-black"
            }`}
            //   isUserMessage(message)
            //     ? "bg-gray-200 text-black"
            //     : "bg-blue-500 text-white"
            // }`}
          >
            {/* <div className="text-xs mb-1">
              From: {message.usuarioId}, To: {message.toUserId}
            </div>
            <p>{message.mensaje}</p>
            <span className="text-xs opacity-75">
              {moment(message.fechaEnvio).format("LT")}
            </span> */}

            {/* <div className="text-xs mb-1">
              {isUserMessage(message)
                ? `De: ${message.usuarioId}`
                : `De: Admin`}
            </div> */}

            <div className="text-xs mb-1">
              {isOwnMessage(message) ? "Tú" : `De: ${message.usuarioId}`}
            </div>
            <p>{message.mensaje}</p>
            <span className="text-xs opacity-75">
              {moment(message.fechaEnvio).format("LT")}
            </span>
          </div>

          {/* <div
            className={`max-w-[70%] rounded-lg p-3 ${
              message.usuarioId === userId
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-black"
            }`}
          > */}
        </div>
      ))}
      <div ref={bottomRef} />
      {/* <div /> */}
    </div>
  );
}
