
import React, { useState } from 'react';
import { BM, Partnership } from '../../types';
import { PlusIcon, EditIcon, TrashIcon, BMIcon, ChevronDownIcon, AdAccountIcon, AppIcon } from '../icons';
import { AddBmModal } from '../modals/AddBmModal';
import { ConfirmDeleteModal } from '../ui/ConfirmDeleteModal';
import { BooleanIndicator } from '../ui/StatusIndicators';
import { EntityHistory } from './EntityHistory';

interface BMsViewProps {
    t: any;
    bms: BM[];
    partnerships: Partnership[];
    onSaveBm: (bmData: Omit<BM, 'id'> & { id?: string }) => void;
    onDeleteBm: (bm: BM) => void;
    getCountryName: (code: string) => string;
    countryOptions: { value: string; label: string }[];
    detailViewType: 'adAccounts' | 'apps';
    setDetailViewType: React.Dispatch<React.SetStateAction<'adAccounts' | 'apps'>>;
    partnershipOptions: { value: string; label: string }[];
    projectOptions: { value: string; label: string }[];
    profileOptions: { value: string; label: string }[];
    pageOptions: { value: string; label: string }[];
}

export const BMsView: React.FC<BMsViewProps> = ({ 
    t, bms, partnerships, onSaveBm, onDeleteBm, getCountryName, countryOptions, 
    detailViewType, setDetailViewType,
    partnershipOptions, projectOptions, profileOptions, pageOptions
 }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBm, setEditingBm] = useState<BM | null>(null);
    const [bmToDelete, setBmToDelete] = useState<BM | null>(null);
    const [expandedRows, setExpandedRows] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState<'list' | 'history'>('list');

    const toggleRow = (id: string) => {
        setExpandedRows(prev =>
            prev.includes(id)
                ? prev.filter(rowId => rowId !== id)
                : [...prev, id]
        );
    };

    const handleSaveBm = (bmData: Omit<BM, 'id'> & { id?: string }) => {
        onSaveBm(bmData);
        setIsModalOpen(false);
        setEditingBm(null);
    };

    const handleAddClick = () => {
        setEditingBm(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (bm: BM) => {
        setEditingBm(bm);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingBm(null);
    };

    const handleDeleteBm = () => {
        if (bmToDelete) {
            onDeleteBm(bmToDelete);
            setBmToDelete(null);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-latte-text dark:text-mocha-text">{t.bms}</h1>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center bg-latte-surface0 dark:bg-mocha-surface0 rounded-lg p-1">
                        <button
                            onClick={() => setDetailViewType('adAccounts')}
                            title={t.adAccounts}
                            className={`p-2 rounded-md transition-colors ${detailViewType === 'adAccounts' ? 'bg-latte-mauve text-white dark:bg-mocha-mauve dark:text-mocha-crust' : 'text-latte-subtext1 dark:text-mocha-subtext1 hover:bg-latte-surface1 dark:hover:bg-mocha-surface1'}`}
                        >
                            <AdAccountIcon className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setDetailViewType('apps')}
                            title={t.apps}
                            className={`p-2 rounded-md transition-colors ${detailViewType === 'apps' ? 'bg-latte-mauve text-white dark:bg-mocha-mauve dark:text-mocha-crust' : 'text-latte-subtext1 dark:text-mocha-subtext1 hover:bg-latte-surface1 dark:hover:bg-mocha-surface1'}`}
                        >
                            <AppIcon className="w-5 h-5" />
                        </button>
                    </div>
                    <button
                        onClick={handleAddClick}
                        className="flex items-center space-x-2 bg-latte-mauve text-white dark:bg-mocha-mauve dark:text-mocha-crust px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                    >
                        <PlusIcon className="w-5 h-5" />
                        <span>{t.addBm}</span>
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
                bms.length === 0 ? (
                    <div className="bg-latte-crust dark:bg-mocha-crust p-4 rounded-xl shadow-md">
                        <div className="text-center py-12">
                            <BMIcon className="w-16 h-16 mx-auto text-latte-overlay1 dark:text-mocha-overlay1 mb-4" />
                            <p className="text-lg text-latte-subtext0 dark:text-mocha-subtext0">{t.noBms}</p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-latte-crust dark:bg-mocha-crust p-4 rounded-xl shadow-md">
                        <table className="w-full text-left">
                            <thead className="border-b-2 border-latte-surface1 dark:border-mocha-surface1">
                                <tr>
                                    <th className="p-4 w-10"></th>
                                    <th className="p-4 text-sm font-semibold uppercase text-latte-subtext1 dark:text-mocha-subtext1">{t.bmName}</th>
                                    <th className="p-4 text-sm font-semibold uppercase text-latte-subtext1 dark:text-mocha-subtext1">{t.bmId}</th>
                                    <th className="p-4 text-sm font-semibold uppercase text-latte-subtext1 dark:text-mocha-subtext1">{t.country}</th>
                                    <th className="p-4 text-sm font-semibold uppercase text-latte-subtext1 dark:text-mocha-subtext1 text-center">{t.accessVerification}</th>
                                    <th className="p-4 text-sm font-semibold uppercase text-latte-subtext1 dark:text-mocha-subtext1 text-center">{t.itProviderVerified}</th>
                                    <th className="p-4 text-sm font-semibold uppercase text-latte-subtext1 dark:text-mocha-subtext1 text-right">{t.actions}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bms.map((bm) => (
                                    <React.Fragment key={bm.id}>
                                        <tr className="border-b border-latte-surface0 dark:border-mocha-surface0 last:border-b-0 hover:bg-latte-surface0 dark:hover:bg-mocha-surface0">
                                            <td className="p-4 text-center">
                                                {(bm.adAccounts?.length > 0 || bm.apps?.length > 0) && (
                                                    <button onClick={() => toggleRow(bm.id)} className="w-full h-full flex items-center justify-center">
                                                        <ChevronDownIcon className={`w-5 h-5 transition-transform ${expandedRows.includes(bm.id) ? 'rotate-180' : ''}`} />
                                                    </button>
                                                )}
                                            </td>
                                            <td className="p-4 font-medium text-latte-text dark:text-mocha-text">{bm.name}</td>
                                            <td className="p-4 text-latte-subtext0 dark:text-mocha-subtext0">{bm.bmId}</td>
                                            <td className="p-4 text-latte-subtext0 dark:text-mocha-subtext0">{getCountryName(bm.country)}</td>
                                            <td className="p-4 text-center"><BooleanIndicator value={bm.hasAccessVerification} /></td>
                                            <td className="p-4 text-center"><BooleanIndicator value={bm.isItProviderVerified} /></td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end space-x-1">
                                                    <button onClick={() => handleEditClick(bm)} className="p-2 rounded-md hover:bg-latte-surface1 dark:hover:bg-mocha-surface1 text-latte-blue dark:text-mocha-blue" aria-label={`Edit ${bm.name}`}><EditIcon className="w-5 h-5" /></button>
                                                    <button onClick={() => setBmToDelete(bm)} className="p-2 rounded-md hover:bg-latte-surface1 dark:hover:bg-mocha-surface1 text-latte-red dark:text-mocha-red" aria-label={`Delete ${bm.name}`}><TrashIcon className="w-5 h-5" /></button>
                                                </div>
                                            </td>
                                        </tr>
                                        {expandedRows.includes(bm.id) && (
                                            <tr>
                                                <td colSpan={7} className="p-0">
                                                    <div className="bg-latte-base dark:bg-mocha-base p-4">
                                                        {detailViewType === 'adAccounts' ? (
                                                            bm.adAccounts?.length > 0 ? (
                                                                <table className="w-full text-sm">
                                                                    <thead className="border-b border-latte-surface1 dark:border-mocha-surface1">
                                                                        <tr>
                                                                            <th className="p-2 text-left font-semibold text-latte-subtext1 dark:text-mocha-subtext1">{t.adAccountName}</th>
                                                                            <th className="p-2 text-left font-semibold text-latte-subtext1 dark:text-mocha-subtext1">{t.accountId}</th>
                                                                            <th className="p-2 text-left font-semibold text-latte-subtext1 dark:text-mocha-subtext1">{t.paymentMethod}</th>
                                                                            <th className="p-2 text-left font-semibold text-latte-subtext1 dark:text-mocha-subtext1">{t.paymentMethodOwner}</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {bm.adAccounts.map(acc => (
                                                                            <tr key={acc.id} className="border-b border-latte-surface0 dark:border-mocha-surface0 last:border-b-0">
                                                                                <td className="p-2 font-medium">{acc.name}</td>
                                                                                <td className="p-2">{acc.accountId}</td>
                                                                                <td className="p-2">{acc.paymentMethod}</td>
                                                                                <td className="p-2">{acc.paymentMethodOwner}</td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            ) : (
                                                                <p className="text-center py-4 text-sm text-latte-subtext0 dark:text-mocha-subtext0">{t.noAdAccountsInBm}</p>
                                                            )
                                                        ) : null}

                                                        {detailViewType === 'apps' ? (
                                                            bm.apps?.length > 0 ? (
                                                                <table className="w-full text-sm">
                                                                    <thead className="border-b border-latte-surface1 dark:border-mocha-surface1">
                                                                        <tr>
                                                                            <th className="p-2 text-left font-semibold text-latte-subtext1 dark:text-mocha-subtext1">{t.appName}</th>
                                                                            <th className="p-2 text-left font-semibold text-latte-subtext1 dark:text-mocha-subtext1">{t.appId}</th>
                                                                            <th className="p-2 text-left font-semibold text-latte-subtext1 dark:text-mocha-subtext1">{t.approvalStep}</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {bm.apps.map(app => (
                                                                            <tr key={app.id} className="border-b border-latte-surface0 dark:border-mocha-surface0 last:border-b-0">
                                                                                <td className="p-2 font-medium">{app.name}</td>
                                                                                <td className="p-2">{app.appId}</td>
                                                                                <td className="p-2">{t[`step${app.approvalStep}_label` as keyof typeof t] || `${t.step} ${app.approvalStep}`}</td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            ) : (
                                                                <p className="text-center py-4 text-sm text-latte-subtext0 dark:text-mocha-subtext0">{t.noAppsInBm}</p>
                                                            )
                                                        ) : null}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            ) : (
                <EntityHistory t={t} entityTypes={['BM']} />
            )}

            <AddBmModal
                isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveBm}
                t={t} countryOptions={countryOptions} editingBm={editingBm}
                partnershipOptions={partnershipOptions}
                projectOptions={projectOptions}
                profileOptions={profileOptions}
                pageOptions={pageOptions}
            />
            <ConfirmDeleteModal
                isOpen={!!bmToDelete}
                onClose={() => setBmToDelete(null)}
                onConfirm={handleDeleteBm}
                title={t.confirmDelete}
                message={<>{t.areYouSureDeleteBm} <strong className="text-latte-text dark:text-mocha-text">{bmToDelete?.name}</strong>?</>}
                t={t}
            />
        </div>
    );
};
