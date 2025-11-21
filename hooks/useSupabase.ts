
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

// Helper to recursively parse date strings in objects
const parseDates = (obj: any): any => {
    if (obj === null || obj === undefined) return obj;
    
    if (typeof obj === 'string') {
        // Simple ISO date check (YYYY-MM-DDTHH:mm:ss.sssZ)
        if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(obj)) {
            const d = new Date(obj);
            if (!isNaN(d.getTime())) return d;
        }
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(parseDates);
    }

    if (typeof obj === 'object') {
        const newObj: any = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                newObj[key] = parseDates(obj[key]);
            }
        }
        return newObj;
    }

    return obj;
};

export function useSupabase<T>(tableName: string) {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                const { data: fetchedData, error: fetchError } = await supabase
                    .from(tableName)
                    .select('*');

                if (fetchError) throw fetchError;

                if (isMounted) {
                    // Parse dates before setting state because Supabase returns JSON strings
                    setData(parseDates(fetchedData) as T[]);
                    setLoading(false);
                }
            } catch (err: any) {
                if (isMounted) {
                    console.error(`Error fetching ${tableName}:`, err);
                    setError(err.message);
                    setLoading(false);
                }
            }
        };

        fetchData();

        // Subscribe to realtime changes
        const subscription = supabase
            .channel(`public:${tableName}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: tableName }, () => {
                // Simple strategy: refetch all on any change. 
                // For larger datasets, you'd handle INSERT/UPDATE/DELETE payloads individually.
                fetchData();
            })
            .subscribe();

        return () => {
            isMounted = false;
            supabase.removeChannel(subscription);
        };
    }, [tableName]);

    return data; // Return just data to match useLiveQuery signature mostly
}
