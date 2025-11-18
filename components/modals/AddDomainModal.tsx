
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Domain, Subdomain, Partnership } from '../../types';
import { PlusIcon, CloseIcon } from '../icons';
import { SearchableSelect } from '../ui/SearchableSelect';
import { Checkbox } from '../ui/Checkbox';
import { TagInput } from '../ui/TagInput';

interface AddDomainModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (domainData: Omit<Domain, 'id' | 'isActive'> & { id?: string }) => void;
    t: any;
    countryOptions: { value: string; label: string }[];
    languageOptions: { value: string; label: string }[];
    partnerships: Partnership[];
    projectOptions: { value: string; label: string }[];
    editingDomain?: Domain | null;
}

const newSubdomainTemplate: Omit<Subdomain, 'id'> = { name: '', countries: [], language: '', planningSheetUrl: '', hasOfferwall: false, hasPreloader: false, categories: [], isActive: true };

export const AddDomainModal: React.FC<AddDomainModalProps> = ({ isOpen, onClose, onSave, t, countryOptions, languageOptions, partnerships, projectOptions, editingDomain }) => {
    const [name, setName] = useState('');
    const [countries, setCountries] = useState<string[]>([]);
    const [language, setLanguage] = useState('');
    const [categories, setCategories] = useState<string[]>([]);
    const [gamAccount, setGamAccount] = useState('');
    const [gamCountry, setGamCountry] = useState('');
    const [partnershipId, setPartnershipId] = useState<string | undefined>(undefined);
    const [planningSheetUrl, setPlanningSheetUrl] = useState('');
    const [publisherAdx, setPublisherAdx] = useState('');
    const [hasPreloader, setHasPreloader] = useState(false);
    const [hasOfferwall, setHasOfferwall] = useState(false);
    const [hasPin, setHasPin] = useState(false);
    const [subdomains, setSubdomains] = useState<(Omit<Subdomain, 'id'> & { id?: string })[]>([newSubdomainTemplate]);
    const [projectIds, setProjectIds] = useState<string[]>([]);

    const partnershipOptions = useMemo(() => partnerships.map(p => ({ value: p.id, label: p.name })), [partnerships]);

    const resetForm = useCallback(() => {
        setName('');
        setCountries([]);
        setLanguage('');
        setCategories([]);
        setGamAccount('');
        setGamCountry('');
        setPartnershipId(undefined);
        setPlanningSheetUrl('');
        setPublisherAdx('');
        setHasPreloader(false);
        setHasOfferwall(false);
        setHasPin(false);
        setSubdomains([newSubdomainTemplate]);
        setProjectIds([]);
    }, []);

    useEffect(() => {
        if (isOpen) {
            if (editingDomain) {
                setName(editingDomain.name);
                setCountries(editingDomain.countries);
                setLanguage(editingDomain.language);
                setCategories(editingDomain.categories);
                setGamAccount(editingDomain.gamAccount);
                setGamCountry(editingDomain.gamCountry);
                setPartnershipId(editingDomain.partnershipId);
                setPlanningSheetUrl(editingDomain.planningSheetUrl);
                setPublisherAdx(editingDomain.publisherAdx);
                setHasPreloader(editingDomain.hasPreloader);
                setHasOfferwall(editingDomain.hasOfferwall);
                setHasPin(editingDomain.hasPin);
                setSubdomains(editingDomain.subdomains.length > 0 ? editingDomain.subdomains : [newSubdomainTemplate]);
                setProjectIds(editingDomain.projectIds || []);
            } else {
                resetForm();
            }
        }
    }, [isOpen, editingDomain, resetForm]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    const handleSubdomainChange = <K extends keyof Omit<Subdomain, 'id'>>(index: number, field: K, value: (Omit<Subdomain, 'id'>)[K]) => {
        const newSubdomains = subdomains.map((sub, i) => i === index ? { ...sub, [field]: value } : sub);
        setSubdomains(newSubdomains);
    };

    const addSubdomainField = () => {
        setSubdomains([...subdomains, { ...newSubdomainTemplate }]);
    };

    const removeSubdomainField = (index: number) => {
        if (subdomains.length > 1) {
            const newSubdomains = subdomains.filter((_, i) => i !== index);
            setSubdomains(newSubdomains);
        }
    };

    const handleSave = () => {
        const finalSubdomains = subdomains
            .filter(sub => sub.name.trim() || sub.countries.length > 0 || sub.language.trim() || (sub.planningSheetUrl && sub.planningSheetUrl.trim()))
            .map(sub => ({
                ...sub,
                id: sub.id || crypto.randomUUID(),
                planningSheetUrl: sub.planningSheetUrl || '',
                isActive: sub.isActive === false ? false : true
            }));

        if (name.trim() && countries.length > 0 && language) {
            const domainData = {
                name, countries, language, subdomains: finalSubdomains,
                gamAccount, gamCountry, partnershipId, planningSheetUrl,
                publisherAdx, hasPreloader, hasOfferwall, hasPin,
                categories, projectIds,
            };

            if (editingDomain) {
                onSave({ ...domainData, id: editingDomain.id });
            } else {
                onSave(domainData);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity" onClick={onClose}>
            <div className="bg-latte-mantle dark:bg-mocha-mantle rounded-xl shadow-2xl p-8 w-full max-w-4xl transform transition-all" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-6 text-latte-text dark:text-mocha-text">{editingDomain ? t.editDomain : t.addDomain}</h2>

                <div className="space-y-6 max-h-[70vh] overflow-y-auto py-2 pr-6 -mr-2">
                    {/* Basic Info */}
                    <div className="p-4 rounded-lg bg-latte-base dark:bg-mocha-base border border-latte-surface1 dark:border-mocha-surface1">
                        <h3 className="font-semibold mb-3 text-latte-text dark:text-mocha-text">Basic Information</h3>
                        <div>
                            <label className="block text-sm font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">{t.domainName}</label>
                            <input type="text" value={name} placeholder="example.com" onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-latte-mantle dark:bg-mocha-mantle border border-latte-surface1 dark:border-mocha-surface1 focus:ring-2 focus:ring-latte-mauve dark:focus:ring-mocha-mauve focus:outline-none" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">{t.countries}</label>
                                <SearchableSelect options={countryOptions} selected={countries} onChange={setCountries} placeholder={t.selectCountries} searchPlaceholder={t.searchCountries} multiple />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">{t.language}</label>
                                <SearchableSelect options={languageOptions} selected={language} onChange={setLanguage} placeholder={t.selectLanguage} searchPlaceholder={t.searchLanguages} />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">{t.categories}</label>
                            <TagInput tags={categories} onTagsChange={setCategories} placeholder={t.addCategory} />
                        </div>
                    </div>

                    {/* Relationships */}
                    <div className="p-4 rounded-lg bg-latte-base dark:bg-mocha-base border border-latte-surface1 dark:border-mocha-surface1">
                        <h3 className="font-semibold mb-3 text-latte-text dark:text-mocha-text">Relationships</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">{t.partnership}</label>
                                <SearchableSelect options={partnershipOptions} selected={partnershipId || ''} onChange={setPartnershipId} placeholder={t.selectPartnership} searchPlaceholder={t.searchPartnerships} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">{t.projects}</label>
                                <SearchableSelect options={projectOptions} selected={projectIds} onChange={setProjectIds} placeholder={t.selectProjects} searchPlaceholder={t.searchProjects} multiple />
                            </div>
                        </div>
                    </div>

                    {/* GAM Info */}
                    <div className="p-4 rounded-lg bg-latte-base dark:bg-mocha-base border border-latte-surface1 dark:border-mocha-surface1">
                        <h3 className="font-semibold mb-3 text-latte-text dark:text-mocha-text">Monetization Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">{t.gamAccount}</label>
                                <input type="text" value={gamAccount} onChange={(e) => setGamAccount(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-latte-mantle dark:bg-mocha-mantle border border-latte-surface1 dark:border-mocha-surface1 focus:ring-2 focus:ring-latte-mauve dark:focus:ring-mocha-mauve focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">{t.gamCountry}</label>
                                <SearchableSelect options={countryOptions} selected={gamCountry} onChange={setGamCountry} placeholder={t.selectCountries} searchPlaceholder={t.searchCountries} />
                            </div>
                           
                            <div>
                                <label className="block text-sm font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">{t.publisherAdx}</label>
                                <input type="text" value={publisherAdx} onChange={(e) => setPublisherAdx(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-latte-mantle dark:bg-mocha-mantle border border-latte-surface1 dark:border-mocha-surface1 focus:ring-2 focus:ring-latte-mauve dark:focus:ring-mocha-mauve focus:outline-none" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">{t.planningSheetUrl}</label>
                            <input type="url" value={planningSheetUrl} onChange={(e) => setPlanningSheetUrl(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-latte-mantle dark:bg-mocha-mantle border border-latte-surface1 dark:border-mocha-surface1 focus:ring-2 focus:ring-latte-mauve dark:focus:ring-mocha-mauve focus:outline-none" />
                        </div>
                        <div className="mt-4 flex space-x-6">
                            <Checkbox label={t.preloader} checked={hasPreloader} onChange={setHasPreloader} />
                            <Checkbox label={t.offerwall} checked={hasOfferwall} onChange={setHasOfferwall} />
                            <Checkbox label={t.pinReceived} checked={hasPin} onChange={setHasPin} />
                        </div>
                    </div>

                    {/* Subdomains */}
                    <div>
                        <label className="block text-lg font-semibold text-latte-text dark:text-mocha-text mb-2">{t.subdomains}</label>
                        <div className="space-y-4">
                            {subdomains.map((sub, index) => (
                                <div key={index} className="p-4 rounded-lg bg-latte-base dark:bg-mocha-base border border-latte-surface1 dark:border-mocha-surface1 space-y-4 relative">
                                    <div className="flex items-start space-x-2">
                                        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">{t.subdomainName}</label>
                                                <input type="text" value={sub.name} onChange={(e) => handleSubdomainChange(index, 'name', e.target.value)} placeholder={t.subdomainName} className="w-full px-3 py-2 rounded-lg bg-latte-mantle dark:bg-mocha-mantle border border-latte-surface1 dark:border-mocha-surface1 focus:ring-2 focus:ring-latte-mauve dark:focus:ring-mocha-mauve focus:outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">{t.planningSheetUrl}</label>
                                                <input type="url" value={sub.planningSheetUrl || ''} onChange={(e) => handleSubdomainChange(index, 'planningSheetUrl', e.target.value)} placeholder="https://..." className="w-full px-3 py-2 rounded-lg bg-latte-mantle dark:bg-mocha-mantle border border-latte-surface1 dark:border-mocha-surface1 focus:ring-2 focus:ring-latte-mauve dark:focus:ring-mocha-mauve focus:outline-none" />
                                            </div>
                                        </div>
                                        <button onClick={() => removeSubdomainField(index)} className="p-2 mt-1 rounded-lg text-latte-red dark:text-mocha-red hover:bg-latte-red/10 dark:hover:bg-mocha-red/10 disabled:opacity-50 disabled:cursor-not-allowed" disabled={subdomains.length <= 1}>
                                            <CloseIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">{t.countries}</label>
                                            <SearchableSelect options={countryOptions} selected={sub.countries} onChange={(value) => handleSubdomainChange(index, 'countries', value)} placeholder={t.selectCountries} searchPlaceholder={t.searchCountries} multiple />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">{t.language}</label>
                                            <SearchableSelect options={languageOptions} selected={sub.language} onChange={(value) => handleSubdomainChange(index, 'language', value)} placeholder={t.selectLanguage} searchPlaceholder={t.searchLanguages} />
                                        </div>
                                    </div>
                                    <div className="mt-2">
                                        <label className="block text-xs font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">{t.categories}</label>
                                        <TagInput tags={sub.categories} onTagsChange={(value) => handleSubdomainChange(index, 'categories', value)} placeholder={t.addCategory} />
                                    </div>
                                    <div className="flex space-x-6">
                                        <Checkbox label={t.preloader} checked={sub.hasPreloader} onChange={(checked) => handleSubdomainChange(index, 'hasPreloader', checked)} />
                                        <Checkbox label={t.offerwall} checked={sub.hasOfferwall} onChange={(checked) => handleSubdomainChange(index, 'hasOfferwall', checked)} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button onClick={addSubdomainField} className="mt-3 flex items-center space-x-2 text-sm font-semibold text-latte-mauve dark:text-mocha-mauve hover:opacity-80">
                            <PlusIcon className="w-4 h-4" />
                            <span>{t.addSubdomain}</span>
                        </button>
                    </div>
                </div>

                <div className="mt-8 flex justify-end space-x-4">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-latte-surface1 dark:bg-mocha-surface1 font-semibold hover:bg-latte-surface2 dark:hover:bg-mocha-surface2 transition-colors">
                        {t.cancel}
                    </button>
                    <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-latte-mauve text-white dark:bg-mocha-mauve dark:text-mocha-crust font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed" disabled={!name.trim() || countries.length === 0 || !language}>
                        {t.save}
                    </button>
                </div>
            </div>
        </div>
    );
};
