import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../../types';
import { TrashIcon, EditIcon, CloseIcon } from '../icons';
import { userApi } from '../../api';
import { SearchableSelect } from '../ui/SearchableSelect';

interface UserManagementModalProps {
    isOpen: boolean;
    onClose: () => void;
    t: any;
}

const userRolesList: UserRole[] = [
    'Content', 'Support', 'Structure', 'Analyst', 'Creatives', 'Broadcast', 'Development', 'Management', 'Owner'
];

export const UserManagementModal: React.FC<UserManagementModalProps> = ({ isOpen, onClose, t }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [editingUserId, setEditingUserId] = useState<string | null>(null);
    const [tempRole, setTempRole] = useState<UserRole | null>(null);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const data = await userApi.getAll();
            setUsers(data);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchUsers();
        }
    }, [isOpen]);

    const handleEditRole = (user: User) => {
        setEditingUserId(user.id);
        setTempRole(user.role);
    };

    const handleSaveRole = async (userId: string) => {
        if (tempRole) {
            try {
                await userApi.updateRole(userId, tempRole);
                setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: tempRole } : u));
                setEditingUserId(null);
                setTempRole(null);
            } catch (e) {
                console.error(e);
            }
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (confirm("Are you sure you want to delete this user?")) {
            try {
                await userApi.delete(userId);
                setUsers(prev => prev.filter(u => u.id !== userId));
            } catch (e) {
                console.error(e);
            }
        }
    };

    const getRoleLabel = (role: UserRole) => t[`role${role}`] || role;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity" onClick={onClose}>
            <div className="bg-latte-mantle dark:bg-mocha-mantle rounded-xl shadow-2xl p-8 w-full max-w-4xl h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-latte-text dark:text-mocha-text">User Management</h2>
                    <button onClick={onClose} className="text-latte-subtext0 dark:text-mocha-subtext0 hover:text-latte-text dark:hover:text-mocha-text">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-grow overflow-y-auto">
                    {isLoading ? (
                        <p className="text-center p-4">Loading users...</p>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="border-b-2 border-latte-surface1 dark:border-mocha-surface1">
                                <tr>
                                    <th className="p-4 text-sm font-semibold uppercase text-latte-subtext1 dark:text-mocha-subtext1">Name</th>
                                    <th className="p-4 text-sm font-semibold uppercase text-latte-subtext1 dark:text-mocha-subtext1">Username</th>
                                    <th className="p-4 text-sm font-semibold uppercase text-latte-subtext1 dark:text-mocha-subtext1">Role</th>
                                    <th className="p-4 text-sm font-semibold uppercase text-latte-subtext1 dark:text-mocha-subtext1 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id} className="border-b border-latte-surface0 dark:border-mocha-surface0 last:border-b-0 hover:bg-latte-surface0 dark:hover:bg-mocha-surface0">
                                        <td className="p-4 font-medium">{user.name}</td>
                                        <td className="p-4 text-latte-subtext0 dark:text-mocha-subtext0">{user.username}</td>
                                        <td className="p-4">
                                            {editingUserId === user.id ? (
                                                <div className="w-40">
                                                    <SearchableSelect 
                                                        options={userRolesList.map(r => ({ value: r, label: getRoleLabel(r) }))} 
                                                        selected={tempRole || user.role} 
                                                        onChange={(val) => setTempRole(val)} 
                                                        placeholder="Select Role" 
                                                        searchPlaceholder="Search..." 
                                                    />
                                                </div>
                                            ) : (
                                                <span className="px-2 py-1 text-xs font-bold rounded-full bg-latte-mauve/20 text-latte-mauve dark:bg-mocha-mauve/20 dark:text-mocha-mauve">
                                                    {getRoleLabel(user.role)}
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                {editingUserId === user.id ? (
                                                    <>
                                                        <button onClick={() => handleSaveRole(user.id)} className="text-latte-green dark:text-mocha-green hover:underline text-sm font-semibold">Save</button>
                                                        <button onClick={() => setEditingUserId(null)} className="text-latte-subtext0 dark:text-mocha-subtext0 hover:underline text-sm">Cancel</button>
                                                    </>
                                                ) : (
                                                    <button onClick={() => handleEditRole(user)} className="p-2 rounded-md hover:bg-latte-surface1 dark:hover:bg-mocha-surface1 text-latte-blue dark:text-mocha-blue">
                                                        <EditIcon className="w-5 h-5" />
                                                    </button>
                                                )}
                                                <button onClick={() => handleDeleteUser(user.id)} className="p-2 rounded-md hover:bg-latte-surface1 dark:hover:bg-mocha-surface1 text-latte-red dark:text-mocha-red">
                                                    <TrashIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};