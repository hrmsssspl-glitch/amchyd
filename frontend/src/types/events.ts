export type EventType = 'company' | 'department' | 'team';
export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
export type NotificationType = 'info' | 'warning' | 'error' | 'success';
export type AudienceType = 'all' | 'role' | 'specific';

export interface Event {
    id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    location: string;
    type: EventType;
    status: EventStatus;
    createdBy: string;
    createdAt: string;
}

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: NotificationType;
    audience: AudienceType;
    targetRoles?: string[];
    expiryDate?: string;
    createdBy: string;
    createdAt: string;
    isRead?: boolean;
}

export interface News {
    id: string;
    headline: string;
    content: string;
    image?: string; // URL or base64
    publishDate: string;
    author: string;
    createdAt: string;
}
