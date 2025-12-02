import React, { useState } from 'react';
import { supabaseUrl, supabaseKey } from '../../supabaseClient';
import { CheckIcon, CodeIcon } from '../icons';

interface ApiDocsViewProps {
    t: any;
}

export const ApiDocsView: React.FC<ApiDocsViewProps> = ({ t }) => {
    const [copied, setCopied] = useState(false);

    const endpoints = [
        { name: 'Projects', path: '/rest/v1/projects' },
        { name: 'Domains', path: '/rest/v1/domains' },
        { name: 'Profiles', path: '/rest/v1/profiles' },
        { name: 'Pages', path: '/rest/v1/pages' },
        { name: 'BMs & Apps', path: '/rest/v1/bms' },
        { name: 'Partnerships', path: '/rest/v1/partnerships' },
        { name: 'Integrations', path: '/rest/v1/integrations' },
        { name: 'History', path: '/rest/v1/history' },
        { name: 'Users', path: '/rest/v1/users' },
    ];

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-5xl mx-auto pb-10">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-latte-text dark:text-mocha-text flex items-center gap-3">
                    <CodeIcon className="w-8 h-8" />
                    {t.apiAccess || 'API Access'}
                </h1>
            </div>

            <div className="bg-latte-base dark:bg-mocha-base border-l-4 border-latte-mauve dark:border-mocha-mauve p-4 mb-8 rounded-r-lg shadow-sm">
                <p className="text-latte-text dark:text-mocha-text">
                    Your data is automatically exposed via a secure REST API. You can use these endpoints to retrieve the 
                    <strong> current state</strong> of any object or filter the <strong>history</strong> from external programs.
                </p>
            </div>

            {/* Credentials Section */}
            <div className="bg-latte-crust dark:bg-mocha-crust p-6 rounded-xl shadow-md border border-latte-surface0 dark:border-mocha-surface0 mb-8">
                <h2 className="text-xl font-bold text-latte-text dark:text-mocha-text mb-4 border-b border-latte-surface1 dark:border-mocha-surface1 pb-2">
                    Connection Credentials
                </h2>
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-2">API URL</label>
                        <div className="flex items-center gap-2">
                            <code className="flex-grow p-3 bg-latte-base dark:bg-mocha-base rounded-lg border border-latte-surface1 dark:border-mocha-surface1 font-mono text-sm text-latte-text dark:text-mocha-text">
                                {supabaseUrl}
                            </code>
                            <button 
                                onClick={() => copyToClipboard(supabaseUrl)}
                                className="px-4 py-2 bg-latte-surface2 dark:bg-mocha-surface2 text-latte-text dark:text-mocha-text rounded-lg hover:bg-latte-surface1 dark:hover:bg-mocha-surface1 transition-colors font-medium text-sm"
                            >
                                {copied ? <CheckIcon className="w-5 h-5 text-latte-green dark:text-mocha-green" /> : 'Copy'}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-latte-subtext1 dark:text-mocha-subtext1 mb-2">
                            API Key (Public Anon) 
                            <span className="ml-2 text-xs font-normal text-latte-subtext0 dark:text-mocha-subtext0 italic">
                                *For server-side scripts requiring full access, use the Service Role Key from your Supabase Dashboard.
                            </span>
                        </label>
                        <div className="flex items-center gap-2">
                            <code className="flex-grow p-3 bg-latte-base dark:bg-mocha-base rounded-lg border border-latte-surface1 dark:border-mocha-surface1 font-mono text-sm text-latte-text dark:text-mocha-text break-all">
                                {supabaseKey}
                            </code>
                            <button 
                                onClick={() => copyToClipboard(supabaseKey)}
                                className="px-4 py-2 bg-latte-surface2 dark:bg-mocha-surface2 text-latte-text dark:text-mocha-text rounded-lg hover:bg-latte-surface1 dark:hover:bg-mocha-surface1 transition-colors font-medium text-sm"
                            >
                                {copied ? <CheckIcon className="w-5 h-5 text-latte-green dark:text-mocha-green" /> : 'Copy'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Endpoints List */}
            <div className="bg-latte-crust dark:bg-mocha-crust p-6 rounded-xl shadow-md border border-latte-surface0 dark:border-mocha-surface0 mb-8">
                <h2 className="text-xl font-bold text-latte-text dark:text-mocha-text mb-4 border-b border-latte-surface1 dark:border-mocha-surface1 pb-2">
                    Available Endpoints
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {endpoints.map((ep) => (
                        <div key={ep.name} className="flex justify-between items-center p-3 bg-latte-base dark:bg-mocha-base rounded-lg border border-latte-surface1 dark:border-mocha-surface1">
                            <span className="font-semibold text-latte-text dark:text-mocha-text">{ep.name}</span>
                            <code className="text-sm text-latte-mauve dark:text-mocha-mauve">{ep.path}</code>
                        </div>
                    ))}
                </div>
            </div>

            {/* History Filter Example */}
            <div className="bg-latte-crust dark:bg-mocha-crust p-6 rounded-xl shadow-md border border-latte-surface0 dark:border-mocha-surface0 mb-8">
                <h2 className="text-xl font-bold text-latte-text dark:text-mocha-text mb-4 border-b border-latte-surface1 dark:border-mocha-surface1 pb-2">
                    Filtering History by Date
                </h2>
                <p className="text-sm text-latte-subtext1 dark:text-mocha-subtext1 mb-4">
                    To retrieve history logs created after a specific date, append the <code>timestamp=gte.YYYY-MM-DD</code> query parameter to the history endpoint.
                </p>
                <div className="bg-latte-base dark:bg-mocha-base p-4 rounded-lg border border-latte-surface1 dark:border-mocha-surface1 overflow-x-auto">
                    <code className="text-sm font-mono text-latte-blue dark:text-mocha-blue whitespace-pre">
{`GET ${supabaseUrl}/rest/v1/history?select=*&timestamp=gte.2024-01-01T00:00:00Z&apikey=${supabaseKey}`}
                    </code>
                </div>
            </div>

            {/* Code Examples */}
            <div className="bg-latte-crust dark:bg-mocha-crust p-6 rounded-xl shadow-md border border-latte-surface0 dark:border-mocha-surface0">
                <h2 className="text-xl font-bold text-latte-text dark:text-mocha-text mb-4 border-b border-latte-surface1 dark:border-mocha-surface1 pb-2">
                    Code Examples
                </h2>

                <div className="mb-6">
                    <h3 className="text-sm font-bold text-latte-subtext1 dark:text-mocha-subtext1 mb-2 uppercase">cURL (Command Line)</h3>
                    <div className="bg-latte-base dark:bg-mocha-base p-4 rounded-lg border border-latte-surface1 dark:border-mocha-surface1 overflow-x-auto">
                        <code className="text-sm font-mono text-latte-text dark:text-mocha-text whitespace-pre">
{`curl '${supabaseUrl}/rest/v1/projects?select=*' \\
-H "apikey: ${supabaseKey}" \\
-H "Authorization: Bearer ${supabaseKey}"`}
                        </code>
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-bold text-latte-subtext1 dark:text-mocha-subtext1 mb-2 uppercase">JavaScript (Fetch)</h3>
                    <div className="bg-latte-base dark:bg-mocha-base p-4 rounded-lg border border-latte-surface1 dark:border-mocha-surface1 overflow-x-auto">
                        <code className="text-sm font-mono text-latte-text dark:text-mocha-text whitespace-pre">
{`const SUPABASE_URL = '${supabaseUrl}';
const API_KEY = '${supabaseKey}';

async function fetchProjects() {
  const response = await fetch(\`\${SUPABASE_URL}/rest/v1/projects?select=*\`, {
    headers: {
      apikey: API_KEY,
      Authorization: \`Bearer \${API_KEY}\`
    }
  });
  const data = await response.json();
  console.log(data);
}

async function fetchHistorySince(date) {
  // Example date: '2024-01-01T00:00:00Z'
  const response = await fetch(\`\${SUPABASE_URL}/rest/v1/history?select=*&timestamp=gte.\${date}\`, {
    headers: {
      apikey: API_KEY,
      Authorization: \`Bearer \${API_KEY}\`
    }
  });
  const data = await response.json();
  console.log(data);
}

fetchProjects();`}
                        </code>
                    </div>
                </div>
            </div>
        </div>
    );
};