import { User, UserRole } from './index';

export interface ChatMessage {
    id: string;
    senderId: string; // Username or EmployeeID
    senderName: string;
    receiverId: string;
    content: string;
    timestamp: Date;
    isRead: boolean;
    type: 'text' | 'image' | 'file';
}

export interface ChatSession {
    id: string;
    participants: [string, string]; // [user1Id, user2Id]
    lastMessage?: ChatMessage;
    unreadCount: number;
}
