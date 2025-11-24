

import React, { useState } from 'react';
import { Integration, User, UserRole } from '../../types';
import { PlusIcon, EditIcon, TrashIcon, SettingsIcon, UsersIcon } from '../icons';
import { AddIntegrationModal } from '../modals/AddIntegrationModal';
import { UserManagementModal } from '../modals/UserManagementModal';
import { ConfirmDeleteModal } from '../ui/ConfirmDeleteModal';
import { EntityHistory } from './EntityHistory';

interface ConfigurationViewProps {
    t: any;
    integrations: Integration[];
    onSaveIntegration: (data: Omit<Integration, 'id'> & { id?: string }) => void;
    onDeleteIntegration: (integration: Integration) => void;
    user?: User | null;
    userApiKey: string;
    onApiKeyChange: (key: string) => void;
}

export const ConfigurationView: React.FC<ConfigurationViewProps> = ({ t, integrations, onSaveIntegration, onDeleteIntegration, user, userApiKey, onApiKeyChange }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [editingIntegration, setEditingIntegration] = useState<Integration | null>(null);
    const [integrationToDelete, setIntegrationToDelete] = useState<Integration | null>(null);
    const [activeTab, setActiveTab] = useState<'list' | 'history'>('list');

    const handleAddClick = () => {
        setEditingIntegration(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (integration: Integration) => {
        setEditingIntegration(integration);
        setIsModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (integrationToDelete) {
            onDeleteIntegration(integrationToDelete);
            setIntegrationToDelete(null);
        }
    };

    const handleSave = (data: Omit<Integration, 'id'> & { id?: string }) => {
        onSaveIntegration(data);
        setIsModalOpen(false);
        setEditingIntegration(null);
    };

    const canManageUsers = user?.role === 'Owner' || user?.role === 'Management';

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-latte-text dark:text-mocha-text">{t.configuration}</h1>
                
                {canManageUsers && (
                    <button 
                        onClick={() => setIsUserModalOpen(true)} 
                        className="flex items-center space-x-2 bg-latte-blue text-white dark:bg-mocha-blue dark:text-mocha-crust px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                    >
                        <UsersIcon className="w-5 h-5" />
                        <span>Manage Users</span>
                    </button>
                )}
            </div>
            
            <div className="bg-latte-crust dark:bg-mocha-crust p-6 rounded-xl shadow-md border border-latte-surface0 dark:border-mocha-surface0 mb-8">
                <h2 className="text-xl font-bold text-latte-text dark:text-mocha-text mb-4 border-b border-latte-surface1 dark:border-mocha-surface1 pb-2">API Configuration</h2>
                <div className="max-w-xl">
                    <label className="block text-sm font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-2">{t.apiKey}</label>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <input 
                            type="password" 
                            value={userApiKey} 
                            onChange={(e) => onApiKeyChange(e.target.value)} 
                            placeholder={t.apiKeyPlaceholder}
                            className="flex-grow px-3 py-2 rounded-lg bg-latte-base dark:bg-mocha-base border border-latte-surface1 dark:border-mocha-surface1 focus:ring-2 focus:ring-latte-mauve dark:focus:ring-mocha-mauve focus:outline-none"
                        />
                        <a 
                            href="https://aistudio.google.com/app/apikey" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-latte-surface2 dark:bg-mocha-surface2 text-latte-text dark:text-mocha-text rounded-lg font-semibold hover:bg-latte-surface1 dark:hover:bg-mocha-surface1 transition-colors text-center whitespace-nowrap flex items-center justify-center"
                        >
                            {t.getApiKey}
                        </a>
                    </div>
                </div>
            </div>

            <div className="flex space-x-1 bg-latte-surface0 dark:bg-mocha-surface0 p-1 rounded-lg w-fit mb-6">
                <button
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'list' ? 'bg-white dark:bg-mocha-surface2 shadow-sm text-latte-text dark:text-mocha-text' : 'text-latte-subtext0 dark:text-mocha-subtext0 hover:text-latte-text dark:hover:text-mocha-text'}`}
                    onClick={() => setActiveTab('list')}
                >
                    {t.list}
                </button>
                <button
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'history' ? 'bg-white dark:bg-mocha-surface2 shadow-sm text-latte-text dark:text-mocha-text' : 'text-latte-subtext0 dark:text-mocha-subtext0 hover:text-latte-text dark:hover:text-mocha-text'}`}
                    onClick={() => setActiveTab('history')}
                >
                    {t.history}
                </button>
            </div>

            {activeTab === 'list' ? (
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-latte-subtext1 dark:text-mocha-subtext1 border-b-2 border-latte-surface1 dark:border-mocha-surface1 pb-2 flex-grow">{t.integrations}</h2>
                        <button onClick={handleAddClick} className="ml-4 flex items-center space-x-2 bg-latte-mauve text-white dark:bg-mocha-mauve dark:text-mocha-crust px-3 py-1.5 rounded-lg font-semibold hover:opacity-90 transition-opacity text-sm">
                            <PlusIcon className="w-4 h-4" />
                            <span>{t.addIntegration}</span>
                        </button>
                    </div>

                    {integrations.length === 0 ? (
                        <div className="bg-latte-crust dark:bg-mocha-crust p-8 rounded-xl shadow-md text-center">
                            <SettingsIcon className="w-12 h-12 mx-auto text-latte-overlay1 dark:text-mocha-overlay1 mb-4" />
                            <p className="text-latte-subtext0 dark:text-mocha-subtext0">{t.noIntegrations}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {integrations.map(integration => (
                                <div key={integration.id} className="bg-latte-crust dark:bg-mocha-crust p-6 rounded-xl shadow-md border border-latte-surface0 dark:border-mocha-surface0 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold text-latte-text dark:text-mocha-text mb-2">{integration.name}</h3>
                                        <div className="space-y-1 text-sm text-latte-subtext1 dark:text-mocha-subtext1">
                                            <p><span className="font-semibold">{t.baseUrl}:</span> <span className="text-latte-subtext0 dark:text-mocha-subtext0 truncate block">{integration.baseUrl}</span></p>
                                            <p><span className="font-semibold">{t.username}:</span> {integration.username}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex justify-end space-x-2 border-t border-latte-surface1 dark:border-mocha-surface1 pt-4">
                                        <button onClick={() => handleEditClick(integration)} className="p-2 rounded-md hover:bg-latte-surface1 dark:hover:bg-mocha-surface1 text-latte-blue dark:text-mocha-blue">
                                            <EditIcon className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => setIntegrationToDelete(integration)} className="p-2 rounded-md hover:bg-latte-surface1 dark:hover:bg-mocha-surface1 text-latte-red dark:text-mocha-red">
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <EntityHistory t={t} entityTypes={['Integration']} />
            )}

            <AddIntegrationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                t={t}
                editingIntegration={editingIntegration}
            />

            <UserManagementModal 
                isOpen={isUserModalOpen}
                onClose={() => setIsUserModalOpen(false)}
                t={t}
            />

            <ConfirmDeleteModal
                isOpen={!!integrationToDelete}
                onClose={() => setIntegrationToDelete(null)}
                onConfirm={handleDeleteConfirm}
                title={t.confirmDelete}
                message={<>{t.areYouSureDeleteIntegration} <strong className="text-latte-text dark:text-mocha-text">{integrationToDelete?.name}</strong>?</>}
                t={t}
            />
        </div>
    );
};