
import React, { useState, useMemo } from 'react';
import { App, BM, Partnership } from '../../types';
import { MessageSquareIcon, ExternalLinkIcon, EditIcon } from '../icons';
import { EditAppDetailsModal } from '../modals/EditAppDetailsModal';

interface ChatbotsViewProps {
    t: any;
    bms: BM[];
    partnerships: Partnership[];
    onSaveApp: (app: App) => void;
}

export const ChatbotsView: React.FC<ChatbotsViewProps> = ({ t, bms, partnerships, onSaveApp }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingApp, setEditingApp] = useState<App | null>(null);

    const allApps = useMemo(() =>
        bms.flatMap(bm => bm.apps.map(app => ({ ...app, bmName: bm.name, bmId: bm.id })))
        , [bms]);

    const getPartnershipName = (id?: string) => {
        if (!id) return '-';
        return partnerships.find(p => p.id === id)?.name || 'N/A';
    };

    const handleEditClick = (app: App) => {
        setEditingApp(app);
        setIsModalOpen(true);
    };

    const handleSave = (app: App) => {
        onSaveApp(app);
        setIsModalOpen(false);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-latte-text dark:text-mocha-text">{t.chatbots}</h1>
            </div>
            <div className="bg-latte-crust dark:bg-mocha-crust p-4 rounded-xl shadow-md">
                {allApps.length === 0 ? (
                    <div className="text-center py-12">
                        <MessageSquareIcon className="w-16 h-16 mx-auto text-latte-overlay1 dark:text-mocha-overlay1 mb-4" />
                        <p className="text-lg text-latte-subtext0 dark:text-mocha-subtext0">{t.noChatbots}</p>
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="border-b-2 border-latte-surface1 dark:border-mocha-surface1">
                            <tr>
                                <th className="p-4 text-sm font-semibold uppercase text-latte-subtext1 dark:text-mocha-subtext1">{t.appName}</th>
                                <th className="p-4 text-sm font-semibold uppercase text-latte-subtext1 dark:text-mocha-subtext1">{t.bmParent}</th>
                                <th className="p-4 text-sm font-semibold uppercase text-latte-subtext1 dark:text-mocha-subtext1">{t.partnership}</th>
                                <th className="p-4 text-sm font-semibold uppercase text-latte-subtext1 dark:text-mocha-subtext1 text-right">{t.actions}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allApps.map((app) => (
                                <tr key={app.id} className="border-b border-latte-surface0 dark:border-mocha-surface0 last:border-b-0">
                                    <td className="p-4 font-medium">{app.name}</td>
                                    <td className="p-4 text-latte-subtext0 dark:text-mocha-subtext0">{app.bmName}</td>
                                    <td className="p-4 text-latte-subtext0 dark:text-mocha-subtext0">{getPartnershipName(app.partnershipId)}</td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end space-x-1">
                                            {app.url && <a href={app.url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-md hover:bg-latte-surface1 dark:hover:bg-mocha-surface1 text-latte-green dark:text-mocha-green"><ExternalLinkIcon className="w-5 h-5" /></a>}
                                            <button onClick={() => handleEditClick(app)} className="p-2 rounded-md hover:bg-latte-surface1 dark:hover:bg-mocha-surface1 text-latte-blue dark:text-mocha-blue"><EditIcon className="w-5 h-5" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            {editingApp && <EditAppDetailsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} t={t} app={editingApp} partnerships={partnerships} />}
        </div>
    );
}
