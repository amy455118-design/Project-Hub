import React, { useMemo } from 'react';

export const SunIcon = ({ className }: { className?: string }) => (
  <span className={`inline-block ${className || ''}`}>
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
  </span>
);

export const MoonIcon = ({ className }: { className?: string }) => (
  <span className={`inline-block ${className || ''}`}>
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
  </span>
);

export const SearchIcon = ({ className }: { className?: string }) => (
  <span className={`inline-block ${className || ''}`}>
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  </span>
);

export const ProjectIcon = ({ className }: { className?: string }) => (
  <span className={`inline-block ${className || ''}`}>
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M9 3v18" />
        <path d="M15 3v18" />
    </svg>
  </span>
);

export const DomainIcon = ({ className }: { className?: string }) => (
  <span className={`inline-block ${className || ''}`}>
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  </span>
);

export const ProfileIcon = ({ className }: { className?: string }) => (
  <span className={`inline-block ${className || ''}`}>
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
  </span>
);

export const PageIcon = ({ className }: { className?: string }) => (
  <span className={`inline-block ${className || ''}`}>
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
        <line x1="4" y1="22" x2="4" y2="15"></line>
    </svg>
  </span>
);

export const BMIcon = ({ className }: { className?: string }) => (
  <span className={`inline-block ${className || ''}`}>
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
    </svg>
  </span>
);

export const AdAccountIcon = ({ className }: { className?: string }) => (
  <span className={`inline-block ${className || ''}`}>
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  </span>
);

export const MessageSquareIcon = ({ className }: { className?: string }) => (
  <span className={`inline-block ${className || ''}`}>
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  </span>
);

export const AppIcon = ({ className }: { className?: string }) => (
  <span className={`inline-block ${className || ''}`}>
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="3" y1="9" x2="21" y2="9"></line>
        <line x1="9" y1="21" x2="9" y2="9"></line>
    </svg>
  </span>
);


export const ChevronDownIcon = ({ className }: { className?: string }) => (
  <span className={`inline-block ${className || ''}`}>
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  </span>
);

export const PlusIcon = ({ className }: { className?: string }) => (
  <span className={`inline-block ${className || ''}`}>
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  </span>
);

export const GlobeIcon = ({ className }: { className?: string }) => (
  <span className={`inline-block ${className || ''}`}>
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
    </svg>
  </span>
);

export const CloseIcon = ({ className, strokeWidth = "2" }: { className?: string; strokeWidth?: string; }) => (
  <span className={`inline-block ${className || ''}`}>
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  </span>
);

export const ChevronsLeftIcon = ({ className }: { className?: string }) => (
  <span className={`inline-block ${className || ''}`}>
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="11 17 6 12 11 7"></polyline>
        <polyline points="18 17 13 12 18 7"></polyline>
    </svg>
  </span>
);

export const ChevronsRightIcon = ({ className }: { className?: string }) => (
  <span className={`inline-block ${className || ''}`}>
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="13 17 18 12 13 7"></polyline>
        <polyline points="6 17 11 12 6 7"></polyline>
    </svg>
  </span>
);

export const MtLogoIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 95 50" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Cleaned up 'M' shape */}
        <path d="M0 50V0H12L28 28L44 0H56V50H46V16L28 40L10 16V50H0Z" className="fill-latte-text dark:fill-mocha-text" />

        {/* 'T' Shape */}
        <path d="M60 0H95V10H81V50H71V10H60V0Z" className="fill-latte-text dark:fill-mocha-text" />

        {/* Dynamic 'swoosh' that also highlights the second half of M */}
        {/* It gives a sense of motion and connection, and acts as an abstract arrow */}
        <path d="M28 28L44 0H56V20C56 20 45 30 28 40V28Z" className="fill-latte-blue dark:fill-mocha-blue" />

        {/* A small accent to hint at an arrowhead */}
        <path d="M44 0L50 8L56 0H44Z" className="fill-latte-sky dark:fill-mocha-sky" />
    </svg>
);

export const CheckIcon = ({ className, strokeWidth = "3" }: { className?: string; strokeWidth?: string; }) => (
  <span className={`inline-block ${className || ''}`}>
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  </span>
);

export const EditIcon = ({ className }: { className?: string }) => (
  <span className={`inline-block ${className || ''}`}>
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
  </span>
);

export const TrashIcon = ({ className }: { className?: string }) => (
  <span className={`inline-block ${className || ''}`}>
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
  </span>
);

export const LayoutGridIcon = ({ className }: { className?: string }) => (
  <span className={`inline-block ${className || ''}`}>
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"></rect>
        <rect x="14" y="3" width="7" height="7"></rect>
        <rect x="3" y="14" width="7" height="7"></rect>
        <rect x="14" y="14" width="7" height="7"></rect>
    </svg>
  </span>
);

export const ListIcon = ({ className }: { className?: string }) => (
  <span className={`inline-block ${className || ''}`}>
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6"></line>
        <line x1="8" y1="12" x2="21" y2="12"></line>
        <line x1="8" y1="18" x2="21" y2="18"></line>
        <line x1="3" y1="6" x2="3.01" y2="6"></line>
        <line x1="3" y1="12" x2="3.01" y2="12"></line>
        <line x1="3" y1="18" x2="3.01" y2="18"></line>
    </svg>
  </span>
);

export const HistoryIcon = ({ className }: { className?: string }) => (
  <span className={`inline-block ${className || ''}`}>
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 4v6h6"></path>
        <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
    </svg>
  </span>
);

export const ExternalLinkIcon = ({ className }: { className?: string }) => (
  <span className={`inline-block ${className || ''}`}>
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
        <polyline points="15 3 21 3 21 9"></polyline>
        <line x1="10" y1="14" x2="21" y2="3"></line>
    </svg>
  </span>
);

export const SettingsIcon = ({ className }: { className?: string }) => (
  <span className={`inline-block ${className || ''}`}>
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>
  </span>
);

export const LogOutIcon = ({ className }: { className?: string }) => (
  <span className={`inline-block ${className || ''}`}>
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
        <polyline points="16 17 21 12 16 7"></polyline>
        <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
  </span>
);

export const UsersIcon = ({ className }: { className?: string }) => (
  <span className={`inline-block ${className || ''}`}>
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="8.5" cy="7" r="4"></circle>
        <polyline points="17 11 19 13 23 9"></polyline>
    </svg>
  </span>
);

// --- Generative Art Types & Data ---

type Node = { id: number; cx: number; cy: number; r: number };
type Line = { id: string; x1: number; y1: number; x2: number; y2: number };
type ConstellationData = {
    nodes: { x: number, y: number }[];
    lines: { i1: number, i2: number }[];
};
type GeneratedConstellation = {
    id: string;
    nodes: Node[];
    lines: { x1: number, y1: number, x2: number, y2: number }[];
}

const specialConstellations: Record<string, ConstellationData> = {
    ursaMinor: {
        nodes: [ { x: 50, y: 10 }, { x: 40, y: 35 }, { x: 25, y: 50 }, { x: 10, y: 40 }, { x: 60, y: 60 }, { x: 75, y: 80 }, { x: 90, y: 65 } ],
        lines: [ { i1: 0, i2: 1 }, { i1: 1, i2: 2 }, { i1: 2, i2: 3 }, { i1: 2, i2: 4 }, { i1: 4, i2: 5 }, { i1: 5, i2: 6 }, { i1: 6, i2: 4 } ]
    },
    cassiopeia: {
        nodes: [ { x: 0, y: 20 }, { x: 20, y: 0 }, { x: 40, y: 20 }, { x: 60, y: 0 }, { x: 80, y: 20 } ],
        lines: [ { i1: 0, i2: 1 }, { i1: 1, i2: 2 }, { i1: 2, i2: 3 }, { i1: 3, i2: 4 } ]
    }
};

const predefinedSmallConstellations: ConstellationData[] = [
    { nodes: [{x:0,y:15}, {x:15,y:15}, {x:7.5,y:0}], lines: [{i1:0,i2:1},{i1:1,i2:2},{i1:2,i2:0}] },
    { nodes: [{x:0,y:0}, {x:15,y:5}, {x:12,y:20}, {x:2,y:15}], lines: [{i1:0,i2:1},{i1:1,i2:2},{i1:2,i2:3},{i1:3,i2:0}] },
    { nodes: [{x:0,y:0}, {x:10,y:10}, {x:0,y:20}, {x:10,y:30}], lines: [{i1:0,i2:1},{i1:1,i2:2},{i1:2,i2:3}] },
    { nodes: [{x:0,y:5}, {x:20,y:0}, {x:25,y:20}, {x:5,y:25}], lines: [{i1:0,i2:2},{i1:1,i2:3}] },
    { nodes: [{x:0,y:0}, {x:15,y:0}, {x:7.5,y:15}, {x:7.5,y:25}], lines: [{i1:0,i2:1},{i1:0,i2:2},{i1:1,i2:2},{i1:2,i2:3}] },
];

// --- Generative Art Helpers ---

const generateTransformedConstellation = (id: string, data: ConstellationData, viewBoxSize: number, padding: number): GeneratedConstellation => {
    const scale = Math.random() * 0.4 + 0.3;
    const angle = Math.random() * Math.PI * 2;
    const offsetX = Math.random() * (viewBoxSize - padding * 2) + padding;
    const offsetY = Math.random() * (viewBoxSize - padding * 2) + padding;

    const transform = (p: {x: number, y: number}) => {
        const centeredX = p.x - 50;
        const centeredY = p.y - 50;
        const scaledX = centeredX * scale; 
        const scaledY = centeredY * scale;
        const rotatedX = scaledX * Math.cos(angle) - scaledY * Math.sin(angle);
        const rotatedY = scaledX * Math.sin(angle) + scaledY * Math.cos(angle);
        return { cx: rotatedX + offsetX, cy: rotatedY + offsetY };
    };

    const transformedNodes: Node[] = data.nodes.map((p, i) => ({
        id: i, ...transform(p), r: Math.random() * 1.5 + 0.5,
    }));

    const lines = data.lines.map(line => {
        const p1 = transformedNodes[line.i1];
        const p2 = transformedNodes[line.i2];
        return { x1: p1.cx, y1: p1.cy, x2: p2.cx, y2: p2.cy };
    });

    return { id, nodes: transformedNodes, lines };
};

const generateMSTConstellation = (numNodes: number, viewBoxSize: number, padding: number, minDist: number): { nodes: Node[], lines: Line[] } => {
    const nodes: Node[] = [];
    let tries = 0;
    while (nodes.length < numNodes && tries < numNodes * 100) {
        const newNode = {
            id: nodes.length,
            cx: Math.random() * (viewBoxSize - padding * 2) + padding,
            cy: Math.random() * (viewBoxSize - padding * 2) + padding,
            r: 1,
        };

        if (nodes.every(node => Math.hypot(node.cx - newNode.cx, node.cy - newNode.cy) >= minDist)) {
            nodes.push(newNode);
        }
        tries++;
    }

    const edges = [];
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const p1 = nodes[i]; const p2 = nodes[j];
            const dist = Math.hypot(p1.cx - p2.cx, p1.cy - p2.cy);
            edges.push({ p1: i, p2: j, dist });
        }
    }
    edges.sort((a, b) => a.dist - b.dist);

    const parent: number[] = Array.from({ length: nodes.length }, (_, i) => i);
    const find = (i: number): number => (parent[i] === i ? i : (parent[i] = find(parent[i])));
    const union = (i: number, j: number) => {
        const rootI = find(i); const rootJ = find(j);
        if (rootI !== rootJ) parent[rootI] = rootJ;
    };

    const mstLines = [];
    for (const edge of edges) {
        if (find(edge.p1) !== find(edge.p2)) {
            union(edge.p1, edge.p2);
            const startNode = nodes[edge.p1]; const endNode = nodes[edge.p2];
            mstLines.push({
                id: `line-${startNode.id}-${endNode.id}`,
                x1: startNode.cx, y1: startNode.cy,
                x2: endNode.cx, y2: endNode.cy,
            });
        }
    }
    return { nodes, lines: mstLines };
};


export const LoginArtIcon = ({ className, showMainConstellation = true }: { className?: string; showMainConstellation?: boolean; }) => {
    const { mainConstellation, layers, stars } = useMemo(() => {
        const VIEW_BOX_SIZE = 800;
        
        const main = generateMSTConstellation(15, VIEW_BOX_SIZE, 100, 80);
        main.nodes.forEach(n => n.r = Math.random() * 4 + 4); 

        const bgConstellations: GeneratedConstellation[] = [];
        const numBgConstellations = 7;
        const specialKeys = Object.keys(specialConstellations);
        
        for (let i = 0; i < numBgConstellations; i++) {
             if (Math.random() < 0.25 && specialKeys.length > 0) {
                const key = specialKeys.splice(Math.floor(Math.random() * specialKeys.length), 1)[0];
                bgConstellations.push(generateTransformedConstellation(`bg-${i}`, specialConstellations[key], VIEW_BOX_SIZE, 50));
            } else {
                const predefined = predefinedSmallConstellations[Math.floor(Math.random() * predefinedSmallConstellations.length)];
                bgConstellations.push(generateTransformedConstellation(`bg-${i}`, predefined, VIEW_BOX_SIZE, 50));
            }
        }
        
        const generatedStars = Array.from({ length: 250 }).map((_, i) => ({
            id: `star-${i}`,
            cx: Math.random() * VIEW_BOX_SIZE,
            cy: Math.random() * VIEW_BOX_SIZE,
            r: Math.random() * 0.8 + 0.2,
            opacity: Math.random() * 0.5 + 0.2,
        }));

        const layer1Items = bgConstellations.slice(0, 2);
        const layer2Items = bgConstellations.slice(2, 5);
        const layer3Items = bgConstellations.slice(5, 7);
        
        return { 
            mainConstellation: main,
            stars: generatedStars,
            layers: [
                { id: 1, items: layer1Items, stars: generatedStars.slice(0, 80) },
                { id: 2, items: layer2Items, stars: generatedStars.slice(80, 170) },
                { id: 3, items: layer3Items, stars: generatedStars.slice(170) }
            ]
        };
    }, []);

    return (
        <svg viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} preserveAspectRatio="xMidYMid slice">
            <style>{`
            .line-blue-stop-1 { stop-color: #04a5e5; } .line-blue-stop-2 { stop-color: #1e66f5; }
            .line-mauve-stop-1 { stop-color: #ea76cb; } .line-mauve-stop-2 { stop-color: #8839ef; }
            .dark .line-blue-stop-1 { stop-color: #89dceb; } .dark .line-blue-stop-2 { stop-color: #89b4fa; }
            .dark .line-mauve-stop-1 { stop-color: #f5c2e7; } .dark .line-mauve-stop-2 { stop-color: #cba6f7; }
            
            @keyframes zoom-in {
                from { transform: scale(1); }
                to { transform: scale(2.5); }
            }
            #parallax-layer-1 { transform-origin: center center; animation: zoom-in 120s linear infinite; }
            #parallax-layer-2 { transform-origin: center center; animation: zoom-in 90s linear infinite; }
            #parallax-layer-3 { transform-origin: center center; animation: zoom-in 60s linear infinite; }
            #main-constellation-wrapper { 
                transform-origin: center center; 
                animation: zoom-in 240s linear infinite;
            }
            `}</style>
            <defs>
                <radialGradient id="space-grad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <stop offset="0%" stopColor="#1e1e2e" />
                    <stop offset="100%" stopColor="#11111b" />
                </radialGradient>
                <linearGradient id="line-grad-blue" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" className="line-blue-stop-1" />
                    <stop offset="100%" className="line-blue-stop-2" />
                </linearGradient>
                <linearGradient id="line-grad-mauve" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" className="line-mauve-stop-1" />
                    <stop offset="100%" className="line-mauve-stop-2" />
                </linearGradient>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
            
            <rect width="800" height="800" fill="url(#space-grad)" />

            {layers.map(layer => (
                 <g id={`parallax-layer-${layer.id}`} key={`layer-${layer.id}`}>
                    {layer.stars.map(star => (
                        <circle key={star.id} cx={star.cx} cy={star.cy} r={star.r} fill="white" opacity={star.opacity} />
                    ))}
                    {layer.items.map((constellation) => (
                        <g key={constellation.id} opacity={0.1 + (layer.id * 0.08)}>
                            {constellation.lines.map((line, lineIndex) => (
                                <line
                                    key={`bg-line-${constellation.id}-${lineIndex}`}
                                    x1={line.x1} y1={line.y1}
                                    x2={line.x2} y2={line.y2}
                                    stroke="white" strokeWidth={0.5}
                                />
                            ))}
                            {constellation.nodes.map((node) => (
                                <circle
                                    key={`bg-node-${constellation.id}-${node.id}`}
                                    cx={node.cx} cy={node.cy}
                                    r={node.r} fill="white"
                                />
                            ))}
                        </g>
                    ))}
                </g>
            ))}

            {showMainConstellation && (
                <g id="main-constellation-wrapper">
                    <g filter="url(#glow)" opacity="0.8">
                        {mainConstellation.lines.map(line => (
                            <line
                                key={line.id} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
                                stroke={Math.random() > 0.5 ? 'url(#line-grad-blue)' : 'url(#line-grad-mauve)'}
                                strokeWidth={Math.random() * 0.5 + 1}
                            />
                        ))}
                        {mainConstellation.nodes.map(node => (
                            <circle
                                key={node.id} cx={node.cx} cy={node.cy} r={node.r}
                                fill={Math.random() > 0.5 ? 'url(#line-grad-blue)' : 'url(#line-grad-mauve)'}
                            />
                        ))}
                    </g>
                </g>
            )}
        </svg>
    );
};

export const LayersIcon = ({ className }: { className?: string }) => (
  <span className={`inline-block ${className || ''}`}>
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
      <polyline points="2 17 12 22 22 17"></polyline>
      <polyline points="2 12 12 17 22 12"></polyline>
    </svg>
  </span>
);