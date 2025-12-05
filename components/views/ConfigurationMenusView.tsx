
import React, { useState, useEffect, useRef } from 'react';
import { DropdownOption } from '../../types';
import { dropdownApi, generateUUID } from '../../api';
import { TrashIcon, PlusIcon, ListIcon } from '../icons';
import { ConfirmDeleteModal } from '../ui/ConfirmDeleteModal';

interface ConfigurationMenusViewProps {
    t: any;
    options: DropdownOption[];
    userName?: string;
}

const CONTEXTS = [
    { key: 'profile_status', label: 'Profile Status' },
    { key: 'profile_role', label: 'Profile Role' },
    { key: 'account_status', label: 'Account Status' },
    { key: 'project_status', label: 'Project Status' },
    { key: 'security_keys', label: 'Security Keys' },
];

interface MenuConfigCardProps {
    contextKey: string;
    contextLabel: string;
    initialOptions: DropdownOption[];
    t: any;
    userName?: string;
}

const MenuConfigCard: React.FC<MenuConfigCardProps> = ({ 
    contextKey, 
    contextLabel, 
    initialOptions, 
    t, 
    userName 
}) => {
    const [newValue, setNewValue] = useState('');
    const [localOptions, setLocalOptions] = useState<DropdownOption[]>([]);
    const [optionToDelete, setOptionToDelete] = useState<DropdownOption | null>(null);
    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);

    // Sync with props but sort by order_index
    useEffect(() => {
        const sorted = [...initialOptions].sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
        setLocalOptions(sorted);
    }, [initialOptions]);

    const handleAdd = async () => {
        if (!newValue.trim()) return;
        
        const valueToAdd = newValue.trim();
        setNewValue(''); // Clear input immediately

        // Optimistic Update
        const tempId = generateUUID();
        const maxOrder = localOptions.length > 0 ? Math.max(...localOptions.map(o => o.order_index || 0)) : 0;
        const newOption: DropdownOption = {
            id: tempId,
            context: contextKey,
            value: valueToAdd,
            order_index: maxOrder + 1
        };

        setLocalOptions(prev => [...prev, newOption]);

        try {
            await dropdownApi.add(contextKey, valueToAdd, userName, tempId);
            // The Realtime subscription will eventually replace this optimistic item with the real DB item
        } catch (error) {
            console.error("Failed to add option", error);
            // Revert on failure
            setLocalOptions(prev => prev.filter(o => o.id !== tempId));
            setNewValue(valueToAdd);
        }
    };

    const handleDeleteClick = (option: DropdownOption) => {
        setOptionToDelete(option);
    };

    const handleConfirmDelete = async () => {
        if (!optionToDelete) return;
        
        const option = optionToDelete;
        const previousOptions = [...localOptions];
        
        // Optimistic Delete
        setLocalOptions(prev => prev.filter(o => o.id !== option.id));
        setOptionToDelete(null);

        try {
            await dropdownApi.delete(option.id, option.context, option.value, userName);
        } catch (error) {
            console.error("Failed to delete option", error);
            setLocalOptions(previousOptions); // Revert
        }
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, position: number) => {
        dragItem.current = position;
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, position: number) => {
        dragOverItem.current = position;
        const dragIndex = dragItem.current;
        if (dragIndex === null || dragIndex === position) return;

        const newOptions = [...localOptions];
        const draggedItemContent = newOptions[dragIndex];
        newOptions.splice(dragIndex, 1);
        newOptions.splice(position, 0, draggedItemContent);
        
        dragItem.current = position; // Update drag index to new position
        setLocalOptions(newOptions);
    };

    const handleDragEnd = async () => {
        dragItem.current = null;
        dragOverItem.current = null;

        // Persist new order
        const updates = localOptions.map((opt, index) => ({
            id: opt.id,
            order_index: index
        }));
        
        try {
            await dropdownApi.reorder(updates);
        } catch (e) {
            console.error("Failed to reorder", e);
        }
    };

    return (
        <>
            <div className="bg-latte-crust dark:bg-mocha-crust p-6 rounded-xl shadow-md border border-latte-surface0 dark:border-mocha-surface0 flex flex-col h-full">
                <h3 className="text-lg font-bold text-latte-text dark:text-mocha-text mb-4 border-b border-latte-surface1 dark:border-mocha-surface1 pb-2">
                    {t[contextLabel] || contextLabel}
                </h3>
                
                <div className="flex gap-2 mb-4">
                    <input 
                        type="text" 
                        value={newValue} 
                        onChange={(e) => setNewValue(e.target.value)}
                        placeholder="Add new option..."
                        className="flex-grow px-3 py-2 text-sm rounded-lg bg-latte-base dark:bg-mocha-base border border-latte-surface1 dark:border-mocha-surface1 focus:ring-2 focus:ring-latte-mauve dark:focus:ring-mocha-mauve focus:outline-none"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAdd();
                        }}
                    />
                    <button 
                        onClick={handleAdd}
                        className="p-2 bg-latte-mauve text-white dark:bg-mocha-mauve dark:text-mocha-crust rounded-lg hover:opacity-90 transition-opacity"
                    >
                        <PlusIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-grow overflow-y-auto max-h-64 space-y-2 pr-1">
                    {localOptions.length === 0 && (
                        <p className="text-sm text-latte-subtext0 dark:text-mocha-subtext0 italic text-center py-4">No options configured.</p>
                    )}
                    {localOptions.map((opt, index) => (
                        <div 
                            key={opt.id} 
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragEnter={(e) => handleDragEnter(e, index)}
                            onDragEnd={handleDragEnd}
                            onDragOver={(e) => e.preventDefault()}
                            className="flex justify-between items-center p-2 rounded-lg bg-latte-base dark:bg-mocha-base border border-latte-surface1 dark:border-mocha-surface1 group cursor-move hover:border-latte-mauve dark:hover:border-mocha-mauve transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <ListIcon className="w-4 h-4 text-latte-subtext0 dark:text-mocha-subtext0 cursor-grab" />
                                <span className="text-sm text-latte-text dark:text-mocha-text">{opt.value}</span>
                            </div>
                            <button 
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleDeleteClick(opt);
                                }}
                                onMouseDown={(e) => e.stopPropagation()} // Prevent drag start stealing focus
                                title="Delete"
                                className="text-latte-red dark:text-mocha-red p-1 hover:bg-latte-surface2 dark:hover:bg-mocha-surface2 rounded transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                            >
                                <TrashIcon className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <ConfirmDeleteModal
                isOpen={!!optionToDelete}
                onClose={() => setOptionToDelete(null)}
                onConfirm={handleConfirmDelete}
                title={t.confirmDelete || "Confirm Delete"}
                message={
                    <>
                        Are you sure you want to remove <strong className="text-latte-text dark:text-mocha-text">{optionToDelete?.value}</strong> from {t[contextLabel] || contextLabel}?
                    </>
                }
                t={t}
            />
        </>
    );
};

export const ConfigurationMenusView: React.FC<ConfigurationMenusViewProps> = ({ t, options, userName }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CONTEXTS.map((ctx) => {
                const contextOptions = (options || []).filter(o => o.context === ctx.key);
                return (
                    <MenuConfigCard 
                        key={ctx.key} 
                        contextKey={ctx.key} 
                        contextLabel={ctx.label} 
                        initialOptions={contextOptions} 
                        t={t} 
                        userName={userName}
                    />
                );
            })}
        </div>
    );
};
