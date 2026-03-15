export interface Ticket {
    id: string;
    title: string;
    description: string;
    stageId: string;
    assigneeId?: string;
    storyPoints?: number;
    priority: TicketPriority;
    projectId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface TicketActivity {
    id: string;
    ticketId: string;
    actionType: string;
    fieldName?: string;
    oldValue?: string;
    newValue?: string;
    createdAt: Date;
    user: {
        id: string;
        fullName: string;
        email: string;
    };
}

export enum TicketPriority {
    LOW = 'Low',
    MEDIUM = 'Medium',
    HIGH = 'High',
    URGENT = 'Urgent'
}

export interface CreateTicketData {
    title: string;
    description: string;
    stageId: string;
    assigneeId?: string;
    storyPoints?: number;
    priority: TicketPriority;
    projectId: string;
}

export interface UpdateTicketData {
    title?: string;
    description?: string;
    stageId?: string;
    assigneeId?: string;
    storyPoints?: number;
    priority?: TicketPriority;
}
