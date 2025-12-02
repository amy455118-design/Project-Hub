
import React from 'react';
import { Project, ProjectStatus } from '../../types';
import { GlobeIcon, DomainIcon, UsersIcon, ProfileIcon, PageIcon, EditIcon, HistoryIcon } from '../icons';

interface ProjectCardProps {
    project: Project;
    t: any;
    lookups: {
        getCountryName: (code: string) => string;
        getLanguageName: (code: string) => string;
        getProjectTargets: (p: Project) => string;
        getBmName: (id?: string) => string;
        getAdAccountName: (bmId?: string, adId?: string) => string;
        getChatbotName: (id?: string) => string;
    };
    variant?: 'interactive' | 'static';
    changedFields?: string[];
    onEdit?: (p: Project) => void;
    onStatusToggle?: (p: Project) => void;
    onHistoryClick?: (p: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ 
    project, 
    t, 
    lookups, 
    variant = 'interactive', 
    changedFields = [], 
    onEdit, 
    onStatusToggle, 
    onHistoryClick 
}) => {
    
    const getStatusColor = (status: ProjectStatus) => {
        switch (status) {
            case 'Active': return 'bg-latte-green/20 text-latte-green dark:bg-mocha-green/20 dark:text-mocha-green hover:bg-latte-green/30 dark:hover:bg-mocha-green/30';
            case 'In Progress': return 'bg-latte-blue/20 text-latte-blue dark:bg-mocha-blue/20 dark:text-mocha-blue hover:bg-latte-blue/30 dark:hover:bg-mocha-blue/30';
            case 'Paused': return 'bg-latte-peach/20 text-latte-peach dark:bg-mocha-peach/20 dark:text-mocha-peach hover:bg-latte-peach/30 dark:hover:bg-mocha-peach/30';
            case 'Pending': return 'bg-latte-yellow/20 text-latte-yellow dark:bg-mocha-yellow/20 dark:text-mocha-yellow hover:bg-latte-yellow/30 dark:hover:bg-mocha-yellow/30';
            case 'Deactivated': return 'bg-latte-red/20 text-latte-red dark:bg-mocha-red/20 dark:text-mocha-red hover:bg-latte-red/30 dark:hover:bg-mocha-red/30';
            case 'Broad': return 'bg-latte-mauve/20 text-latte-mauve dark:bg-mocha-mauve/20 dark:text-mocha-mauve hover:bg-latte-mauve/30 dark:hover:bg-mocha-mauve/30';
            default: return 'bg-latte-surface1 dark:bg-mocha-surface1';
        }
    };

    // Helper to determine if a field is changed
    const isChanged = (field: string) => changedFields.includes(field);
    const highlightClass = "bg-latte-yellow/30 dark:bg-mocha-yellow/30 rounded px-1 -mx-1 transition-colors duration-500";

    return (
        <div className="bg-latte-crust dark:bg-mocha-crust border border-latte-surface1 dark:border-mocha-surface1 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative group flex flex-col h-full">
            <div className="flex justify-between items-start mb-3">
                <div className="flex-1 mr-2">
                    <h3 className={`text-lg font-bold text-latte-text dark:text-mocha-text line-clamp-1 ${isChanged('name') ? highlightClass : ''}`} title={project.name}>{project.name}</h3>
                    <p 
                        className={`text-xs text-latte-subtext0 dark:text-mocha-subtext0 transition-colors flex items-center gap-1 ${variant === 'interactive' ? 'cursor-pointer hover:text-latte-blue dark:hover:text-mocha-blue hover:underline decoration-dashed underline-offset-2' : ''}`}
                        onClick={(e) => { 
                            if (variant === 'interactive' && onHistoryClick) {
                                e.stopPropagation(); 
                                onHistoryClick(project);
                            }
                        }}
                        title={variant === 'interactive' ? "Click to see changes" : ""}
                    >
                       <HistoryIcon className="w-3 h-3" /> Modified: {new Date(project.updatedAt).toLocaleDateString()}
                    </p>
                </div>
                <div className="flex space-x-2 flex-shrink-0">
                     <button 
                        onClick={(e) => {
                            if (variant === 'interactive' && onStatusToggle) {
                                e.stopPropagation(); 
                                onStatusToggle(project);
                            }
                        }} 
                        disabled={variant !== 'interactive'}
                        className={`px-2 py-1 text-[10px] font-bold rounded-full transition-colors uppercase tracking-wider ${getStatusColor(project.status)} ${isChanged('status') ? 'ring-2 ring-latte-yellow dark:ring-mocha-yellow' : ''}`}
                    >
                        {t[`status${project.status.replace(/\s/g, '')}`] || project.status}
                    </button>
                    {variant === 'interactive' && onEdit && (
                        <button onClick={(e) => { e.stopPropagation(); onEdit(project)}} className="text-latte-subtext0 dark:text-mocha-subtext0 hover:text-latte-blue dark:hover:text-mocha-blue transition-colors">
                            <EditIcon className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-1 space-y-3 text-sm text-latte-subtext1 dark:text-mocha-subtext1">
                <div className={`flex items-center space-x-2 ${isChanged('countries') || isChanged('language') ? highlightClass : ''}`}>
                    <GlobeIcon className="w-4 h-4 flex-shrink-0 text-latte-mauve dark:text-mocha-mauve" />
                    <span className="truncate" title={`${project.countries.map(lookups.getCountryName).join(', ')} - ${lookups.getLanguageName(project.language)}`}>
                        {project.countries.length > 0 ? project.countries.map(lookups.getCountryName).join(', ') : 'No Country'} • {lookups.getLanguageName(project.language) || 'No Lang'}
                    </span>
                </div>

                <div className={`flex items-center space-x-2 ${isChanged('domainIds') || isChanged('subdomainIds') ? highlightClass : ''}`}>
                    <DomainIcon className="w-4 h-4 flex-shrink-0 text-latte-blue dark:text-mocha-blue" />
                    <span className="truncate" title={lookups.getProjectTargets(project)}>
                        {lookups.getProjectTargets(project) || 'No Domain'}
                    </span>
                </div>

                <div className="flex justify-between items-center">
                    <div className={`flex items-center space-x-2 ${isChanged('category') ? highlightClass : ''}`}>
                        <span className="bg-latte-surface2/50 dark:bg-mocha-surface2/50 px-2 py-0.5 rounded text-xs truncate max-w-full">
                            {project.category || 'Uncategorized'}
                        </span>
                    </div>
                    <div className={`flex items-center space-x-2 ${isChanged('analyst') ? highlightClass : ''}`}>
                        <UsersIcon className="w-3.5 h-3.5 flex-shrink-0 text-latte-peach dark:text-mocha-peach" />
                        <span className="truncate text-xs">{project.analyst || 'No Analyst'}</span>
                    </div>
                </div>

                <div className="border-t border-latte-surface1 dark:border-mocha-surface1"></div>

                <div className="flex justify-between items-center text-xs">
                    <div className={`flex items-center space-x-1 ${isChanged('profileIds') ? highlightClass : ''}`} title="Profiles">
                        <ProfileIcon className="w-3.5 h-3.5 text-latte-teal dark:text-mocha-teal" />
                        <span>{project.profileIds?.length || 0} profiles</span>
                    </div>
                    <div className={`flex items-center space-x-1 ${isChanged('pageIds') ? highlightClass : ''}`} title="Pages">
                        <PageIcon className="w-3.5 h-3.5 text-latte-sky dark:text-mocha-sky" />
                        <span>{project.pageIds?.length || 0} pages</span>
                    </div>
                </div>

                <div className="border-t border-latte-surface1 dark:border-mocha-surface1"></div>

                <div className="space-y-1.5 text-xs">
                    <div className={`flex items-center justify-between ${isChanged('bmId') ? highlightClass : ''}`}>
                        <span className="text-latte-subtext0 dark:text-mocha-subtext0">BM:</span>
                        <span className="font-medium truncate ml-2 max-w-[150px]" title={lookups.getBmName(project.bmId)}>{lookups.getBmName(project.bmId)}</span>
                    </div>
                    <div className={`flex items-center justify-between ${isChanged('adAccountId') ? highlightClass : ''}`}>
                        <span className="text-latte-subtext0 dark:text-mocha-subtext0">Ad Account:</span>
                        <span className="font-medium truncate ml-2 max-w-[150px]" title={lookups.getAdAccountName(project.bmId, project.adAccountId)}>{lookups.getAdAccountName(project.bmId, project.adAccountId)}</span>
                    </div>
                    <div className={`flex items-center justify-between ${isChanged('chatbotId') ? highlightClass : ''}`}>
                        <span className="text-latte-subtext0 dark:text-mocha-subtext0">Chatbot:</span>
                        <span className="font-medium truncate ml-2 max-w-[150px]" title={lookups.getChatbotName(project.chatbotId)}>{lookups.getChatbotName(project.chatbotId)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
