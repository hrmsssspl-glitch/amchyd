import React, { useState, useEffect, useRef } from 'react';
import { User, UserRole } from '../../types';
import { ChatMessage } from '../../types/chat';

interface ChatWindowProps {
    currentUser: User;
    recipientUser: User;
    isOpen: boolean;
    onClose: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ currentUser, recipientUser, isOpen, onClose }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Load initial mock messages or empty
    useEffect(() => {
        if (isOpen) {
            // Check if there are existing messages in local storage or mock them
            const storedMessages = localStorage.getItem(`chat_${currentUser.username}_${recipientUser.username}`);
            if (storedMessages) {
                setMessages(JSON.parse(storedMessages));
            } else {
                setMessages([]);
            }
        }
    }, [isOpen, currentUser.username, recipientUser.username]);

    // Save messages to local storage whenever they change
    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem(`chat_${currentUser.username}_${recipientUser.username}`, JSON.stringify(messages));
            // Also save for the other user perspective (for demo purposes)
            localStorage.setItem(`chat_${recipientUser.username}_${currentUser.username}`, JSON.stringify(messages));
        }
    }, [messages, currentUser.username, recipientUser.username]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const message: ChatMessage = {
            id: Date.now().toString(),
            senderId: currentUser.username,
            senderName: currentUser.name,
            receiverId: recipientUser.username,
            content: newMessage,
            timestamp: new Date(),
            isRead: false,
            type: 'text'
        };

        setMessages([...messages, message]);
        setNewMessage('');

        // Simulate reply for demo
        setTimeout(() => {
            const reply: ChatMessage = {
                id: (Date.now() + 1).toString(),
                senderId: recipientUser.username,
                senderName: recipientUser.name,
                receiverId: currentUser.username,
                content: `Auto-reply from ${recipientUser.name}: I received your message "${newMessage}"`,
                timestamp: new Date(),
                isRead: false,
                type: 'text'
            };
            setMessages(prev => [...prev, reply]);
        }, 1000);
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '350px',
            height: '500px',
            backgroundColor: 'white',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000,
            overflow: 'hidden',
            border: '1px solid #e2e8f0'
        }}>
            {/* Header */}
            <div style={{
                padding: '15px',
                backgroundColor: '#5d5fef',
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #4f46e5'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: 'white',
                        color: '#5d5fef',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '14px'
                    }}>
                        {recipientUser.name.charAt(0)}
                    </div>
                    <div>
                        <div style={{ fontWeight: '600', fontSize: '14px' }}>{recipientUser.name}</div>
                        <div style={{ fontSize: '11px', opacity: 0.9 }}>{recipientUser.role} • {recipientUser.username}</div>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '16px',
                        padding: '4px'
                    }}
                >
                    <i className="fas fa-times"></i>
                </button>
            </div>

            {/* Messages Area */}
            <div style={{
                flex: 1,
                padding: '15px',
                overflowY: 'auto',
                backgroundColor: '#f8fafc',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
            }}>
                {messages.length === 0 && (
                    <div style={{ textAlign: 'center', color: '#94a3b8', marginTop: '20px', fontSize: '13px' }}>
                        Start a conversation with {recipientUser.name}
                    </div>
                )}
                {messages.map((msg) => {
                    const isOwn = msg.senderId === currentUser.username;
                    return (
                        <div
                            key={msg.id}
                            style={{
                                alignSelf: isOwn ? 'flex-end' : 'flex-start',
                                maxWidth: '80%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: isOwn ? 'flex-end' : 'flex-start'
                            }}
                        >
                            <div style={{
                                padding: '10px 14px',
                                borderRadius: '12px',
                                borderTopRightRadius: isOwn ? '2px' : '12px',
                                borderTopLeftRadius: isOwn ? '12px' : '2px',
                                backgroundColor: isOwn ? '#5d5fef' : 'white',
                                color: isOwn ? 'white' : '#1e293b',
                                boxShadow: isOwn ? '0 2px 4px rgba(93, 95, 239, 0.2)' : '0 1px 2px rgba(0,0,0,0.05)',
                                fontSize: '13px',
                                lineHeight: '1.5',
                                wordBreak: 'break-word',
                                border: isOwn ? 'none' : '1px solid #e2e8f0'
                            }}>
                                {msg.content}
                            </div>
                            <div style={{
                                fontSize: '10px',
                                color: '#94a3b8',
                                marginTop: '4px',
                                padding: '0 4px'
                            }}>
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form
                onSubmit={handleSendMessage}
                style={{
                    padding: '15px',
                    borderTop: '1px solid #e2e8f0',
                    backgroundColor: 'white',
                    display: 'flex',
                    gap: '10px'
                }}
            >
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    style={{
                        flex: 1,
                        padding: '10px 14px',
                        borderRadius: '20px',
                        border: '1px solid #cbd5e1',
                        fontSize: '13px',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#5d5fef'}
                    onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                />
                <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: newMessage.trim() ? '#5d5fef' : '#e2e8f0',
                        color: 'white',
                        border: 'none',
                        cursor: newMessage.trim() ? 'pointer' : 'default',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'background-color 0.2s'
                    }}
                >
                    <i className="fas fa-paper-plane"></i>
                </button>
            </form>
        </div>
    );
};

export default ChatWindow;
