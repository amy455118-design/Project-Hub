
import React, { useState, useEffect, useRef } from 'react';
import { CloseIcon, UploadCloudIcon, ImageIcon } from '../icons';

interface UploadImageModalProps {
    isOpen: boolean;
    onClose: () => void;
    onTranscribe: (base64: string) => Promise<string[]>;
    onSuccess: (names: string[]) => void;
    t: any;
}

export const UploadImageModal: React.FC<UploadImageModalProps> = ({ isOpen, onClose, onTranscribe, onSuccess, t }) => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setImageSrc(null);
            setIsLoading(false);
            setError(null);
        }
    }, [isOpen]);

    useEffect(() => {
        const handlePaste = (e: ClipboardEvent) => {
            if (!isOpen) return;
            const items = e.clipboardData?.items;
            if (!items) return;

            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    const blob = items[i].getAsFile();
                    if (blob) {
                        const reader = new FileReader();
                        reader.onload = (event) => setImageSrc(event.target?.result as string);
                        reader.readAsDataURL(blob);
                        e.preventDefault();
                        return;
                    }
                }
            }
        };

        window.addEventListener('paste', handlePaste);
        return () => window.removeEventListener('paste', handlePaste);
    }, [isOpen]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            setImageSrc(e.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleTranscribeClick = async () => {
        if (!imageSrc) return;
        setIsLoading(true);
        setError(null);

        try {
            const names = await onTranscribe(imageSrc);
            onSuccess(names);
        } catch (err) {
            console.error("Transcription failed", err);
            setError(t.bulkSaveError || "Failed to extract names.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
            <div className="bg-latte-mantle dark:bg-mocha-mantle rounded-xl shadow-2xl p-8 w-full max-w-2xl transform transition-all flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-latte-text dark:text-mocha-text">{t.addPagesBulk}</h2>
                    <button onClick={onClose} className="text-latte-subtext0 dark:text-mocha-subtext0 hover:text-latte-text dark:hover:text-mocha-text">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-grow flex flex-col items-center justify-center border-2 border-dashed border-latte-surface2 dark:border-mocha-surface2 rounded-xl p-8 bg-latte-base dark:bg-mocha-base min-h-[300px]">
                    {imageSrc ? (
                        <div className="relative w-full h-full flex flex-col items-center">
                            <img src={imageSrc} alt="Preview" className="max-h-[250px] object-contain rounded-lg mb-4 shadow-md" />
                            <button 
                                onClick={() => { setImageSrc(null); fileInputRef.current!.value = ''; }}
                                className="text-sm text-latte-red dark:text-mocha-red hover:underline font-medium"
                            >
                                {t.changeImage}
                            </button>
                        </div>
                    ) : (
                        <div className="text-center space-y-4">
                            <div className="bg-latte-surface0 dark:bg-mocha-surface0 p-4 rounded-full inline-block">
                                <UploadCloudIcon className="w-12 h-12 text-latte-mauve dark:text-mocha-mauve" />
                            </div>
                            <p className="text-lg font-medium text-latte-text dark:text-mocha-text">{t.uploadOrPaste}</p>
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="px-4 py-2 bg-latte-surface2 dark:bg-mocha-surface2 rounded-lg text-latte-text dark:text-mocha-text hover:bg-latte-surface1 dark:hover:bg-mocha-surface1 transition-colors font-semibold"
                            >
                                {t.selectImage}
                            </button>
                        </div>
                    )}
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                </div>

                {error && (
                    <p className="mt-4 text-center text-latte-red dark:text-mocha-red">{error}</p>
                )}

                <div className="mt-8 flex justify-end space-x-4">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-latte-surface1 dark:bg-mocha-surface1 font-semibold hover:bg-latte-surface2 dark:hover:bg-mocha-surface2 transition-colors">
                        {t.cancel}
                    </button>
                    <button 
                        onClick={handleTranscribeClick} 
                        disabled={!imageSrc || isLoading}
                        className="px-6 py-2 rounded-lg bg-latte-mauve text-white dark:bg-mocha-mauve dark:text-mocha-crust font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center space-x-2"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>{t.transcribing}</span>
                            </>
                        ) : (
                            <span>{t.extractPages}</span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
