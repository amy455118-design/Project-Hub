import React, { useState } from 'react';
import { MtLogoIcon, LoginArtIcon } from '../icons';
import { RegisterModal } from '../modals/RegisterModal';
import { User } from '../../types';

interface LoginViewProps {
    onLogin: (user: string, pass: string) => Promise<void>;
    onRegister: (user: Omit<User, 'id'>) => Promise<void>;
    t: any;
    error: string;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin, onRegister, t, error }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showMainConstellation, setShowMainConstellation] = useState(true);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        await onLogin(username, password);
        setIsLoading(false);
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-latte-base dark:bg-mocha-base">
            {/* Left Side: Form */}
            <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 lg:p-12 bg-latte-mantle dark:bg-mocha-mantle order-2 md:order-1">
                <div className="w-full max-w-sm">
                    <div className="mb-8">
                        <MtLogoIcon className="h-12 w-auto mb-6" />
                        <h1 className="text-4xl font-bold text-latte-text dark:text-mocha-text">{t.welcomeLogin}</h1>
                        <p className="mt-2 text-latte-subtext1 dark:text-mocha-subtext1">{t.loginDescription}</p>
                    </div>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">{t.username}</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="w-full px-3 py-2 rounded-lg bg-latte-base dark:bg-mocha-base border border-latte-surface1 dark:border-mocha-surface1 focus:ring-2 focus:ring-latte-mauve dark:focus:ring-mocha-mauve focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">{t.password}</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-3 py-2 rounded-lg bg-latte-base dark:bg-mocha-base border border-latte-surface1 dark:border-mocha-surface1 focus:ring-2 focus:ring-latte-mauve dark:focus:ring-mocha-mauve focus:outline-none"
                            />
                        </div>
                        {error && <p className="text-sm text-center text-latte-red dark:text-mocha-red">{error}</p>}
                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full px-4 py-2.5 rounded-lg bg-latte-mauve text-white dark:bg-mocha-mauve dark:text-mocha-crust font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                            >
                                {isLoading ? 'Logging in...' : t.login}
                            </button>
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-latte-subtext1 dark:text-mocha-subtext1">
                                Don't have an account?{' '}
                                <button
                                    type="button"
                                    onClick={() => setIsRegisterModalOpen(true)}
                                    className="text-latte-mauve dark:text-mocha-mauve font-semibold hover:underline"
                                >
                                    Register here
                                </button>
                            </p>
                        </div>
                    </form>
                </div>
            </div>

            {/* Right Side: Art */}
            <div className="w-full md:w-1/2 h-64 md:h-auto bg-latte-base dark:bg-mocha-crust order-1 md:order-2 relative group">
                <button
                    onClick={() => setShowMainConstellation(!showMainConstellation)}
                    className="absolute top-4 right-4 z-10 px-3 py-1.5 bg-mocha-surface0/50 text-mocha-text text-xs rounded-md backdrop-blur-sm hover:bg-mocha-surface0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                    Toggle Main Constellation
                </button>
                <LoginArtIcon
                    className="w-full h-full object-cover"
                    showMainConstellation={showMainConstellation}
                />
            </div>

            <RegisterModal 
                isOpen={isRegisterModalOpen} 
                onClose={() => setIsRegisterModalOpen(false)} 
                onRegister={onRegister}
                t={t}
            />
        </div>
    );
};