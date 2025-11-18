
import React, { useState } from 'react';
import { Profile } from '../../types';
import { PlusIcon, EditIcon, TrashIcon, ProfileIcon, ExternalLinkIcon } from '../icons';
import { AddProfileModal } from '../modals/AddProfileModal';
import { ConfirmDeleteModal } from '../ui/ConfirmDeleteModal';

interface ProfilesViewProps {
    t: any;
    profiles: Profile[];
    onSaveProfile: (profileData: Omit<Profile, 'id'> & { id?: string }) => void;
    onDeleteProfile: (profile: Profile) => void;
}

export const ProfilesView: React.FC<ProfilesViewProps> = ({ t, profiles, onSaveProfile, onDeleteProfile }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
    const [profileToDelete, setProfileToDelete] = useState<Profile | null>(null);

    const handleSave = (profileData: Omit<Profile, 'id'> & { id?: string }) => {
        onSaveProfile(profileData);
        setIsModalOpen(false);
        setEditingProfile(null);
    };

    const handleAddClick = () => {
        setEditingProfile(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (profile: Profile) => {
        setEditingProfile(profile);
        setIsModalOpen(true);
    };
    
    const handleDeleteConfirm = () => {
        if (profileToDelete) {
            onDeleteProfile(profileToDelete);
            setProfileToDelete(null);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'In Use': return 'bg-latte-green/20 text-latte-green dark:bg-mocha-green/20 dark:text-mocha-green';
            case 'Warm up': return 'bg-latte-blue/20 text-latte-blue dark:bg-mocha-blue/20 dark:text-mocha-blue';
            case 'Stock': return 'bg-latte-yellow/20 text-latte-yellow dark:bg-mocha-yellow/20 dark:text-mocha-yellow';
            case 'Invalidated': return 'bg-latte-red/20 text-latte-red dark:bg-mocha-red/20 dark:text-mocha-red';
            default: return 'bg-latte-surface1 dark:bg-mocha-surface1';
        }
    };
    
    const getRoleColor = (role: string) => {
        switch (role) {
            case 'Advertiser': return 'bg-latte-mauve/20 text-latte-mauve dark:bg-mocha-mauve/20 dark:text-mocha-mauve';
            case 'Contingency': return 'bg-latte-peach/20 text-latte-peach dark:bg-mocha-peach/20 dark:text-mocha-peach';
            case 'Bot': return 'bg-latte-sky/20 text-latte-sky dark:bg-mocha-sky/20 dark:text-mocha-sky';
            case 'Backup': return 'bg-latte-sapphire/20 text-latte-sapphire dark:bg-mocha-sapphire/20 dark:text-mocha-sapphire';
            default: return 'bg-latte-surface1 dark:bg-mocha-surface1';
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-latte-text dark:text-mocha-text">{t.profiles}</h1>
                <button onClick={handleAddClick} className="flex items-center space-x-2 bg-latte-mauve text-white dark:bg-mocha-mauve dark:text-mocha-crust px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                    <PlusIcon className="w-5 h-5" />
                    <span>{t.addProfile}</span>
                </button>
            </div>
            <div className="bg-latte-crust dark:bg-mocha-crust p-4 rounded-xl shadow-md">
                {profiles.length === 0 ? (
                    <div className="text-center py-12">
                        <ProfileIcon className="w-16 h-16 mx-auto text-latte-overlay1 dark:text-mocha-overlay1 mb-4" />
                        <p className="text-lg text-latte-subtext0 dark:text-mocha-subtext0">{t.noProfiles}</p>
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="border-b-2 border-latte-surface1 dark:border-mocha-surface1">
                            <tr>
                                <th className="p-4 text-sm font-semibold uppercase text-latte-subtext1 dark:text-mocha-subtext1">{t.profileName}</th>
                                <th className="p-4 text-sm font-semibold uppercase text-latte-subtext1 dark:text-mocha-subtext1">{t.profileStatus}</th>
                                <th className="p-4 text-sm font-semibold uppercase text-latte-subtext1 dark:text-mocha-subtext1">{t.profileRole}</th>
                                <th className="p-4 text-sm font-semibold uppercase text-latte-subtext1 dark:text-mocha-subtext1">{t.supplier}</th>
                                <th className="p-4 text-sm font-semibold uppercase text-latte-subtext1 dark:text-mocha-subtext1 text-right">{t.actions}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {profiles.map((profile) => (
                                <tr key={profile.id} className="border-b border-latte-surface0 dark:border-mocha-surface0 last:border-b-0 hover:bg-latte-surface0 dark:hover:bg-mocha-surface0">
                                    <td className="p-4 font-medium">{profile.name}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${getStatusColor(profile.status)}`}>
                                            {t[`status${profile.status.replace(/\s/g, '')}`] || profile.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${getRoleColor(profile.role)}`}>
                                            {t[`role${profile.role}`] || profile.role}
                                        </span>
                                    </td>
                                    <td className="p-4">{profile.supplier}</td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end space-x-1">
                                             {profile.driveLink && (
                                                <a href={profile.driveLink} target="_blank" rel="noopener noreferrer" className="p-2 rounded-md hover:bg-latte-surface1 dark:hover:bg-mocha-surface1 text-latte-green dark:text-mocha-green" aria-label={`Drive link for ${profile.name}`}>
                                                    <ExternalLinkIcon className="w-5 h-5" />
                                                </a>
                                            )}
                                            <button onClick={() => handleEditClick(profile)} className="p-2 rounded-md hover:bg-latte-surface1 dark:hover:bg-mocha-surface1 text-latte-blue dark:text-mocha-blue"><EditIcon className="w-5 h-5" /></button>
                                            <button onClick={() => setProfileToDelete(profile)} className="p-2 rounded-md hover:bg-latte-surface1 dark:hover:bg-mocha-surface1 text-latte-red dark:text-mocha-red"><TrashIcon className="w-5 h-5" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            <AddProfileModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSave={handleSave}
                t={t} 
                editingProfile={editingProfile}
            />
            <ConfirmDeleteModal
                isOpen={!!profileToDelete}
                onClose={() => setProfileToDelete(null)}
                onConfirm={handleDeleteConfirm}
                title={t.confirmDelete}
                message={<>{t.areYouSureDeleteProfile} <strong className="text-latte-text dark:text-mocha-text">{profileToDelete?.name}</strong>?</>}
                t={t}
            />
        </div>
    );
};
