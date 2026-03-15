export interface Project {
    id: string;
    name: string;
    description: string;
    stages: Stage[];
    memberCount: number;
    lastUpdated: Date;
    createdBy: string;
    createdAt: Date;
}

export interface Stage {
    id: string;
    name: string;
    order: number;
}

export interface CreateProjectData {
    name: string;
    description: string;
    stages: string[];
}
