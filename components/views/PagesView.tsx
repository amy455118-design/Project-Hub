
import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Page, Integration, Profile } from '../../types';
import { PlusIcon, EditIcon, TrashIcon, PageIcon, LayersIcon, UploadCloudIcon, LayoutGridIcon, ListIcon } from '../icons';
import { AddPageModal } from '../modals/AddPageModal';
import { AddPagesBulkModal } from '../modals/AddPagesBulkModal';
import { UploadImageModal } from '../modals/UploadImageModal';
import { ImportPagesFromIntegrationModal } from '../modals/ImportPagesFromIntegrationModal';
import { ConfirmDeleteModal } from '../ui/ConfirmDeleteModal';
import { EntityHistory } from './EntityHistory';
import { Checkbox } from '../ui/Checkbox';
import { PageCard } from '../cards/PageCard';

interface PagesViewProps {
    pages: Page[];
    profiles: Profile[];
    integrations: Integration[];
    onSavePage: (pageData: Omit<Page, 'id' | 'provider'> & { id?: string }) => Promise<void>;
    onDeletePage: (page: Page) => void;
    onTranscribeImage: (base64: string) => Promise<string[]>;
    onBulkSavePages: (pages: { id?: string, name: string, facebookId: string, profileIds?: string[] }[]) => Promise<{ success: boolean; errors: { facebookId: string, message: string }[] }>;
    onBulkDeletePages: (ids: string[]) => Promise<void> | void;
    hasApiKey: boolean;
}

export const PagesView: React.FC<PagesViewProps> = ({ pages, profiles, integrations, onSavePage, onDeletePage, onTranscribeImage, onBulkSavePages, onBulkDeletePages, hasApiKey }) => {
    const { t } = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPage, setEditingPage] = useState<Page | null>(null);
    const [pageToDelete, setPageToDelete] = useState<Page | null>(null);
    
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
    const [isImportIntegrationModalOpen, setIsImportIntegrationModalOpen] = useState(false);
    const [pagesToBulkEdit, setPagesToBulkEdit] = useState<Partial<Page>[]>([]);
    const [activeTab, setActiveTab] = useState<'list' | 'history'>('list');
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

    // Bulk Selection State
    const [selectedPageIds, setSelectedPageIds] = useState<Set<string>>(new Set());
    const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);

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
        setPagesToBulkEdit(names.map(name => ({ name })));
        setIsUploadModalOpen(false);
        setIsBulkModalOpen(true);
    };

    // Bulk Selection Handlers
    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedPageIds(new Set(pages.map(p => p.id)));
        } else {
            setSelectedPageIds(new Set());
        }
    };

    const handleSelectPage = (id: string, checked: boolean) => {
        const newSelected = new Set(selectedPageIds);
        if (checked) {
            newSelected.add(id);
        } else {
            newSelected.delete(id);
        }
        setSelectedPageIds(newSelected);
    };

    const handleBulkDeleteClick = () => {
        setShowBulkDeleteConfirm(true);
    };

    const confirmBulkDelete = async () => {
        await onBulkDeletePages(Array.from(selectedPageIds));
        setSelectedPageIds(new Set());
        setShowBulkDeleteConfirm(false);
    };

    const handleBulkEditClick = () => {
        const selectedPages = pages.filter(p => selectedPageIds.has(p.id));
        setPagesToBulkEdit(selectedPages);
        setIsBulkModalOpen(true);
    };

    const profileOptions = profiles.map(p => ({ value: p.id, label: p.name }));

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-latte-text dark:text-mocha-text">{t('pages')}</h1>
                <div className="flex items-center space-x-2">
                    {selectedPageIds.size === 0 && (
                        <>
                            <button onClick={handleImportIntegrationClick} className="flex items-center space-x-2 bg-latte-teal text-white dark:bg-mocha-teal dark:text-mocha-crust px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                                <UploadCloudIcon className="w-5 h-5" />
                                <span className="hidden sm:inline">{t('importFromIntegration')}</span>
                            </button>

                            <div className="relative group">
                                <button 
                                    onClick={handleBulkAddClick} 
                                    disabled={!hasApiKey}
                                    className="flex items-center space-x-2 bg-latte-sky text-white dark:bg-mocha-sky dark:text-mocha-crust px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <LayersIcon className="w-5 h-5" />
                                    <span className="hidden sm:inline">{t('addPagesBulk')}</span>
                                </button>
                                {!hasApiKey && (
                                    <div className="absolute bottom-full mb-2 right-0 w-64 p-2 bg-latte-surface2 dark:bg-mocha-surface2 rounded shadow-lg text-xs z-10 text-latte-text dark:text-mocha-text border border-latte-overlay0 dark:border-mocha-overlay0 hidden group-hover:block">
                                        {t('aiDisabledWarning')} <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-latte-mauve dark:text-mocha-mauve underline font-bold ml-1">{t('getApiKey')}</a>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {selectedPageIds.size > 0 && (
                        <>
                            <button 
                                onClick={handleBulkEditClick} 
                                className="flex items-center space-x-2 bg-latte-blue text-white dark:bg-mocha-blue dark:text-mocha-crust px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                            >
                                <EditIcon className="w-5 h-5" />
                                <span className="hidden sm:inline">{t('editSelected')} ({selectedPageIds.size})</span>
                            </button>
                            <button 
                                onClick={handleBulkDeleteClick} 
                                className="flex items-center space-x-2 bg-latte-red text-white dark:bg-mocha-red dark:text-mocha-crust px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                            >
                                <TrashIcon className="w-5 h-5" />
                                <span className="hidden sm:inline">{t('deleteSelected')} ({selectedPageIds.size})</span>
                            </button>
                        </>
                    )}

                    <div className="flex items-center bg-latte-surface0 dark:bg-mocha-surface0 rounded-lg p-1 ml-2">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-latte-mauve text-white dark:bg-mocha-mauve dark:text-mocha-crust' : 'text-latte-subtext1 dark:text-mocha-subtext1 hover:bg-latte-surface1 dark:hover:bg-mocha-surface1'}`}
                        >
                            <LayoutGridIcon className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('table')}
                            className={`p-2 rounded-md transition-colors ${viewMode === 'table' ? 'bg-latte-mauve text-white dark:bg-mocha-mauve dark:text-mocha-crust' : 'text-latte-subtext1 dark:text-mocha-subtext1 hover:bg-latte-surface1 dark:hover:bg-mocha-surface1'}`}
                        >
                            <ListIcon className="w-5 h-5" />
                        </button>
                    </div>

                    <button onClick={handleAddClick} className="flex items-center space-x-2 bg-latte-mauve text-white dark:bg-mocha-mauve dark:text-mocha-crust px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                        <PlusIcon className="w-5 h-5" />
                        <span className="hidden sm:inline">{t('addPage')}</span>
                    </button>
                </div>
            </div>

            <div className="flex space-x-1 bg-latte-surface0 dark:bg-mocha-surface0 p-1 rounded-lg w-fit mb-6">
                <button
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'list' ? 'bg-white dark:bg-mocha-surface2 shadow-sm text-latte-text dark:text-mocha-text' : 'text-latte-subtext0 dark:text-mocha-subtext0 hover:text-latte-text dark:hover:text-mocha-text'}`}
                    onClick={() => setActiveTab('list')}
                >
                    {t('list')}
                </button>
                <button
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'history' ? 'bg-white dark:bg-mocha-surface2 shadow-sm text-latte-text dark:text-mocha-text' : 'text-latte-subtext0 dark:text-mocha-subtext0 hover:text-latte-text dark:hover:text-mocha-text'}`}
                    onClick={() => setActiveTab('history')}
                >
                    {t('history')}
                </button>
            </div>

            {activeTab === 'list' ? (
                pages.length === 0 ? (
                    <div className="bg-latte-crust dark:bg-mocha-crust p-4 rounded-xl shadow-md">
                        <div className="text-center py-12">
                            <PageIcon className="w-16 h-16 mx-auto text-latte-overlay1 dark:text-mocha-overlay1 mb-4" />
                            <p className="text-lg text-latte-subtext0 dark:text-mocha-subtext0">{t('noPages')}</p>
                        </div>
                    </div>
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {pages.map(page => (
                            <PageCard 
                                key={page.id}
                                page={page} 
                                t={t} 
                                onEdit={handleEditClick} 
                                onDelete={() => setPageToDelete(page)}
                                selectionControl={
                                    <Checkbox 
                                        label="" 
                                        checked={selectedPageIds.has(page.id)} 
                                        onChange={(checked) => handleSelectPage(page.id, checked)} 
                                    />
                                }
                            />
                        ))}
                    </div>
                ) : (
                    <div className="bg-latte-crust dark:bg-mocha-crust p-4 rounded-xl shadow-md">
                        <table className="w-full text-left">
                            <thead className="border-b-2 border-latte-surface1 dark:border-mocha-surface1">
                                <tr>
                                    <th className="p-4 w-10">
                                        <Checkbox 
                                            label="" 
                                            checked={selectedPageIds.size === pages.length && pages.length > 0} 
                                            onChange={handleSelectAll} 
                                        />
                                    </th>
                                    <th className="p-4 text-sm font-semibold uppercase text-latte-subtext1 dark:text-mocha-subtext1">{t('pageName')}</th>
                                    <th className="p-4 text-sm font-semibold uppercase text-latte-subtext1 dark:text-mocha-subtext1">{t('facebookId')}</th>
                                    <th className="p-4 text-sm font-semibold uppercase text-latte-subtext1 dark:text-mocha-subtext1 text-right">{t('actions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pages.map((page) => (
                                    <tr key={page.id} className="border-b border-latte-surface0 dark:border-mocha-surface0 last:border-b-0 hover:bg-latte-surface0 dark:hover:bg-mocha-surface0">
                                        <td className="p-4">
                                            <Checkbox 
                                                label="" 
                                                checked={selectedPageIds.has(page.id)} 
                                                onChange={(checked) => handleSelectPage(page.id, checked)} 
                                            />
                                        </td>
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
                initialPages={pagesToBulkEdit}
                profileOptions={profileOptions}
            />

            <ImportPagesFromIntegrationModal
                isOpen={isImportIntegrationModalOpen}
                onClose={() => setIsImportIntegrationModalOpen(false)}
                integrations={integrations}
                onSave={onBulkSavePages}
                t={t}
                existingPages={pages}
            />

            <ConfirmDeleteModal
                isOpen={!!pageToDelete}
                onClose={() => setPageToDelete(null)}
                onConfirm={handleDeleteConfirm}
                title={t('confirmDelete')}
                message={<>{t('areYouSureDeletePage')} <strong className="text-latte-text dark:text-mocha-text">{pageToDelete?.name}</strong>?</>}
                t={t}
            />

            <ConfirmDeleteModal
                isOpen={showBulkDeleteConfirm}
                onClose={() => setShowBulkDeleteConfirm(false)}
                onConfirm={confirmBulkDelete}
                title={t('confirmBulkDelete') || "Confirm Bulk Deletion"}
                message={`${t('areYouSureBulkDeletePages') || "Are you sure you want to delete the selected pages?"} (${selectedPageIds.size})`}
                t={t}
            />
        </div>
    );
};
