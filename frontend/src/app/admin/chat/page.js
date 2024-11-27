'use client'
import { useState } from 'react'
import { ChatProvider } from '../../../context/ChatContext'
import { ChatWindow } from '../../../components/Chat/ChatWindow'

export default function AdminChatPage() {
    const [adminId] = useState('admin_1')

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <h1 className="text-2xl font-bold mb-4">Panel de Chat - Administrador</h1>

            <div className="bg-white rounded-lg p-4 shadow mb-4">
                <p>Admin ID: {adminId}</p>
            </div>

            <ChatProvider userId={adminId}>
                <ChatWindow />
            </ChatProvider>
        </div>
    )
}