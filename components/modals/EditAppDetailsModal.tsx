
import React, { useState, useEffect } from 'react';
import { App, Partnership } from '../../types';
import { SearchableSelect } from '../ui/SearchableSelect';

interface EditAppDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    t: any;
    app: App;
    partnerships: Partnership[];
    onSave: (app: App) => void;
}

export const EditAppDetailsModal: React.FC<EditAppDetailsModalProps> = ({ isOpen, onClose, t, app, partnerships, onSave }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [url, setUrl] = useState('');
    const [partnershipId, setPartnershipId] = useState<string | undefined>(undefined);

    const inputStyle = "w-full px-3 py-2 rounded-lg bg-latte-base dark:bg-mocha-base border border-latte-surface1 dark:border-mocha-surface1 focus:ring-2 focus:ring-latte-mauve dark:focus:ring-mocha-mauve focus:outline-none";

    useEffect(() => {
        if (app) {
            setUsername(app.username || '');
            setPassword(app.password || '');
            setUrl(app.url || '');
            setPartnershipId(app.partnershipId);
        }
    }, [app]);

    if (!isOpen) return null;

    const handleSave = () => {
        onSave({ ...app, username, password, url, partnershipId });
    };

    const partnershipOptions = partnerships.map(p => ({ value: p.id, label: p.name }));

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
            <div className="bg-latte-mantle dark:bg-mocha-mantle rounded-xl p-8 w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-6">{t.editApp}: {app.name}</h2>
                <div className="space-y-4">
                    <h3 className="font-semibold">{t.appCredentials}</h3>
                    <input type="text" placeholder={t.username} value={username} onChange={e => setUsername(e.target.value)} className={inputStyle} />
                    <input type="text" placeholder={t.password} value={password} onChange={e => setPassword(e.target.value)} className={inputStyle} />
                    <h3 className="font-semibold pt-2">{t.appUrl}</h3>
                    <input type="url" placeholder="https://..." value={url} onChange={e => setUrl(e.target.value)} className={inputStyle} />
                    <h3 className="font-semibold pt-2">{t.partnership}</h3>
                    <SearchableSelect options={partnershipOptions} selected={partnershipId || ''} onChange={setPartnershipId} placeholder={t.selectPartnership} searchPlaceholder={t.searchPartnerships} />
                </div>
                <div className="mt-8 flex justify-end space-x-4">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-latte-surface1 dark:bg-mocha-surface1 font-semibold">{t.cancel}</button>
                    <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-latte-mauve text-white dark:bg-mocha-mauve dark:text-mocha-crust font-semibold">{t.save}</button>
                </div>
            </div>
        </div>
    );
};
