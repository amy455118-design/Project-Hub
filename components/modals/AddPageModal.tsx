

import React, { useState, useEffect, useCallback } from 'react';
import { Page } from '../../types';

interface AddPageModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (pageData: Omit<Page, 'id' | 'provider' | 'profileIds'> & { id?: string }) => Promise<void>;
    t: any;
    editingPage?: Page | null;
}

export const AddPageModal: React.FC<AddPageModalProps> = ({ isOpen, onClose, onSave, t, editingPage }) => {
    const [name, setName] = useState('');
    const [facebookId, setFacebookId] = useState('');
    const [error, setError] = useState('');

    const resetForm = useCallback(() => {
        setName('');
        setFacebookId('');
        setError('');
    }, []);

    useEffect(() => {
        if (isOpen) {
            if (editingPage) {
                setName(editingPage.name);
                setFacebookId(editingPage.facebookId);
            } else {
                resetForm();
            }
        }
    }, [isOpen, editingPage, resetForm]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleSave = async () => {
        setError('');
        if (name.trim() && facebookId.trim()) {
            try {
                await onSave(editingPage ? { id: editingPage.id, name, facebookId } : { name, facebookId });
                onClose();
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unknown error occurred.');
                }
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity" onClick={onClose}>
            <div className="bg-latte-mantle dark:bg-mocha-mantle rounded-xl shadow-2xl p-8 w-full max-w-lg transform transition-all" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-6 text-latte-text dark:text-mocha-text">{editingPage ? t.editPage : t.addPage}</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">{t.pageName}</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-latte-base dark:bg-mocha-base border border-latte-surface1 dark:border-mocha-surface1 focus:ring-2 focus:ring-latte-mauve dark:focus:ring-mocha-mauve focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">{t.facebookId}</label>
                        <input
                            type="text"
                            value={facebookId}
                            onChange={(e) => setFacebookId(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-latte-base dark:bg-mocha-base border border-latte-surface1 dark:border-mocha-surface1 focus:ring-2 focus:ring-latte-mauve dark:focus:ring-mocha-mauve focus:outline-none"
                        />
                    </div>
                    {error && <p className="text-sm text-center text-latte-red dark:text-mocha-red">{error}</p>}
                </div>
                <div className="mt-8 flex justify-end space-x-4">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-latte-surface1 dark:bg-mocha-surface1 font-semibold hover:bg-latte-surface2 dark:hover:bg-mocha-surface2 transition-colors">{t.cancel}</button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 rounded-lg bg-latte-mauve text-white dark:bg-mocha-mauve dark:text-mocha-crust font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                        disabled={!name.trim() || !facebookId.trim()}
                    >
                        {t.save}
                    </button>
                </div>
            </div>
        </div>
    );
};