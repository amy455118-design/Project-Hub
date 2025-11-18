

import React, { useState, useMemo } from 'react';
import { Project, ProjectStatus, Analyst, Domain, BM, Partnership, Profile, Page } from '../../types';
import { PlusIcon, ProjectIcon, EditIcon, ChevronDownIcon } from '../icons';
import { AddProjectModal } from '../modals/AddProjectModal';

interface ProjectsViewProps {
    t: any;
    projects: Project[];
    onSaveProject: (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => void;
    getCountryName: (code: string) => string;
    getLanguageName: (code: string) => string;
    countryOptions: { value: string; label: string }[];
    languageOptions: { value: string; label: string }[];
    domains: Domain[];
    bms: BM[];
    partnerships: Partnership[];
    profiles: Profile[];
    pages: Page[];
}

const projectStatusOptions: { value: ProjectStatus, label: string }[] = [
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Active', label: 'Active' },
    { value: 'Deactivated', label: 'Deactivated' },
    { value: 'Paused', label: 'Paused' },
    { value: 'Broad', label: 'Broad' }
];

const analystOptions: { value: Analyst, label: string }[] = [
    { value: 'Daniel', label: 'Daniel' },
    { value: 'Carlos', label: 'Carlos' },
    { value: 'Tiago', label: 'Tiago' }
];

export const ProjectsView: React.FC<ProjectsViewProps> = (props) => {
    const { t, projects, onSaveProject, getCountryName, getLanguageName, countryOptions, languageOptions, domains, bms, partnerships, profiles, pages } = props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [expandedProjectIds, setExpandedProjectIds] = useState<string[]>([]);

    const allApps = useMemo(() => bms.flatMap(bm => bm.apps), [bms]);

    const projectsByStatus = useMemo(() => {
        return projects.reduce((acc, project) => {
            const status = project.status;
            if (!acc[status]) {
                acc[status] = [];
            }
            acc[status].push(project);
            return acc;
        }, {} as Record<ProjectStatus, Project[]>);
    }, [projects]);

    const handleSave = (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => {
        onSaveProject(projectData);
        setIsModalOpen(false);
        setEditingProject(null);
    };

    const handleAddClick = () => {
        setEditingProject(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (project: Project) => {
        setEditingProject(project);
        setIsModalOpen(true);
    };
    
    const handleToggleExpand = (projectId: string) => {
        setExpandedProjectIds(prev =>
            prev.includes(projectId)
                ? prev.filter(id => id !== projectId)
                : [...prev, projectId]
        );
    };

    const getNextStatus = (current: ProjectStatus): ProjectStatus => {
        switch (current) {
            case 'In Progress': return 'Active';
            case 'Pending': return 'Active';
            case 'Active': return 'Paused';
            case 'Paused': return 'Broad';
            case 'Broad': return 'Deactivated';
            case 'Deactivated': return 'Active';
            default: return 'Pending';
        }
    }

    const handleStatusToggle = (project: Project) => {
        const nextStatus = getNextStatus(project.status);
        onSaveProject({ ...project, status: nextStatus });
    };

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
    
    const getProjectTargets = (project: Project) => {
        const targets: string[] = [];
        project.domainIds?.forEach(id => {
            const domain = domains.find(d => d.id === id);
            if (domain) targets.push(domain.name);
        });
        project.subdomainIds?.forEach(id => {
            for (const domain of domains) {
                const sub = domain.subdomains.find(s => s.id === id);
                if (sub) {
                    const label = sub.name.includes('.') ? sub.name : `${sub.name}.${domain.name}`;
                    targets.push(label);
                    break;
                }
            }
        });
        return targets.join(', ');
    };

    const renderProjectTable = (projectList: Project[]) => (
         <table className="w-full text-left">
            <thead className="border-b-2 border-latte-surface1 dark:border-mocha-surface1">
                <tr>
                    <th className="p-4 w-10"></th>
                    <th className="p-4 text-sm font-semibold uppercase text-latte-subtext1 dark:text-mocha-subtext1">{t.projectName}</th>
                    <th className="p-4 text-sm font-semibold uppercase text-latte-subtext1 dark:text-mocha-subtext1">{t.domains}</th>
                    <th className="p-4 text-sm font-semibold uppercase text-latte-subtext1 dark:text-mocha-subtext1">{t.category}</th>
                    <th className="p-4 text-sm font-semibold uppercase text-latte-subtext1 dark:text-mocha-subtext1">{t.analyst}</th>
                    <th className="p-4 text-sm font-semibold uppercase text-latte-subtext1 dark:text-mocha-subtext1 text-right">{t.actions}</th>
                </tr>
            </thead>
            <tbody>
                {projectList.map((project) => (
                    <React.Fragment key={project.id}>
                        <tr onClick={() => handleToggleExpand(project.id)} className="border-b border-latte-surface0 dark:border-mocha-surface0 last:border-b-0 cursor-pointer hover:bg-latte-surface0 dark:hover:bg-mocha-surface0">
                            <td className="p-4 text-center">
                                <ChevronDownIcon className={`w-5 h-5 transition-transform ${expandedProjectIds.includes(project.id) ? 'rotate-180' : ''}`} />
                            </td>
                            <td className="p-4 font-medium text-latte-text dark:text-mocha-text">{project.name}</td>
                            <td className="p-4 text-latte-subtext0 dark:text-mocha-subtext0 text-xs">{getProjectTargets(project) || '-'}</td>
                            <td className="p-4 text-latte-subtext0 dark:text-mocha-subtext0">{project.category || '-'}</td>
                            <td className="p-4 text-latte-subtext0 dark:text-mocha-subtext0">{project.analyst || '-'}</td>
                            <td className="p-4 text-right">
                                <div className="flex items-center justify-end space-x-2">
                                     <button onClick={(e) => {e.stopPropagation(); handleStatusToggle(project)}} className={`px-3 py-1.5 text-xs font-bold rounded-full transition-colors ${getStatusColor(project.status)}`}>
                                        {t[`status${project.status.replace(/\s/g, '')}`] || project.status}
                                    </button>
                                     <button onClick={(e) => { e.stopPropagation(); handleEditClick(project)}} className="p-2 rounded-md hover:bg-latte-surface1 dark:hover:bg-mocha-surface1 text-latte-blue dark:text-mocha-blue" aria-label={`Edit ${project.name}`}><EditIcon className="w-5 h-5" /></button>
                                </div>
                            </td>
                        </tr>
                         {expandedProjectIds.includes(project.id) && (
                            <tr className="bg-latte-base dark:bg-mocha-base">
                                <td colSpan={6} className="p-4">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        <div>
                                            <p className="font-semibold text-latte-subtext1 dark:text-mocha-subtext1">Profiles</p>
                                            <p>{project.profileIds?.map(id => profiles.find(p => p.id === id)?.name).join(', ') || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-latte-subtext1 dark:text-mocha-subtext1">Pages</p>
                                            <p>{project.pageIds?.length || 0}</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-latte-subtext1 dark:text-mocha-subtext1">Chatbot</p>
                                            <p>{allApps.find(a => a.id === project.chatbotId)?.name || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-latte-subtext1 dark:text-mocha-subtext1">Countries</p>
                                            <p>{project.countries.map(getCountryName).join(', ')}</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-latte-subtext1 dark:text-mocha-subtext1">Language</p>
                                            <p>{getLanguageName(project.language)}</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-latte-subtext1 dark:text-mocha-subtext1">Created</p>
                                            <p>{project.createdAt.toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-latte-subtext1 dark:text-mocha-subtext1">Last Update</p>
                                            <p>{project.updatedAt.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </React.Fragment>
                ))}
            </tbody>
        </table>
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-latte-text dark:text-mocha-text">{t.projects}</h1>
                <button
                    onClick={handleAddClick}
                    className="flex items-center space-x-2 bg-latte-mauve text-white dark:bg-mocha-mauve dark:text-mocha-crust px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                    <PlusIcon className="w-5 h-5" />
                    <span>{t.addProject}</span>
                </button>
            </div>
            {projects.length === 0 ? (
                <div className="bg-latte-crust dark:bg-mocha-crust p-4 rounded-xl shadow-md">
                    <div className="text-center py-12">
                        <ProjectIcon className="w-16 h-16 mx-auto text-latte-overlay1 dark:text-mocha-overlay1 mb-4" />
                        <p className="text-lg text-latte-subtext0 dark:text-mocha-subtext0">{t.noProjects}</p>
                    </div>
                </div>
            ) : (
                <div className="space-y-8">
                    {projectStatusOptions.map(statusOption => {
                        const projectsForStatus = projectsByStatus[statusOption.value];
                        if (!projectsForStatus || projectsForStatus.length === 0) return null;
                        return (
                             <div key={statusOption.value}>
                                <h2 className="text-xl font-bold mb-3">
                                     <span className={`px-3 py-1.5 text-base font-bold rounded-full ${getStatusColor(statusOption.value)}`}>
                                        {t[`status${statusOption.value.replace(/\s/g, '')}`] || statusOption.value} ({projectsForStatus.length})
                                    </span>
                                </h2>
                                <div className="bg-latte-crust dark:bg-mocha-crust p-4 rounded-xl shadow-md">
                                    {renderProjectTable(projectsForStatus)}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
            <AddProjectModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                t={t}
                editingProject={editingProject}
                countryOptions={countryOptions}
                languageOptions={languageOptions}
                domains={domains}
                bms={bms}
                partnerships={partnerships}
                analystOptions={analystOptions}
                projectStatusOptions={projectStatusOptions.map(s => ({...s, label: t[`status${s.value.replace(/\s/g, '')}`]}))}
                projects={projects}
                profiles={profiles}
                pages={pages}
            />
        </div>
    );
};