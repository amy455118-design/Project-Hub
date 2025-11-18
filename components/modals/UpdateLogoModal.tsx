
import React, { useState, useEffect, useRef } from 'react';

interface UpdateLogoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (logoSrc: string) => void;
    t: any;
}

export const UpdateLogoModal: React.FC<UpdateLogoModalProps> = ({ isOpen, onClose, onSave, t }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!selectedFile) {
            setPreview(null);
            return;
        }
        const objectUrl = URL.createObjectURL(selectedFile);
        setPreview(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [selectedFile]);

    useEffect(() => {
        if (!isOpen) {
            setSelectedFile(null);
            setPreview(null);
        }
    }, [isOpen]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSave = () => {
        if (!selectedFile) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            onSave(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity" onClick={onClose}>
            <div className="bg-latte-mantle dark:bg-mocha-mantle rounded-xl shadow-2xl p-8 w-full max-w-md transform transition-all" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-6 text-latte-text dark:text-mocha-text">{t.updateLogo}</h2>
                <div className="space-y-4">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full px-4 py-2 rounded-lg border-2 border-dashed border-latte-surface2 dark:border-mocha-surface2 text-latte-subtext1 dark:text-mocha-subtext1 hover:border-latte-mauve dark:hover:border-mocha-mauve hover:text-latte-mauve dark:hover:text-mocha-mauve transition-colors"
                    >
                        {selectedFile ? selectedFile.name : t.selectFile}
                    </button>

                    {preview && (
                        <div className="flex justify-center p-4 border border-latte-surface1 dark:border-mocha-surface1 rounded-lg bg-latte-base dark:bg-mocha-base">
                            <img src={preview} alt="Logo Preview" className="max-h-32 rounded-md" />
                        </div>
                    )}
                </div>
                <div className="mt-8 flex justify-end space-x-4">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-latte-surface1 dark:bg-mocha-surface1 font-semibold hover:bg-latte-surface2 dark:hover:bg-mocha-surface2 transition-colors">
                        {t.cancel}
                    </button>
                    <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-latte-mauve text-white dark:bg-mocha-mauve dark:text-mocha-crust font-semibold hover:opacity-90 transition-opacity disabled:opacity-50" disabled={!selectedFile}>
                        {t.save}
                    </button>
                </div>
            </div>
        </div>
    );
};
