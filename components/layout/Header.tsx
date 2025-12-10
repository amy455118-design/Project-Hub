
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GlobeIcon, MoonIcon, SunIcon, LogOutIcon, SettingsIcon } from '../icons';

interface HeaderProps {
    theme: 'light' | 'dark';
    onThemeToggle: () => void;
    onLogout: () => void;
    onSettingsClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, onThemeToggle, onLogout, onSettingsClick }) => {
    const { t, i18n } = useTranslation();
    const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
    const languageDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target as Node)) {
                setIsLanguageDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    
    const handleLanguageChange = (lang: string) => {
        i18n.changeLanguage(lang);
        setIsLanguageDropdownOpen(false);
    };

    return (
        <header className="flex items-center justify-between p-4 border-b border-latte-surface0 dark:border-mocha-surface0 bg-latte-crust dark:bg-mocha-crust">
            <div>
                <button
                    onClick={onSettingsClick}
                    className="p-2 rounded-lg hover:bg-latte-surface0 dark:hover:bg-mocha-surface0 text-latte-subtext1 dark:text-mocha-subtext1"
                    aria-label={t('configuration')}
                >
                    <SettingsIcon className="w-6 h-6" />
                </button>
            </div>
            <div className="flex items-center space-x-4">
                <div className="relative" ref={languageDropdownRef}>
                    <button
                        onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-latte-surface0 dark:hover:bg-mocha-surface0"
                    >
                        <GlobeIcon className="w-5 h-5 text-latte-subtext1 dark:text-mocha-subtext1" />
                        <span className="uppercase font-medium text-sm">{i18n.language || 'pt'}</span>
                    </button>
                    {isLanguageDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-32 bg-latte-mantle dark:bg-mocha-mantle rounded-lg shadow-xl border border-latte-surface1 dark:border-mocha-surface1 z-10">
                            <button onClick={() => handleLanguageChange('pt')} className="w-full text-left px-4 py-2 text-sm text-latte-subtext1 dark:text-mocha-subtext1 hover:bg-latte-surface0 dark:hover:bg-mocha-surface0 rounded-t-lg">Português</button>
                            <button onClick={() => handleLanguageChange('en')} className="w-full text-left px-4 py-2 text-sm text-latte-subtext1 dark:text-mocha-subtext1 hover:bg-latte-surface0 dark:hover:bg-mocha-surface0">English</button>
                            <button onClick={() => handleLanguageChange('es')} className="w-full text-left px-4 py-2 text-sm text-latte-subtext1 dark:text-mocha-subtext1 hover:bg-latte-surface0 dark:hover:bg-mocha-surface0 rounded-b-lg">Español</button>
                        </div>
                    )}
                </div>
                <button onClick={onThemeToggle} className="p-2 rounded-lg hover:bg-latte-surface0 dark:hover:bg-mocha-surface0">
                    {theme === 'light' ? <MoonIcon className="w-6 h-6 text-latte-mauve" /> : <SunIcon className="w-6 h-6 text-mocha-mauve" />}
                </button>
                <button
                    onClick={onLogout}
                    className="p-2 rounded-lg hover:bg-latte-surface0 dark:hover:bg-mocha-surface0 flex items-center space-x-2 text-latte-red dark:text-mocha-red"
                    aria-label={t('logout')}
                >
                    <LogOutIcon className="w-5 h-5" />
                    <span className="hidden sm:inline text-sm font-medium">{t('logout')}</span>
                </button>
            </div>
        </header>
    );
};
