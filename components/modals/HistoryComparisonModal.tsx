
import React, { useMemo } from 'react';
import { HistoryEntry } from '../../types';
import { CloseIcon, HistoryIcon, ChevronsRightIcon } from '../icons';

interface HistoryComparisonModalProps {
    isOpen: boolean;
    onClose: () => void;
    historyEntry: HistoryEntry | null;
    t: any;
    onViewFullHistory?: () => void;
    renderEntry?: (data: any, type: 'old' | 'new', changedFields: string[]) => React.ReactNode;
}

export const HistoryComparisonModal: React.FC<HistoryComparisonModalProps> = ({ isOpen, onClose, historyEntry, t, onViewFullHistory, renderEntry }) => {
    if (!isOpen || !historyEntry) return null;

    const { oldData, newData } = historyEntry;

    // Helper to format values for display in the generic view
    const formatValue = (val: any): string => {
        if (val === null || val === undefined) return '—';
        if (Array.isArray(val)) {
            return `[ ${val.length} items ]`;
        }
        if (typeof val === 'object') return '{ Object }';
        return String(val);
    };

    // Calculate diffs for generic display and to identify keys
    const diffInfo = useMemo(() => {
        const keys = new Set([...Object.keys(oldData || {}), ...Object.keys(newData || {})]);
        const rows: { key: string, oldVal: any, newVal: any, status: 'changed' | 'same' | 'added' | 'removed' }[] = [];
        const changedFields: string[] = [];

        // Ignored keys for comparison logic
        const ignored = ['id', 'updatedAt', 'createdAt', 'updated_at', 'created_at', 'userId', 'localId'];

        keys.forEach(key => {
            if (ignored.includes(key)) return;
            
            const o = oldData ? oldData[key] : undefined;
            const n = newData ? newData[key] : undefined;
            
            // Simple comparison
            const sO = JSON.stringify(o);
            const sN = JSON.stringify(n);

            if (sO !== sN) {
                let status: 'changed' | 'added' | 'removed' = 'changed';
                if (oldData && !newData) status = 'removed';
                else if (!oldData && newData) status = 'added';
                
                rows.push({ key, oldVal: o, newVal: n, status });
                changedFields.push(key);
            }
        });
        
        return { rows, changedFields };
    }, [oldData, newData]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
            <div className={`bg-latte-mantle dark:bg-mocha-mantle rounded-xl shadow-2xl p-6 flex flex-col max-h-[95vh] ${renderEntry ? 'w-full max-w-7xl' : 'w-full max-w-4xl'}`} onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6 border-b border-latte-surface1 dark:border-mocha-surface1 pb-4">
                    <div>
                        <h2 className="text-xl font-bold text-latte-text dark:text-mocha-text flex items-center gap-2">
                            <HistoryIcon className="w-6 h-6" />
                            {t.history} Comparison
                        </h2>
                        <p className="text-sm text-latte-subtext1 dark:text-mocha-subtext1 mt-1">
                            {new Date(historyEntry.timestamp).toLocaleString()} • {historyEntry.userName || 'Unknown User'} • <span className="font-semibold uppercase tracking-wide bg-latte-surface2 dark:bg-mocha-surface2 px-2 py-0.5 rounded text-xs ml-2">{historyEntry.action}</span>
                        </p>
                    </div>
                    <button onClick={onClose} className="text-latte-subtext0 dark:text-mocha-subtext0 hover:text-latte-text dark:hover:text-mocha-text bg-latte-surface0 dark:bg-mocha-surface0 p-2 rounded-full hover:bg-latte-surface1 dark:hover:bg-mocha-surface1 transition-colors">
                        <CloseIcon className="w-5 h-5" />
                    </button>
                </div>

                {diffInfo.changedFields.length > 0 && (
                    <div className="mb-4 px-4 py-2 bg-latte-yellow/10 dark:bg-mocha-yellow/10 text-latte-yellow dark:text-mocha-yellow rounded-lg text-sm text-center font-medium border border-latte-yellow/20 dark:border-mocha-yellow/20">
                        {diffInfo.changedFields.length} field(s) changed: {diffInfo.changedFields.join(', ')}
                    </div>
                )}

                <div className="flex-grow overflow-y-auto px-1">
                    {renderEntry ? (
                        /* Custom Block Comparison View */
                        <div className="flex flex-col md:flex-row gap-6 h-full items-stretch">
                            {/* Before Block */}
                            <div className="flex-1 flex flex-col min-w-0">
                                <div className="mb-2 text-center font-bold text-latte-red dark:text-mocha-red uppercase tracking-wider text-sm">
                                    Before
                                </div>
                                <div className="flex-grow">
                                    {oldData ? renderEntry(oldData, 'old', diffInfo.changedFields) : (
                                        <div className="h-full flex items-center justify-center bg-latte-base dark:bg-mocha-base rounded-xl border border-dashed border-latte-surface2 dark:border-mocha-surface2 p-8 text-latte-subtext0 dark:text-mocha-subtext0 italic">
                                            Does not exist (Created)
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Arrow Indicator */}
                            <div className="hidden md:flex items-center justify-center text-latte-subtext0 dark:text-mocha-subtext0">
                                <ChevronsRightIcon className="w-8 h-8" />
                            </div>

                            {/* After Block */}
                            <div className="flex-1 flex flex-col min-w-0">
                                <div className="mb-2 text-center font-bold text-latte-green dark:text-mocha-green uppercase tracking-wider text-sm">
                                    After
                                </div>
                                <div className="flex-grow">
                                    {newData ? renderEntry(newData, 'new', diffInfo.changedFields) : (
                                        <div className="h-full flex items-center justify-center bg-latte-base dark:bg-mocha-base rounded-xl border border-dashed border-latte-surface2 dark:border-mocha-surface2 p-8 text-latte-subtext0 dark:text-mocha-subtext0 italic">
                                            Does not exist (Deleted)
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Default Table Comparison View */
                        diffInfo.rows.length === 0 ? (
                            <div className="text-center py-10 text-latte-subtext0 dark:text-mocha-subtext0">
                                No specific changes detected in logged fields.
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 gap-4 font-mono text-sm">
                                <div className="font-bold text-latte-subtext1 dark:text-mocha-subtext1 uppercase text-xs tracking-wider border-b border-latte-surface1 dark:border-mocha-surface1 pb-2">Field</div>
                                <div className="font-bold text-latte-subtext1 dark:text-mocha-subtext1 uppercase text-xs tracking-wider border-b border-latte-surface1 dark:border-mocha-surface1 pb-2">Before</div>
                                <div className="font-bold text-latte-subtext1 dark:text-mocha-subtext1 uppercase text-xs tracking-wider border-b border-latte-surface1 dark:border-mocha-surface1 pb-2">After</div>

                                {diffInfo.rows.map((row, idx) => (
                                    <React.Fragment key={idx}>
                                        <div className="py-3 text-latte-text dark:text-mocha-text font-semibold border-b border-latte-surface0 dark:border-mocha-surface0">
                                            {row.key}
                                        </div>
                                        <div className={`py-3 px-2 border-b border-latte-surface0 dark:border-mocha-surface0 break-words ${row.status === 'changed' || row.status === 'removed' ? 'bg-latte-red/10 text-latte-red dark:bg-mocha-red/10 dark:text-mocha-red' : ''}`}>
                                            {formatValue(row.oldVal)}
                                        </div>
                                        <div className={`py-3 px-2 border-b border-latte-surface0 dark:border-mocha-surface0 break-words ${row.status === 'changed' || row.status === 'added' ? 'bg-latte-green/10 text-latte-green dark:bg-mocha-green/10 dark:text-mocha-green' : ''}`}>
                                            {formatValue(row.newVal)}
                                        </div>
                                    </React.Fragment>
                                ))}
                            </div>
                        )
                    )}
                </div>

                <div className="mt-6 flex justify-end space-x-4 pt-4 border-t border-latte-surface1 dark:border-mocha-surface1">
                    {onViewFullHistory && (
                        <button 
                            onClick={() => { onClose(); onViewFullHistory(); }}
                            className="px-4 py-2 bg-latte-surface2 dark:bg-mocha-surface2 text-latte-text dark:text-mocha-text rounded-lg hover:bg-latte-surface1 dark:hover:bg-mocha-surface1 font-medium text-sm transition-colors"
                        >
                            See Full History
                        </button>
                    )}
                    <button onClick={onClose} className="px-6 py-2 bg-latte-mauve text-white dark:bg-mocha-mauve dark:text-mocha-crust rounded-lg font-semibold hover:opacity-90 transition-opacity">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
