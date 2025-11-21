
import React from 'react';
import { View } from '../../types';
import { ProjectIcon, DomainIcon, ProfileIcon, PageIcon, BMIcon, MessageSquareIcon, UsersIcon, ChevronsRightIcon, ChevronsLeftIcon, MtLogoIcon } from '../icons';

const navItems = [
    { id: 'projects' as View, icon: ProjectIcon, labelKey: 'projects' },
    { id: 'domains' as View, icon: DomainIcon, labelKey: 'domains' },
    { id: 'profiles' as View, icon: ProfileIcon, labelKey: 'profiles' },
    { id: 'pages' as View, icon: PageIcon, labelKey: 'pages' },
    { id: 'bms' as View, icon: BMIcon, labelKey: 'bms' },
    { id: 'chatbots' as View, icon: MessageSquareIcon, labelKey: 'chatbots' },
    { id: 'partnerships' as View, icon: UsersIcon, labelKey: 'partnerships' },
];

interface SidebarProps {
    t: any;
    view: View;
    setView: (view: View) => void;
    isCollapsed: boolean;
    setIsCollapsed: (isCollapsed: boolean) => void;
    logoSrc: string | null;
    onLogoClick: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ t, view, setView, isCollapsed, setIsCollapsed, logoSrc, onLogoClick }) => {
    return (
        <nav className={`bg-latte-mantle dark:bg-mocha-mantle p-4 flex flex-col border-r border-latte-surface0 dark:border-mocha-surface0 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
            <div className="flex-1 overflow-y-auto">
                <div className={`flex justify-center mb-8 ${isCollapsed ? 'py-2' : 'pt-2'}`}>
                    <button
                        onClick={onLogoClick}
                        className="p-1 rounded-md hover:bg-latte-surface0 dark:hover:bg-mocha-surface0 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-latte-mantle dark:focus:ring-offset-mocha-mantle focus:ring-latte-mauve dark:focus:ring-mocha-mauve"
                        aria-label={t.updateLogo}
                    >
                        {logoSrc ? (
                            <img src={logoSrc} alt="Custom Logo" className="h-8 w-auto" />
                        ) : (
                            <MtLogoIcon className="h-8 w-auto flex-shrink-0" />
                        )}
                    </button>
                </div>
                <ul>
                    {navItems.map(item => (
                        <li key={item.id}>
                            <button
                                onClick={() => setView(item.id)}
                                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-lg transition-all duration-200 ${isCollapsed ? 'justify-center' : ''} ${view === item.id
                                    ? 'bg-latte-mauve text-white dark:bg-mocha-mauve dark:text-mocha-base font-semibold'
                                    : 'text-latte-subtext1 dark:text-mocha-subtext1 hover:bg-latte-surface0 dark:hover:bg-mocha-surface0'
                                    }`}
                            >
                                <item.icon className="w-6 h-6 flex-shrink-0" />
                                {!isCollapsed && <span>{t[item.labelKey as keyof typeof t]}</span>}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="flex items-center justify-center space-x-3 px-3 py-2.5 rounded-lg text-latte-subtext1 dark:text-mocha-subtext1 hover:bg-latte-surface0 dark:hover:bg-mocha-surface0"
            >
                {isCollapsed ? <ChevronsRightIcon className="w-6 h-6" /> : <ChevronsLeftIcon className="w-6 h-6" />}
            </button>
        </nav>
    );
};
