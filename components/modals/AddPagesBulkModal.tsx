
import React, { useState, useEffect } from 'react';
import { Page } from '../../types';
import { CloseIcon, TrashIcon } from '../icons';
import { SearchableSelect } from '../ui/SearchableSelect';

export type BulkPageEntry = {
    localId: string;
    id?: string; // Real ID if editing
    name: string;
    facebookId: string;
    profileIds: string[];
    error?: string;
};

interface AddPagesBulkModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (pages: Omit<BulkPageEntry, 'localId' | 'error'>[]) => Promise<{ success: boolean; errors: { facebookId: string, message: string }[] }>;
    t: any;
    initialPages: Partial<Page>[];
    profileOptions?: { value: string; label: string }[];
}

export const AddPagesBulkModal: React.FC<AddPagesBulkModalProps> = ({ isOpen, onClose, onSave, t, initialPages, profileOptions = [] }) => {
    const [pages, setPages] = useState<BulkPageEntry[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [summaryError, setSummaryError] = useState('');

    useEffect(() => {
        if (isOpen) {
            setPages(initialPages.map(p => ({
                localId: crypto.randomUUID(),
                id: p.id,
                name: p.name || '',
                facebookId: p.facebookId || '',
                profileIds: p.profileIds || [],
            })));
            setIsSaving(false);
            setSummaryError('');
        }
    }, [isOpen, initialPages]);

    if (!isOpen) return null;

    const handlePageChange = (localId: string, field: keyof BulkPageEntry, value: any) => {
        setPages(currentPages =>
            currentPages.map(p => p.localId === localId ? { ...p, [field]: value, error: undefined } : p)
        );
    };

    const handleRemovePage = (localId: string) => {
        setPages(currentPages => currentPages.filter(p => p.localId !== localId));
    };

    const handleSaveClick = async () => {
        setIsSaving(true);
        setSummaryError('');

        const pagesToSave = pages.map(({ localId, error, ...rest }) => rest);
        const { success, errors } = await onSave(pagesToSave);

        if (success) {
            onClose();
        } else {
            setSummaryError(t.bulkSaveError || 'Some pages could not be saved. Please review the errors below.');
            setPages(currentPages =>
                currentPages.map(p => {
                    const error = errors.find(e => e.facebookId === p.facebookId);
                    return error ? { ...p, error: error.message } : p;
                })
            );
        }
        setIsSaving(false);
    };
    
    const allFieldsFilled = pages.every(p => p.name.trim() && p.facebookId.trim());

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
            <div className="bg-latte-mantle dark:bg-mocha-mantle rounded-xl shadow-2xl p-8 w-full max-w-5xl flex flex-col h-[80vh]" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-4 text-latte-text dark:text-mocha-text">{t.addPagesBulk || 'Add/Edit Pages in Bulk'}</h2>
                <p className="text-sm text-latte-subtext1 dark:text-mocha-subtext1 mb-6">{t.addPagesBulkDescription || 'Edit the names, Facebook IDs, and link profiles.'}</p>
                
                {summaryError && <p className="text-sm text-center text-latte-red dark:text-mocha-red mb-4 p-2 bg-latte-red/10 rounded-md">{summaryError}</p>}
                
                <div className="flex-grow overflow-y-auto space-y-3 pr-2">
                    {pages.map((page) => (
                        <div key={page.localId} className={`p-4 rounded-lg bg-latte-base dark:bg-mocha-base border ${page.error ? 'border-latte-red dark:border-mocha-red' : 'border-latte-surface1 dark:border-mocha-surface1'} relative`}>
                             <button onClick={() => handleRemovePage(page.localId)} className="absolute top-2 right-2 p-1.5 rounded-lg text-latte-red dark:text-mocha-red hover:bg-latte-red/10 dark:hover:bg-mocha-red/10">
                                <TrashIcon className="w-4 h-4" />
                            </button>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pr-8">
                                <div>
                                    <label className="block text-xs font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">{t.pageName}</label>
                                    <input
                                        type="text"
                                        placeholder={t.pageName}
                                        value={page.name}
                                        onChange={e => handlePageChange(page.localId, 'name', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg bg-latte-mantle dark:bg-mocha-mantle border border-latte-surface1 dark:border-mocha-surface1 focus:ring-2 focus:ring-latte-mauve dark:focus:ring-mocha-mauve focus:outline-none text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">{t.facebookId}</label>
                                    <input
                                        type="text"
                                        placeholder={t.facebookId}
                                        value={page.facebookId}
                                        onChange={e => handlePageChange(page.localId, 'facebookId', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg bg-latte-mantle dark:bg-mocha-mantle border border-latte-surface1 dark:border-mocha-surface1 focus:ring-2 focus:ring-latte-mauve dark:focus:ring-mocha-mauve focus:outline-none text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">{t.profiles}</label>
                                    <SearchableSelect 
                                        options={profileOptions} 
                                        selected={page.profileIds} 
                                        onChange={(val) => handlePageChange(page.localId, 'profileIds', val)} 
                                        placeholder={t.selectProfiles} 
                                        searchPlaceholder={t.searchProfiles} 
                                        multiple 
                                    />
                                </div>
                            </div>
                            {page.error && <p className="text-xs text-latte-red dark:text-mocha-red mt-2 pl-1">{page.error}</p>}
                        </div>
                    ))}
                </div>

                <div className="mt-6 flex justify-end space-x-4 pt-4 border-t border-latte-surface1 dark:border-mocha-surface1">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-latte-surface1 dark:bg-mocha-surface1 font-semibold hover:bg-latte-surface2 dark:hover:bg-mocha-surface2">{t.cancel}</button>
                    <button onClick={handleSaveClick} className="px-6 py-2 rounded-lg bg-latte-mauve text-white dark:bg-mocha-mauve dark:text-mocha-crust font-semibold disabled:opacity-50" disabled={isSaving || !allFieldsFilled || pages.length === 0}>
                        {isSaving ? (t.saving || 'Saving...') : `${t.saveAll || 'Save All'} (${pages.length})`}
                    </button>
                </div>
            </div>
        </div>
    );
};
