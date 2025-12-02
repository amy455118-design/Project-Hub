
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDownIcon, CloseIcon, PlusIcon } from '../icons';

interface SearchableSelectProps {
    options: { value: string; label: string }[];
    selected: string | string[];
    onChange: (selected: any) => void;
    placeholder: string;
    searchPlaceholder: string;
    multiple?: boolean;
    disabled?: boolean;
    creatable?: boolean;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({ 
    options, 
    selected, 
    onChange, 
    placeholder, 
    searchPlaceholder, 
    multiple = false, 
    disabled = false,
    creatable = false
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const wrapperRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number; width: number } | null>(null);

    const updatePosition = useCallback(() => {
        if (wrapperRef.current) {
            const rect = wrapperRef.current.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + 4, // 4px gap
                left: rect.left,
                width: rect.width,
            });
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            updatePosition();
            const timer = setTimeout(() => searchInputRef.current?.focus(), 1);

            window.addEventListener('resize', updatePosition);
            window.addEventListener('scroll', updatePosition, true);

            return () => {
                clearTimeout(timer);
                window.removeEventListener('resize', updatePosition);
                window.removeEventListener('scroll', updatePosition, true);
            };
        }
    }, [isOpen, updatePosition]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                wrapperRef.current && !wrapperRef.current.contains(event.target as Node) &&
                dropdownRef.current && !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredOptions = useMemo(() =>
        options.filter(option =>
            option.label.toLowerCase().includes(searchTerm.toLowerCase())
        ), [options, searchTerm]);

    const handleSelect = (value: string) => {
        if (multiple && Array.isArray(selected)) {
            const newSelected = selected.includes(value)
                ? selected.filter(item => item !== value)
                : [...selected, value];
            onChange(newSelected);
        } else {
            onChange(value);
            setIsOpen(false);
        }
    };

    const handleRemove = (value: string) => {
        if (multiple && Array.isArray(selected)) {
            onChange(selected.filter(item => item !== value));
        }
    };

    const handleCreate = () => {
        if (searchTerm.trim()) {
            handleSelect(searchTerm.trim());
            setSearchTerm('');
        }
    };

    const displayValue = () => {
        if (multiple && Array.isArray(selected) && selected.length > 0) {
            return (
                <div className="flex flex-wrap gap-1">
                    {selected.map(value => (
                        <div key={value} className="flex items-center bg-latte-mauve text-white dark:bg-mocha-mauve dark:text-mocha-crust text-xs font-semibold px-2 py-1 rounded-full">
                            <span>{options.find(opt => opt.value === value)?.label || value}</span>
                            <button onClick={(e) => { e.stopPropagation(); handleRemove(value); }} className="ml-1.5">
                                <CloseIcon className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            );
        }
        if (!multiple && typeof selected === 'string' && selected) {
            return options.find(opt => opt.value === selected)?.label || selected;
        }
        return <span className="text-latte-overlay0 dark:text-mocha-overlay0">{placeholder}</span>;
    };

    const DropdownContent = (
        <div
            ref={dropdownRef}
            style={{
                top: dropdownPosition?.top ? `${dropdownPosition.top}px` : '-9999px',
                left: dropdownPosition?.left ? `${dropdownPosition.left}px` : '-9999px',
                width: dropdownPosition?.width ? `${dropdownPosition.width}px` : undefined,
            }}
            className="fixed z-[9999] bg-latte-mantle dark:bg-mocha-mantle rounded-lg shadow-xl border border-latte-surface1 dark:border-mocha-surface1"
        >
            <div className="p-2">
                <input
                    ref={searchInputRef}
                    type="text"
                    placeholder={searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && creatable && searchTerm.trim() && filteredOptions.length === 0) {
                            e.preventDefault();
                            handleCreate();
                        }
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-latte-base dark:bg-mocha-base border border-latte-surface1 dark:border-mocha-surface1 focus:ring-2 focus:ring-latte-mauve dark:focus:ring-mocha-mauve focus:outline-none"
                />
            </div>
            <ul className="max-h-60 overflow-y-auto p-1">
                {filteredOptions.length > 0 ? (
                    filteredOptions.map(option => (
                        <li
                            key={option.value}
                            onClick={() => handleSelect(option.value)}
                            className={`p-2 rounded-md cursor-pointer text-sm ${(multiple && Array.isArray(selected) && selected.includes(option.value)) || (!multiple && selected === option.value)
                                ? 'bg-latte-mauve text-white dark:bg-mocha-mauve dark:text-mocha-crust'
                                : 'hover:bg-latte-surface0 dark:hover:bg-mocha-surface0'
                                }`}
                        >
                            {option.label}
                        </li>
                    ))
                ) : (
                    creatable && searchTerm.trim() && (
                        <li
                            onClick={handleCreate}
                            className="p-2 rounded-md cursor-pointer text-sm text-latte-blue dark:text-mocha-blue hover:bg-latte-surface0 dark:hover:bg-mocha-surface0 flex items-center gap-2"
                        >
                            <PlusIcon className="w-4 h-4" />
                            Create "{searchTerm}"
                        </li>
                    )
                )}
                
                {filteredOptions.length === 0 && (!creatable || !searchTerm.trim()) && (
                    <li className="p-2 text-sm text-latte-subtext0 dark:text-mocha-subtext0 text-center">
                        No results found
                    </li>
                )}
            </ul>
        </div>
    );

    return (
        <div className="relative" ref={wrapperRef}>
            <div
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg bg-latte-base dark:bg-mocha-base border border-latte-surface1 dark:border-mocha-surface1 min-h-[42px] ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            >
                <div className="flex-grow">{displayValue()}</div>
                <ChevronDownIcon className={`w-5 h-5 text-latte-overlay1 dark:text-mocha-overlay1 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
            {isOpen && !disabled && createPortal(DropdownContent, document.body)}
        </div>
    );
}
