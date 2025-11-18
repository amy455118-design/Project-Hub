
import React, { useState } from 'react';
import { Partnership } from '../../types';
import { PlusIcon, EditIcon, TrashIcon, UsersIcon } from '../icons';
import { AddPartnershipModal } from '../modals/AddPartnershipModal';
import { ConfirmDeleteModal } from '../ui/ConfirmDeleteModal';

interface PartnershipsViewProps {
    t: any;
    partnerships: Partnership[];
    onSavePartnership: (p: Omit<Partnership, 'id'> & { id?: string }) => void;
    onDeletePartnership: (p: Partnership) => void;
    projectOptions: { value: string; label: string }[];
    profileOptions: { value: string; label: string }[];
    bmOptions: { value: string; label: string }[];
}

export const PartnershipsView: React.FC<PartnershipsViewProps> = ({ t, partnerships, onSavePartnership, onDeletePartnership, projectOptions, profileOptions, bmOptions }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPartnership, setEditingPartnership] = useState<Partnership | null>(null);
    const [partnershipToDelete, setPartnershipToDelete] = useState<Partnership | null>(null);

    const handleSave = (data: Omit<Partnership, 'id'> & { id?: string }) => {
        onSavePartnership(data);
        setIsModalOpen(false);
        setEditingPartnership(null);
    };

    const handleAddClick = () => {
        setEditingPartnership(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (p: Partnership) => {
        setEditingPartnership(p);
        setIsModalOpen(true);
    };
    
    const handleDeleteConfirm = () => {
        if(partnershipToDelete) {
            onDeletePartnership(partnershipToDelete);
            setPartnershipToDelete(null);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-latte-text dark:text-mocha-text">{t.partnerships}</h1>
                <button onClick={handleAddClick} className="flex items-center space-x-2 bg-latte-mauve text-white dark:bg-mocha-mauve dark:text-mocha-crust px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                    <PlusIcon className="w-5 h-5" />
                    <span>{t.addPartnership}</span>
                </button>
            </div>
            <div className="bg-latte-crust dark:bg-mocha-crust p-4 rounded-xl shadow-md">
                {partnerships.length === 0 ? (
                    <div className="text-center py-12">
                        <UsersIcon className="w-16 h-16 mx-auto text-latte-overlay1 dark:text-mocha-overlay1 mb-4" />
                        <p className="text-lg text-latte-subtext0 dark:text-mocha-subtext0">{t.noPartnerships}</p>
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="border-b-2 border-latte-surface1 dark:border-mocha-surface1">
                            <tr>
                                <th className="p-4 text-sm font-semibold uppercase text-latte-subtext1 dark:text-mocha-subtext1">{t.partnershipName}</th>
                                <th className="p-4 text-sm font-semibold uppercase text-latte-subtext1 dark:text-mocha-subtext1">{t.acronym}</th>
                                <th className="p-4 text-sm font-semibold uppercase text-latte-subtext1 dark:text-mocha-subtext1">{t.discord}</th>
                                <th className="p-4 text-sm font-semibold uppercase text-latte-subtext1 dark:text-mocha-subtext1">{t.whatsapp}</th>
                                <th className="p-4 text-sm font-semibold uppercase text-latte-subtext1 dark:text-mocha-subtext1 text-right">{t.actions}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {partnerships.map((p) => (
                                <tr key={p.id} className="border-b border-latte-surface0 dark:border-mocha-surface0 last:border-b-0">
                                    <td className="p-4 font-medium">{p.name}</td>
                                    <td className="p-4">{p.acronym}</td>
                                    <td className="p-4">{p.discord}</td>
                                    <td className="p-4">{p.whatsapp}</td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end space-x-1">
                                            <button onClick={() => handleEditClick(p)} className="p-2 rounded-md hover:bg-latte-surface1 dark:hover:bg-mocha-surface1 text-latte-blue dark:text-mocha-blue"><EditIcon className="w-5 h-5" /></button>
                                            <button onClick={() => setPartnershipToDelete(p)} className="p-2 rounded-md hover:bg-latte-surface1 dark:hover:bg-mocha-surface1 text-latte-red dark:text-mocha-red"><TrashIcon className="w-5 h-5" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            <AddPartnershipModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSave={handleSave} t={t} 
                editingPartnership={editingPartnership}
                projectOptions={projectOptions}
                profileOptions={profileOptions}
                bmOptions={bmOptions}
            />
             <ConfirmDeleteModal
                isOpen={!!partnershipToDelete}
                onClose={() => setPartnershipToDelete(null)}
                onConfirm={handleDeleteConfirm}
                title={t.confirmDelete}
                message={<>{t.areYouSureDeletePartnership} <strong className="text-latte-text dark:text-mocha-text">{partnershipToDelete?.name}</strong>?</>}
                t={t}
            />
        </div>
    );
};
