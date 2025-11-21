
import React, { useState } from 'react';
import { Page, Integration, Profile } from '../../types';
import { PlusIcon, EditIcon, TrashIcon, PageIcon, LayersIcon, UploadCloudIcon } from '../icons';
import { AddPageModal } from '../modals/AddPageModal';
import { AddPagesBulkModal } from '../modals/AddPagesBulkModal';
import { UploadImageModal } from '../modals/UploadImageModal';
import { ImportPagesFromIntegrationModal } from '../modals/ImportPagesFromIntegrationModal';
import { ConfirmDeleteModal } from '../ui/ConfirmDeleteModal';
import { EntityHistory } from './EntityHistory';

interface PagesViewProps {
    t: any;
    pages: Page[];
    profiles: Profile[];
    integrations: Integration[];
    onSavePage: (pageData: Omit<Page, 'id' | 'provider'> & { id?: string }) => Promise<void>;
    onDeletePage: (page: Page) => void;
    onTranscribeImage: (base64: string) => Promise<string[]>;
    onBulkSavePages: (pages: { name: string, facebookId: string }[]) => Promise<{ success: boolean; errors: { facebookId: string, message: string }[] }>;
}

export const PagesView: React.FC<PagesViewProps> = ({ t, pages, profiles, integrations, onSavePage, onDeletePage, onTranscribeImage, onBulkSavePages }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPage, setEditingPage] = useState<Page | null>(null);
    const [pageToDelete, setPageToDelete] = useState<Page | null>(null);
    
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
    const [isImportIntegrationModalOpen, setIsImportIntegrationModalOpen] = useState(false);
    const [transcribedPages, setTranscribedPages] = useState<{name: string}[]>([]);
    const [activeTab, setActiveTab] = useState<'list' | 'history'>('list');

    const handleSave = (pageData: Omit<Page, 'id' | 'provider'> & { id?: string }) => {
        return onSavePage(pageData).then(() => {
            setIsModalOpen(false);
            setEditingPage(null);
        });
    };

    const handleAddClick = () => {
        setEditingPage(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (page: Page) => {
        setEditingPage(page);
        setIsModalOpen(true);
    };
    
    const handleDeleteConfirm = () => {
        if (pageToDelete) {
            onDeletePage(pageToDelete);
            setPageToDelete(null);
        }
    };

    const handleBulkAddClick = () => {
        setIsUploadModalOpen(true);
    };

    const handleImportIntegrationClick = () => {
        setIsImportIntegrationModalOpen(true);
    };
    
    const handleTranscriptionSuccess = (names: string[]) => {
        setTranscribedPages(names.map(name => ({ name })));
        setIsUploadModalOpen(false);
        setIsBulkModalOpen(true);
    };

    const profileOptions = profiles.map(p => ({ value: p.id, label: p.name }));

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-latte-text dark:text-mocha-text">{t.pages}</h1>
                <div className="flex items-center space-x-2">
                    <button onClick={handleImportIntegrationClick} className="flex items-center space-x-2 bg-latte-teal text-white dark:bg-mocha-teal dark:text-mocha-crust px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                        <UploadCloudIcon className="w-5 h-5" />
                        <span>{t.importFromIntegration}</span>
                    </button>

                    <button onClick={handleBulkAddClick} className="flex items-center space-x-2 bg-latte-sky text-white dark:bg-mocha-sky dark:text-mocha-crust px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                        <LayersIcon className="w-5 h-5" />
                        <span>{t.addPagesBulk}</span>
                    </button>

                    <button onClick={handleAddClick} className="flex items-center space-x-2 bg-latte-mauve text-white dark:bg-mocha-mauve dark:text-mocha-crust px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                        <PlusIcon className="w-5 h-5" />
                        <span>{t.addPage}</span>
                    </button>
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
                pages.length === 0 ? (
                    <div className="bg-latte-crust dark:bg-mocha-crust p-4 rounded-xl shadow-md">
                        <div className="text-center py-12">
                            <PageIcon className="w-16 h-16 mx-auto text-latte-overlay1 dark:text-mocha-overlay1 mb-4" />
                            <p className="text-lg text-latte-subtext0 dark:text-mocha-subtext0">{t.noPages}</p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-latte-crust dark:bg-mocha-crust p-4 rounded-xl shadow-md">
                        <table className="w-full text-left">
                            <thead className="border-b-2 border-latte-surface1 dark:border-mocha-surface1">
                                <tr>
                                    <th className="p-4 text-sm font-semibold uppercase text-latte-subtext1 dark:text-mocha-subtext1">{t.pageName}</th>
                                    <th className="p-4 text-sm font-semibold uppercase text-latte-subtext1 dark:text-mocha-subtext1">{t.facebookId}</th>
                                    <th className="p-4 text-sm font-semibold uppercase text-latte-subtext1 dark:text-mocha-subtext1 text-right">{t.actions}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pages.map((page) => (
                                    <tr key={page.id} className="border-b border-latte-surface0 dark:border-mocha-surface0 last:border-b-0 hover:bg-latte-surface0 dark:hover:bg-mocha-surface0">
                                        <td className="p-4 font-medium">{page.name}</td>
                                        <td className="p-4">{page.facebookId}</td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end space-x-1">
                                                <button onClick={() => handleEditClick(page)} className="p-2 rounded-md hover:bg-latte-surface1 dark:hover:bg-mocha-surface1 text-latte-blue dark:text-mocha-blue"><EditIcon className="w-5 h-5" /></button>
                                                <button onClick={() => setPageToDelete(page)} className="p-2 rounded-md hover:bg-latte-surface1 dark:hover:bg-mocha-surface1 text-latte-red dark:text-mocha-red"><TrashIcon className="w-5 h-5" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            ) : (
                <EntityHistory t={t} entityTypes={['Page']} />
            )}
            
            <AddPageModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSave={handleSave}
                t={t} 
                editingPage={editingPage}
                profileOptions={profileOptions}
            />

            <UploadImageModal 
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                onTranscribe={onTranscribeImage}
                onSuccess={handleTranscriptionSuccess}
                t={t}
            />

             <AddPagesBulkModal
                isOpen={isBulkModalOpen}
                onClose={() => setIsBulkModalOpen(false)}
                onSave={onBulkSavePages}
                t={t}
                initialPages={transcribedPages}
            />

            <ImportPagesFromIntegrationModal
                isOpen={isImportIntegrationModalOpen}
                onClose={() => setIsImportIntegrationModalOpen(false)}
                integrations={integrations}
                onSave={onBulkSavePages}
                t={t}
            />

            <ConfirmDeleteModal
                isOpen={!!pageToDelete}
                onClose={() => setPageToDelete(null)}
                onConfirm={handleDeleteConfirm}
                title={t.confirmDelete}
                message={<>{t.areYouSureDeletePage} <strong className="text-latte-text dark:text-mocha-text">{pageToDelete?.name}</strong>?</>}
                t={t}
            />
        </div>
    );
};
