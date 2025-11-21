
import React, { useState, useEffect } from 'react';
import { Integration } from '../../types';

interface AddIntegrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Omit<Integration, 'id'> & { id?: string }) => void;
    t: any;
    editingIntegration?: Integration | null;
}

export const AddIntegrationModal: React.FC<AddIntegrationModalProps> = ({ isOpen, onClose, onSave, t, editingIntegration }) => {
    const [name, setName] = useState('');
    const [baseUrl, setBaseUrl] = useState('');
    const [loginUrl, setLoginUrl] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [userId, setUserId] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (editingIntegration) {
                setName(editingIntegration.name);
                setBaseUrl(editingIntegration.baseUrl);
                setLoginUrl(editingIntegration.loginUrl);
                setUsername(editingIntegration.username);
                setPassword(editingIntegration.password);
                setUserId(editingIntegration.userId);
            } else {
                setName('');
                setBaseUrl('');
                setLoginUrl('');
                setUsername('');
                setPassword('');
                setUserId('');
            }
        }
    }, [isOpen, editingIntegration]);

    if (!isOpen) return null;

    const handleSave = () => {
        if (name.trim()) {
            onSave({
                id: editingIntegration?.id,
                name,
                baseUrl,
                loginUrl,
                username,
                password,
                userId
            });
        }
    };

    const inputClass = "w-full px-3 py-2 rounded-lg bg-latte-base dark:bg-mocha-base border border-latte-surface1 dark:border-mocha-surface1 focus:ring-2 focus:ring-latte-mauve dark:focus:ring-mocha-mauve focus:outline-none";
    const labelClass = "block text-sm font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity" onClick={onClose}>
            <div className="bg-latte-mantle dark:bg-mocha-mantle rounded-xl shadow-2xl p-8 w-full max-w-md transform transition-all" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-6 text-latte-text dark:text-mocha-text">{editingIntegration ? t.editIntegration : t.addIntegration}</h2>
                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                    <div>
                        <label className={labelClass}>{t.integrationName}</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
                    </div>
                    <div>
                        <label className={labelClass}>{t.baseUrl}</label>
                        <input type="url" value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} className={inputClass} />
                    </div>
                    <div>
                        <label className={labelClass}>{t.loginUrl}</label>
                        <input type="url" value={loginUrl} onChange={(e) => setLoginUrl(e.target.value)} className={inputClass} />
                    </div>
                    <div>
                        <label className={labelClass}>{t.username}</label>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className={inputClass} />
                    </div>
                    <div>
                        <label className={labelClass}>{t.password}</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
                    </div>
                    <div>
                        <label className={labelClass}>{t.userId}</label>
                        <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} className={inputClass} />
                    </div>
                </div>
                <div className="mt-8 flex justify-end space-x-4">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-latte-surface1 dark:bg-mocha-surface1 font-semibold hover:bg-latte-surface2 dark:hover:bg-mocha-surface2 transition-colors">{t.cancel}</button>
                    <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-latte-mauve text-white dark:bg-mocha-mauve dark:text-mocha-crust font-semibold hover:opacity-90 transition-opacity disabled:opacity-50" disabled={!name.trim()}>
                        {t.save}
                    </button>
                </div>
            </div>
        </div>
    );
};
