import { XMarkIcon } from '@heroicons/react/24/outline';

export function ChatHeader({ onClose }) {
    return (
        <div className="bg-blue-500 text-white p-3 rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold">Chat de Atención</h3>
            <button
                onClick={onClose}
                className="hover:bg-blue-600 rounded-full p-1"
            >
                <XMarkIcon className="h-5 w-5" />
            </button>
        </div>
    );
}