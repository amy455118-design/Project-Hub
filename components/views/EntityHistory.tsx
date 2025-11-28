
import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { HistoryEntry } from '../../types';
import { HistoryIcon } from '../icons';

interface EntityHistoryProps {
    t: any;
    entityTypes: HistoryEntry['entityType'][];
}

export const EntityHistory: React.FC<EntityHistoryProps> = ({ t, entityTypes }) => {
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            // Supabase .in() filter
            const { data, error } = await supabase
                .from('history')
                .select('*')
                .in('entityType', entityTypes)
                .order('timestamp', { ascending: false });

            if (!error && data) {
                // Convert timestamp strings to Date objects
                const parsedData = data.map(d => ({
                    ...d,
                    timestamp: new Date(d.timestamp)
                }));
                setHistory(parsedData);
            }
            setLoading(false);
        };

        fetchHistory();

        // Subscribe to realtime updates for history table
        const subscription = supabase
            .channel(`public:history:${entityTypes.join('_')}`)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'history' }, (payload) => {
                const newEntry = payload.new as HistoryEntry;
                if (entityTypes.includes(newEntry.entityType)) {
                    setHistory(prev => [{ ...newEntry, timestamp: new Date(newEntry.timestamp) }, ...prev]);
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, [entityTypes]);

    const getActionColor = (action: HistoryEntry['action']) => {
        switch (action) {
            case 'Create': return 'bg-latte-green/20 text-latte-green dark:bg-mocha-green/20 dark:text-mocha-green';
            case 'Update': return 'bg-latte-blue/20 text-latte-blue dark:bg-mocha-blue/20 dark:text-mocha-blue';
            case 'Delete': return 'bg-latte-red/20 text-latte-red dark:bg-mocha-red/20 dark:text-mocha-red';
            case 'Activate': return 'bg-latte-sapphire/20 text-latte-sapphire dark:bg-mocha-sapphire/20 dark:text-mocha-sapphire';
            case 'Deactivate': return 'bg-latte-peach/20 text-latte-peach dark:bg-mocha-peach/20 dark:text-mocha-peach';
            default: return 'bg-latte-surface1 dark:bg-mocha-surface1';
        }
    };

    if (loading) {
        return <div className="p-4 text-center text-latte-subtext0 dark:text-mocha-subtext0">Loading history...</div>;
    }

    return (
        <div className="bg-latte-crust dark:bg-mocha-crust p-4 rounded-xl shadow-md">
            {history.length === 0 ? (
                <div className="text-center py-12">
                    <HistoryIcon className="w-16 h-16 mx-auto text-latte-overlay1 dark:text-mocha-overlay1 mb-4" />
                    <p className="text-lg text-latte-subtext0 dark:text-mocha-subtext0">{t.noHistory}</p>
                </div>
            ) : (
                <table className="w-full text-left">
                    <thead className="border-b-2 border-latte-surface1 dark:border-mocha-surface1">
                        <tr>
                            <th className="p-4 text-sm font-semibold uppercase text-latte-subtext1 dark:text-mocha-subtext1">{t.date}</th>
                            <th className="p-4 text-sm font-semibold uppercase text-latte-subtext1 dark:text-mocha-subtext1">User</th>
                            <th className="p-4 text-sm font-semibold uppercase text-latte-subtext1 dark:text-mocha-subtext1">{t.entity}</th>
                            <th className="p-4 text-sm font-semibold uppercase text-latte-subtext1 dark:text-mocha-subtext1">{t.action}</th>
                            <th className="p-4 text-sm font-semibold uppercase text-latte-subtext1 dark:text-mocha-subtext1">{t.details}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map((entry) => (
                            <tr key={entry.id} className="border-b border-latte-surface0 dark:border-mocha-surface0 last:border-b-0">
                                <td className="p-4 text-sm text-latte-subtext0 dark:text-mocha-subtext0 whitespace-nowrap">
                                    {new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(entry.timestamp)}
                                </td>
                                <td className="p-4 text-sm font-medium text-latte-text dark:text-mocha-text whitespace-nowrap">
                                    {entry.userName || '-'}
                                </td>
                                <td className="p-4 font-medium text-latte-text dark:text-mocha-text">
                                    <span className="font-semibold">{t[`entity${entry.entityType}` as keyof typeof t] || entry.entityType}</span>: {entry.entityName}
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${getActionColor(entry.action)}`}>
                                        {t[`action${entry.action}` as keyof typeof t]}
                                    </span>
                                </td>
                                <td className="p-4 text-sm text-latte-subtext0 dark:text-mocha-subtext0">{entry.details || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};