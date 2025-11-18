
import React from 'react';

interface ConfirmDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: React.ReactNode;
    t: any;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ isOpen, onClose, onConfirm, title, message, t }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity">
            <div className="bg-latte-mantle dark:bg-mocha-mantle rounded-xl shadow-2xl p-8 w-full max-w-md transform transition-all">
                <h2 className="text-xl font-bold mb-4 text-latte-text dark:text-mocha-text">{title}</h2>
                <div className="mb-6 text-latte-subtext1 dark:text-mocha-subtext1">{message}</div>
                <div className="flex justify-end space-x-4">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-latte-surface1 dark:bg-mocha-surface1 font-semibold hover:bg-latte-surface2 dark:hover:bg-mocha-surface2 transition-colors">{t.cancel}</button>
                    <button onClick={onConfirm} className="px-4 py-2 rounded-lg bg-latte-red text-white dark:bg-mocha-red dark:text-mocha-crust font-semibold hover:opacity-90 transition-opacity">{t.delete}</button>
                </div>
            </div>
        </div>
    );
};
