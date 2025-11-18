
import React, { useState } from 'react';
import { CloseIcon } from '../icons';

interface TagInputProps {
    tags: string[];
    onTagsChange: (tags: string[]) => void;
    placeholder: string;
}

export const TagInput: React.FC<TagInputProps> = ({ tags, onTagsChange, placeholder }) => {
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const newTag = inputValue.trim();
            if (newTag && !tags.includes(newTag)) {
                onTagsChange([...tags, newTag]);
            }
            setInputValue('');
        } else if (e.key === 'Backspace' && inputValue === '') {
            e.preventDefault();
            if (tags.length > 0) {
                onTagsChange(tags.slice(0, -1));
            }
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        onTagsChange(tags.filter(tag => tag !== tagToRemove));
    };

    return (
        <div className="w-full flex flex-wrap items-center gap-2 px-3 py-1.5 rounded-lg bg-latte-base dark:bg-mocha-base border border-latte-surface1 dark:border-mocha-surface1 focus-within:ring-2 focus-within:ring-latte-mauve dark:focus-within:ring-mocha-mauve min-h-[42px]">
            {tags.map(tag => (
                <div key={tag} className="flex items-center bg-latte-mauve text-white dark:bg-mocha-mauve dark:text-mocha-crust text-xs font-semibold px-2 py-1 rounded-full">
                    <span>{tag}</span>
                    <button onClick={() => handleRemoveTag(tag)} className="ml-1.5 focus:outline-none">
                        <CloseIcon className="w-3 h-3" />
                    </button>
                </div>
            ))}
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={tags.length === 0 ? placeholder : ''}
                className="flex-grow bg-transparent outline-none text-sm py-1"
            />
        </div>
    );
};
