
import React, { useState, useEffect } from 'react';
import { Partnership } from '../../types';
import { SearchableSelect } from '../ui/SearchableSelect';

interface AddPartnershipModalProps {
    isOpen: boolean;
    onClose: () => void;
    t: any;
    editingPartnership: Partnership | null;
    onSave: (data: Omit<Partnership, 'id'> & { id?: string }) => void;
    projectOptions: { value: string; label: string }[];
    profileOptions: { value: string; label: string }[];
    bmOptions: { value: string; label: string }[];
}

export const AddPartnershipModal: React.FC<AddPartnershipModalProps> = ({ isOpen, onClose, t, editingPartnership, onSave, projectOptions, profileOptions, bmOptions }) => {
    const [name, setName] = useState('');
    const [acronym, setAcronym] = useState('');
    const [discord, setDiscord] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [notes, setNotes] = useState('');
    const [projectIds, setProjectIds] = useState<string[]>([]);
    const [profileIds, setProfileIds] = useState<string[]>([]);
    const [bmIds, setBmIds] = useState<string[]>([]);

    const inputStyle = "w-full px-3 py-2 rounded-lg bg-latte-base dark:bg-mocha-base border border-latte-surface1 dark:border-mocha-surface1 focus:ring-2 focus:ring-latte-mauve dark:focus:ring-mocha-mauve focus:outline-none";

    useEffect(() => {
        if (isOpen) {
            if (editingPartnership) {
                setName(editingPartnership.name);
                setAcronym(editingPartnership.acronym || '');
                setDiscord(editingPartnership.discord || '');
                setWhatsapp(editingPartnership.whatsapp || '');
                setNotes(editingPartnership.notes || '');
                setProjectIds(editingPartnership.projectIds || []);
                setProfileIds(editingPartnership.profileIds || []);
                setBmIds(editingPartnership.bmIds || []);
            } else {
                setName(''); setAcronym(''); setDiscord(''); setWhatsapp(''); setNotes('');
                setProjectIds([]); setProfileIds([]); setBmIds([]);
            }
        }
    }, [isOpen, editingPartnership]);

    if (!isOpen) return null;

    const handleSave = () => {
        onSave({ id: editingPartnership?.id, name, acronym, discord, whatsapp, notes, projectIds, profileIds, bmIds });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
            <div className="bg-latte-mantle dark:bg-mocha-mantle rounded-xl p-8 w-full max-w-2xl" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-6">{editingPartnership ? t.editPartnership : t.addPartnership}</h2>
                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
                     <div className="p-4 rounded-lg bg-latte-base dark:bg-mocha-base border border-latte-surface1 dark:border-mocha-surface1 space-y-4">
                        <h3 className="font-semibold text-latte-text dark:text-mocha-text">Details</h3>
                        <input type="text" placeholder={t.partnershipName} value={name} onChange={e => setName(e.target.value)} className={inputStyle} />
                        <input type="text" placeholder={t.acronym} value={acronym} onChange={e => setAcronym(e.target.value)} className={inputStyle} />
                        <input type="text" placeholder={t.discord} value={discord} onChange={e => setDiscord(e.target.value)} className={inputStyle} />
                        <input type="text" placeholder={t.whatsapp} value={whatsapp} onChange={e => setWhatsapp(e.target.value)} className={inputStyle} />
                        <textarea placeholder={t.notes} value={notes} onChange={e => setNotes(e.target.value)} className={`${inputStyle} h-24`} />
                    </div>
                     <div className="p-4 rounded-lg bg-latte-base dark:bg-mocha-base border border-latte-surface1 dark:border-mocha-surface1 space-y-4">
                        <h3 className="font-semibold text-latte-text dark:text-mocha-text">Relationships</h3>
                         <div>
                            <label className="block text-sm font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">{t.projects}</label>
                            <SearchableSelect options={projectOptions} selected={projectIds} onChange={setProjectIds} placeholder={t.selectProjects} searchPlaceholder={t.searchProjects} multiple />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">{t.profiles}</label>
                            <SearchableSelect options={profileOptions} selected={profileIds} onChange={setProfileIds} placeholder={t.selectProfiles} searchPlaceholder={t.searchProfiles} multiple />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">{t.bms}</label>
                            <SearchableSelect options={bmOptions} selected={bmIds} onChange={setBmIds} placeholder={t.selectBms} searchPlaceholder={t.searchBms} multiple />
                        </div>
                    </div>
                </div>
                <div className="mt-8 flex justify-end space-x-4">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-latte-surface1 dark:bg-mocha-surface1 font-semibold">{t.cancel}</button>
                    <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-latte-mauve text-white dark:bg-mocha-mauve dark:text-mocha-crust font-semibold" disabled={!name}>{t.save}</button>
                </div>
            </div>
        </div>
    );
};
