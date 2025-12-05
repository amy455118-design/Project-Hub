
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AdAccount, App, BM, Partnership } from '../../types';
import { PlusIcon, CloseIcon } from '../icons';
import { SearchableSelect } from '../ui/SearchableSelect';
import { Checkbox } from '../ui/Checkbox';
import { ApprovalStepSlider } from '../ui/ApprovalStepSlider';
import { generateUUID } from '../../api';

const appPermissions = [
    'pages_show_list', 'pages_manage_metadata', 'pages_messaging', 'business_management',
    'pages_read_engagement', 'pages_user_gender', 'pages_user_locale', 'pages_user_timezone'
];

interface AddBmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (bmData: Omit<BM, 'id'> & { id?: string }) => void;
    t: any;
    countryOptions: { value: string; label: string }[];
    partnershipOptions: { value: string; label: string }[];
    projectOptions: { value: string; label: string }[];
    profileOptions: { value: string; label: string }[];
    pageOptions: { value: string; label: string }[];
    editingBm?: BM | null;
}

const newAdAccountTemplate: Omit<AdAccount, 'id'> = { name: '', accountId: '', paymentMethod: '', paymentMethodOwner: '' };
const newAppTemplate: Omit<App, 'id'> = { name: '', appId: '', appDomain: '', permissions: [], approvalStep: 1 };

export const AddBmModal: React.FC<AddBmModalProps> = ({ isOpen, onClose, onSave, t, countryOptions, partnershipOptions, projectOptions, profileOptions, pageOptions, editingBm }) => {
    const [name, setName] = useState('');
    const [bmId, setBmId] = useState('');
    const [country, setCountry] = useState('');
    const [hasAccessVerification, setHasAccessVerification] = useState(false);
    const [isItProviderVerified, setIsItProviderVerified] = useState(false);
    const [adAccounts, setAdAccounts] = useState<(Omit<AdAccount, 'id'> & { id?: string })[]>([newAdAccountTemplate]);
    const [apps, setApps] = useState<(Omit<App, 'id'> & { id?: string })[]>([newAppTemplate]);
    const [partnershipId, setPartnershipId] = useState<string | undefined>();
    const [projectIds, setProjectIds] = useState<string[]>([]);
    const [profileIds, setProfileIds] = useState<string[]>([]);
    const [pageIds, setPageIds] = useState<string[]>([]);

    const capitalizeWords = (str: string) => str.replace(/(^|\s)\S/g, l => l.toUpperCase());

    const permissionOptions = appPermissions.map(p => ({ value: p, label: p }));
    const partnerOwnerOptions = useMemo(() => partnershipOptions.map(p => ({ value: p.label, label: p.label })), [partnershipOptions]);

    const resetForm = useCallback(() => {
        setName('');
        setBmId('');
        setCountry('');
        setHasAccessVerification(false);
        setIsItProviderVerified(false);
        setAdAccounts([newAdAccountTemplate]);
        setApps([newAppTemplate]);
        setPartnershipId(undefined);
        setProjectIds([]);
        setProfileIds([]);
        setPageIds([]);
    }, []);

    useEffect(() => {
        if (isOpen) {
            if (editingBm) {
                setName(editingBm.name);
                setBmId(editingBm.bmId);
                setCountry(editingBm.country);
                setHasAccessVerification(editingBm.hasAccessVerification);
                setIsItProviderVerified(editingBm.isItProviderVerified);
                setAdAccounts(editingBm.adAccounts && editingBm.adAccounts.length > 0 ? editingBm.adAccounts : [newAdAccountTemplate]);
                setApps(editingBm.apps && editingBm.apps.length > 0 ? editingBm.apps : [newAppTemplate]);
                setPartnershipId(editingBm.partnershipId);
                setProjectIds(editingBm.projectIds || []);
                setProfileIds(editingBm.profileIds || []);
                setPageIds(editingBm.pageIds || []);
            } else {
                resetForm();
            }
        }
    }, [isOpen, editingBm, resetForm]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    const handleAdAccountChange = <K extends keyof Omit<AdAccount, 'id'>>(index: number, field: K, value: (Omit<AdAccount, 'id'>)[K]) => {
        const newAdAccounts = adAccounts.map((acc, i) => i === index ? { ...acc, [field]: value } : acc);
        setAdAccounts(newAdAccounts);
    };

    const addAdAccountField = () => {
        setAdAccounts([...adAccounts, newAdAccountTemplate]);
    };

    const removeAdAccountField = (index: number) => {
        if (adAccounts.length > 1) {
            setAdAccounts(adAccounts.filter((_, i) => i !== index));
        } else {
            setAdAccounts([newAdAccountTemplate]); // Reset if it's the last one
        }
    };

    const handleAppChange = <K extends keyof Omit<App, 'id'>>(index: number, field: K, value: (Omit<App, 'id'>)[K]) => {
        const newApps = apps.map((app, i) => i === index ? { ...app, [field]: value } : app);
        setApps(newApps);
    };

    const addAppField = () => {
        setApps([...apps, newAppTemplate]);
    };

    const removeAppField = (index: number) => {
        if (apps.length > 1) {
            setApps(apps.filter((_, i) => i !== index));
        } else {
            setApps([newAppTemplate]);
        }
    };

    const handleSave = () => {
        if (name.trim() && bmId.trim() && country) {
            // FIX: Ensure adAccounts and apps have IDs and filter out empty ones before saving.
            // This aligns with the `AdAccount[]` and `App[]` types expected by the onSave prop.
            const finalAdAccounts = adAccounts
                .filter(acc => acc.name.trim() || acc.accountId.trim())
                .map(acc => ({
                    ...acc,
                    id: acc.id || generateUUID(),
                }));

            const finalApps = apps
                .filter(app => app.name.trim() || app.appId.trim())
                .map(app => ({
                    ...app,
                    id: app.id || generateUUID(),
                }));

            const bmData = {
                name, bmId, country, hasAccessVerification, isItProviderVerified,
                adAccounts: finalAdAccounts,
                apps: finalApps,
                partnershipId, projectIds, profileIds, pageIds
            };

            if (editingBm) {
                onSave({ ...bmData, id: editingBm.id });
            } else {
                onSave(bmData);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity" onClick={onClose}>
            <div className="bg-latte-mantle dark:bg-mocha-mantle rounded-xl shadow-2xl p-8 w-full max-w-4xl transform transition-all" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-6 text-latte-text dark:text-mocha-text">{editingBm ? t.editBm : t.addBm}</h2>
                <div className="space-y-6 max-h-[70vh] overflow-y-auto py-2 pr-6 -mr-2">
                    <div className="p-4 rounded-lg bg-latte-base dark:bg-mocha-base border border-latte-surface1 dark:border-mocha-surface1">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">{t.bmName}</label>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-latte-mantle dark:bg-mocha-mantle border border-latte-surface1 dark:border-mocha-surface1 focus:ring-2 focus:ring-latte-mauve dark:focus:ring-mocha-mauve focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">{t.bmId}</label>
                                <input type="text" value={bmId} onChange={(e) => setBmId(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-latte-mantle dark:bg-mocha-mantle border border-latte-surface1 dark:border-mocha-surface1 focus:ring-2 focus:ring-latte-mauve dark:focus:ring-mocha-mauve focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">{t.country}</label>
                                <SearchableSelect options={countryOptions} selected={country} onChange={setCountry} placeholder={t.selectCountries} searchPlaceholder={t.searchCountries} />
                            </div>
                        </div>
                        <div className="flex space-x-6 pt-4 mt-4 border-t border-latte-surface1 dark:border-mocha-surface1">
                            <Checkbox label={t.accessVerification} checked={hasAccessVerification} onChange={setHasAccessVerification} />
                            <Checkbox label={t.itProviderVerified} checked={isItProviderVerified} onChange={setIsItProviderVerified} />
                        </div>
                    </div>

                     {/* Relationships */}
                    <div className="p-4 rounded-lg bg-latte-base dark:bg-mocha-base border border-latte-surface1 dark:border-mocha-surface1">
                        <h3 className="font-semibold mb-3 text-latte-text dark:text-mocha-text">Relationships</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">{t.partnership}</label>
                                <SearchableSelect options={partnershipOptions} selected={partnershipId || ''} onChange={setPartnershipId} placeholder={t.selectPartner} searchPlaceholder={t.searchPartners} />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">{t.projects}</label>
                                <SearchableSelect options={projectOptions} selected={projectIds} onChange={setProjectIds} placeholder={t.selectProjects} searchPlaceholder={t.searchProjects} multiple />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">{t.profiles}</label>
                                <SearchableSelect options={profileOptions} selected={profileIds} onChange={setProfileIds} placeholder={t.selectProfiles} searchPlaceholder={t.searchProfiles} multiple />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">{t.pages}</label>
                                <SearchableSelect options={pageOptions} selected={pageIds} onChange={setPageIds} placeholder={t.selectPages} searchPlaceholder={t.searchPages} multiple />
                            </div>
                        </div>
                    </div>


                    <div>
                        <label className="block text-lg font-semibold text-latte-text dark:text-mocha-text mb-2">{t.adAccounts}</label>
                        <div className="space-y-4">
                            {adAccounts.map((acc, index) => (
                                <div key={index} className="p-4 rounded-lg bg-latte-base dark:bg-mocha-base border border-latte-surface1 dark:border-mocha-surface1">
                                    <div className="flex items-start space-x-2">
                                        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">{t.adAccountName}</label>
                                                <input type="text" value={acc.name} onChange={(e) => handleAdAccountChange(index, 'name', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-latte-mantle dark:bg-mocha-mantle border border-latte-surface1 dark:border-mocha-surface1 focus:ring-2 focus:ring-latte-mauve dark:focus:ring-mocha-mauve focus:outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">{t.accountId}</label>
                                                <input type="text" value={acc.accountId} onChange={(e) => handleAdAccountChange(index, 'accountId', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-latte-mantle dark:bg-mocha-mantle border border-latte-surface1 dark:border-mocha-surface1 focus:ring-2 focus:ring-latte-mauve dark:focus:ring-mocha-mauve focus:outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">{t.paymentMethod}</label>
                                                <input type="text" value={acc.paymentMethod} onChange={(e) => handleAdAccountChange(index, 'paymentMethod', capitalizeWords(e.target.value))} className="w-full px-3 py-2 rounded-lg bg-latte-mantle dark:bg-mocha-mantle border border-latte-surface1 dark:border-mocha-surface1 focus:ring-2 focus:ring-latte-mauve dark:focus:ring-mocha-mauve focus:outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">{t.paymentMethodOwner}</label>
                                                <SearchableSelect
                                                    options={partnerOwnerOptions}
                                                    selected={acc.paymentMethodOwner}
                                                    onChange={(value) => handleAdAccountChange(index, 'paymentMethodOwner', value)}
                                                    placeholder={t.selectPartner}
                                                    searchPlaceholder={t.searchPartners}
                                                />
                                            </div>
                                        </div>
                                        <button onClick={() => removeAdAccountField(index)} className="p-2 mt-6 rounded-lg text-latte-red dark:text-mocha-red hover:bg-latte-red/10 dark:hover:bg-mocha-red/10 flex-shrink-0">
                                            <CloseIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button onClick={addAdAccountField} className="mt-3 flex items-center space-x-2 text-sm font-semibold text-latte-mauve dark:text-mocha-mauve hover:opacity-80">
                            <PlusIcon className="w-4 h-4" />
                            <span>{t.addAdAccount}</span>
                        </button>
                    </div>

                    <div>
                        <label className="block text-lg font-semibold text-latte-text dark:text-mocha-text mb-2">{t.apps}</label>
                        <div className="space-y-4">
                            {apps.map((app, index) => (
                                <div key={index} className="p-4 rounded-lg bg-latte-base dark:bg-mocha-base border border-latte-surface1 dark:border-mocha-surface1 space-y-4">
                                    <div className="flex items-start space-x-2">
                                        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">{t.appName}</label>
                                                <input type="text" value={app.name} onChange={(e) => handleAppChange(index, 'name', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-latte-mantle dark:bg-mocha-mantle border border-latte-surface1 dark:border-mocha-surface1 focus:ring-2 focus:ring-latte-mauve dark:focus:ring-mocha-mauve focus:outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">{t.appId}</label>
                                                <input type="text" value={app.appId} onChange={(e) => handleAppChange(index, 'appId', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-latte-mantle dark:bg-mocha-mantle border border-latte-surface1 dark:border-mocha-surface1 focus:ring-2 focus:ring-latte-mauve dark:focus:ring-mocha-mauve focus:outline-none" />
                                            </div>
                                        </div>
                                        <button onClick={() => removeAppField(index)} className="p-2 mt-6 rounded-lg text-latte-red dark:text-mocha-red hover:bg-latte-red/10 dark:hover:bg-mocha-red/10 flex-shrink-0">
                                            <CloseIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">{t.appDomain}</label>
                                        <input type="text" value={app.appDomain} onChange={(e) => handleAppChange(index, 'appDomain', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-latte-mantle dark:bg-mocha-mantle border border-latte-surface1 dark:border-mocha-surface1 focus:ring-2 focus:ring-latte-mauve dark:focus:ring-mocha-mauve focus:outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">{t.permissions}</label>
                                        <SearchableSelect options={permissionOptions} selected={app.permissions} onChange={(value) => handleAppChange(index, 'permissions', value)} placeholder="Select permissions" searchPlaceholder="Search permissions..." multiple />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-1">{t.approvalStep}</label>
                                        <ApprovalStepSlider currentStep={app.approvalStep} onChange={(value) => handleAppChange(index, 'approvalStep', value)} t={t} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button onClick={addAppField} className="mt-3 flex items-center space-x-2 text-sm font-semibold text-latte-mauve dark:text-mocha-mauve hover:opacity-80">
                            <PlusIcon className="w-4 h-4" />
                            <span>{t.addApp}</span>
                        </button>
                    </div>

                </div>
                <div className="mt-8 flex justify-end space-x-4">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-latte-surface1 dark:bg-mocha-surface1 font-semibold hover:bg-latte-surface2 dark:hover:bg-mocha-surface2 transition-colors">{t.cancel}</button>
                    <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-latte-mauve text-white dark:bg-mocha-mauve dark:text-mocha-crust font-semibold hover:opacity-90 transition-opacity disabled:opacity-50" disabled={!name.trim() || !bmId.trim() || !country}>{t.save}</button>
                </div>
            </div>
        </div>
    );
};
