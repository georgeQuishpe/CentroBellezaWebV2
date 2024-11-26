import { useEffect, useRef } from 'react';
import { useChat } from '../../context/ChatContext';
import moment from 'moment';
import 'moment/locale/es';

moment.locale('es');

export function MessageList() {
    const { messages } = useChat();
    const bottomRef = useRef(null);

    // Scroll automático al último mensaje
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
                <div
                    key={index}
                    className={`flex ${message.isAdmin ? 'justify-start' : 'justify-end'}`}
                >
                    <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                            message.isAdmin
                                ? 'bg-gray-100'
                                : 'bg-blue-500 text-white'
                        }`}
                    >
                        <p className="text-sm">{message.content}</p>
                        <span className="text-xs mt-1 opacity-75 block">
                            {moment(message.timestamp).fromNow()}
                        </span>
                    </div>
                </div>
            ))}
            <div ref={bottomRef} />
        </div>
    );
}