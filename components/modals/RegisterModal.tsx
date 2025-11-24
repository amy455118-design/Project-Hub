import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../../types';
import { SearchableSelect } from '../ui/SearchableSelect';

interface RegisterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRegister: (user: Omit<User, 'id'>) => Promise<void>;
    t: any;
}

const userRolesList: UserRole[] = [
    'Content', 'Support', 'Structure', 'Analyst', 'Creatives', 'Broadcast', 'Development', 'Management', 'Owner'
];

export const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose, onRegister, t }) => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<UserRole | ''>('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setName('');
            setUsername('');
            setPassword('');
            setRole('');
            setError('');
            setIsLoading(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !username || !password || !role) {
            setError('All fields are required');
            return;
        }

        setIsLoading(true);
        try {
            await onRegister({ name, username, password, role: role as UserRole });
            onClose();
        } catch (err: any) {
            setError(err.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    const roleOptions = userRolesList.map(r => ({ 
        value: r, 
        label: t[`role${r}`] || r 
    }));
    
    const selectedRoleDescription = role ? (t[`desc${role}`] || '') : '';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity" onClick={onClose}>
            <div className="bg-latte-mantle dark:bg-mocha-mantle rounded-xl shadow-2xl p-8 w-full max-w-md transform transition-all" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-6 text-latte-text dark:text-mocha-text">Register</h2>
                
                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">Name</label>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={e => setName(e.target.value)} 
                            className="w-full px-3 py-2 rounded-lg bg-latte-base dark:bg-mocha-base border border-latte-surface1 dark:border-mocha-surface1 focus:ring-2 focus:ring-latte-mauve dark:focus:ring-mocha-mauve focus:outline-none"
                            placeholder="Your Name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">Username</label>
                        <input 
                            type="text" 
                            value={username} 
                            onChange={e => setUsername(e.target.value)} 
                            className="w-full px-3 py-2 rounded-lg bg-latte-base dark:bg-mocha-base border border-latte-surface1 dark:border-mocha-surface1 focus:ring-2 focus:ring-latte-mauve dark:focus:ring-mocha-mauve focus:outline-none"
                            placeholder="jdoe"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">Password</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={e => setPassword(e.target.value)} 
                            className="w-full px-3 py-2 rounded-lg bg-latte-base dark:bg-mocha-base border border-latte-surface1 dark:border-mocha-surface1 focus:ring-2 focus:ring-latte-mauve dark:focus:ring-mocha-mauve focus:outline-none"
                            placeholder="******"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">Sector / Role</label>
                        <SearchableSelect 
                            options={roleOptions} 
                            selected={role} 
                            onChange={setRole} 
                            placeholder="Select Sector" 
                            searchPlaceholder="Search sector..." 
                        />
                        {selectedRoleDescription && (
                            <p className="text-xs text-latte-subtext0 dark:text-mocha-subtext0 mt-1 italic">{selectedRoleDescription}</p>
                        )}
                    </div>

                    {error && <p className="text-sm text-center text-latte-red dark:text-mocha-red">{error}</p>}

                    <div className="mt-8 flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-latte-surface1 dark:bg-mocha-surface1 font-semibold hover:bg-latte-surface2 dark:hover:bg-mocha-surface2 transition-colors">Cancel</button>
                        <button type="submit" disabled={isLoading} className="px-6 py-2 rounded-lg bg-latte-mauve text-white dark:bg-mocha-mauve dark:text-mocha-crust font-semibold hover:opacity-90 transition-opacity disabled:opacity-50">
                            {isLoading ? 'Registering...' : 'Register'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};