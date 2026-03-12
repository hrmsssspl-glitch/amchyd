import React, { useState, useEffect, useRef } from 'react';
import { database } from '../../firebaseConfig';
import { ref, onValue, push, set, serverTimestamp, query, limitToLast, orderByKey } from "firebase/database";
import { User, UserRole } from '../../types';
import { ChatMessage } from '../../types/chat';

// No socket connection here - we use Firebase or fallback to localStorage

interface ChatWidgetProps {
    currentUser: User;
    allUsers: User[];
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ currentUser, allUsers }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeUser, setActiveUser] = useState<User | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [lastMessages, setLastMessages] = useState<Record<string, ChatMessage>>({});
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Filter users list
    const filteredUsers = allUsers.filter(user => {
        if (user.username === currentUser.username) return false;
        const search = searchTerm.toLowerCase();
        return (
            user.name.toLowerCase().includes(search) ||
            user.username.toLowerCase().includes(search) ||
            (user.employeeId && user.employeeId.toLowerCase().includes(search))
        );
    });

    const getRoleColor = (role: UserRole) => {
        switch (role) {
            case 'superadmin': return '#dc2626';
            case 'admin': return '#f59e0b';
            case 'hr_manager': return '#3b82f6';
            case 'employee': return '#6b7280';
            default: return '#cbd5e1';
        }
    };

    // Helper: Generate a unique, sorted key for the chat pair (Case Insensitive)
    const getChatKey = (user1: string, user2: string) => {
        return `chat_v2_${[user1.toLowerCase(), user2.toLowerCase()].sort().join('_')}`;
    };

    // Helper: Migrate old V1 chat data to V2 if needed (optional, implemented for smoothness)
    const migrateDataIfNeeded = (otherUser: string) => {
        const v2Key = getChatKey(currentUser.username, otherUser);
        if (!localStorage.getItem(v2Key)) {
            // Check for V1 data (try both combinations as V1 was unstable)
            const v1KeyA = `chat_${currentUser.username}_${otherUser}`;
            const v1KeyB = `chat_${otherUser}_${currentUser.username}`;
            const v1Data = localStorage.getItem(v1KeyA) || localStorage.getItem(v1KeyB);
            if (v1Data) {
                localStorage.setItem(v2Key, v1Data);
            }
        }
    };

    // Chat Logic
    // Real-time synchronization using Socket.IO (Updated for Cross-Machine Support)
    // Chat Logic - FIREBASE REALTIME
    useEffect(() => {
        if (database) {
            // FIREBASE MODE
            // 1. Listen for Active Conversation
            if (activeUser) {
                const roomKey = getChatKey(currentUser.username, activeUser.username);
                const messagesRef = ref(database, `chats/${roomKey}/messages`);
                const recentMessagesQuery = query(messagesRef, limitToLast(50)); // Load last 50

                const unsubscribe = onValue(recentMessagesQuery, (snapshot) => {
                    const data = snapshot.val();
                    if (data) {
                        const loadedMessages = Object.values(data) as ChatMessage[];
                        setMessages(loadedMessages);
                    } else {
                        setMessages([]);
                    }
                });

                return () => unsubscribe();
            }
        } else {
            // LOCALSTORAGE FALLBACK MODE (Same Machine Only)
            if (!activeUser) return;

            const loadMessages = () => {
                const key = getChatKey(currentUser.username, activeUser.username);
                const storedMessages = localStorage.getItem(key);
                if (storedMessages) {
                    const parsed = JSON.parse(storedMessages);
                    setMessages(prev => {
                        if (JSON.stringify(prev) !== JSON.stringify(parsed)) return parsed;
                        return prev;
                    });
                } else {
                    setMessages([]);
                }
            };

            loadMessages();
            const interval = setInterval(loadMessages, 1000);
            return () => clearInterval(interval);
        }
    }, [activeUser, currentUser.username]);



    // Polling for inbox (last messages)
    useEffect(() => {
        let interval: NodeJS.Timeout;

        const checkInbox = () => {
            // REMOVED isOpen check here so we get notifications!
            const updates: Record<string, ChatMessage> = {};
            allUsers.forEach(user => {
                if (user.username === currentUser.username) return;

                const key = getChatKey(currentUser.username, user.username);
                const stored = localStorage.getItem(key);

                // Fallback check for V1 keys if V2 empty
                if (!stored) {
                    const v1Key = `chat_${currentUser.username}_${user.username}`;
                    const v1Stored = localStorage.getItem(v1Key);
                    if (v1Stored) {
                        const msgs = JSON.parse(v1Stored);
                        if (msgs.length > 0) updates[user.username] = msgs[msgs.length - 1];
                    }
                } else {
                    const msgs = JSON.parse(stored);
                    if (msgs.length > 0) {
                        updates[user.username] = msgs[msgs.length - 1];
                    }
                }
            });

            // Only update state if different to prevent re-renders (simplified check)
            setLastMessages(prev => {
                if (JSON.stringify(prev) !== JSON.stringify(updates)) {
                    return updates;
                }
                return prev;
            });
        };

        // Run always
        checkInbox();
        interval = setInterval(checkInbox, 3000);

        // Storage listener for inbox
        const handleInboxStorage = (e: StorageEvent) => {
            if (e.key && e.key.startsWith('chat_')) {
                checkInbox();
            }
        };
        window.addEventListener('storage', handleInboxStorage);

        return () => {
            if (interval) clearInterval(interval);
            window.removeEventListener('storage', handleInboxStorage);
        };
    }, [activeUser, allUsers, currentUser.username]);


    // Scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages, activeUser]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeUser) return;

        // Create Message Object
        const message: ChatMessage = {
            id: Date.now().toString(),
            senderId: currentUser.username,
            senderName: currentUser.name,
            receiverId: activeUser.username,
            content: newMessage,
            timestamp: new Date(),
            isRead: false,
            type: 'text'
        };

        if (database) {
            // FIREBASE SEND
            const roomKey = getChatKey(currentUser.username, activeUser.username);
            const messagesRef = ref(database, `chats/${roomKey}/messages`);
            push(messagesRef, message);
        } else {
            // LOCALSTORAGE FALLBACK SEND
            const updatedMessages = [...messages, message];
            setMessages(updatedMessages);

            const key = getChatKey(currentUser.username, activeUser.username);
            localStorage.setItem(key, JSON.stringify(updatedMessages));
            window.dispatchEvent(new Event('storage'));
        }

        setNewMessage('');
    };

    // Sort users: Users with messages first, then alphabetical
    const sortedFilteredUsers = [...filteredUsers].sort((a, b) => {
        const msgA = lastMessages[a.username];
        const msgB = lastMessages[b.username];

        if (msgA && !msgB) return -1;
        if (!msgA && msgB) return 1;
        if (msgA && msgB) {
            return new Date(msgB.timestamp).getTime() - new Date(msgA.timestamp).getTime();
        }
        return a.name.localeCompare(b.name);
    });

    return (
        <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>

            {/* Widget Main Container */}
            {isOpen && (
                <div style={{
                    width: '380px',
                    height: '600px',
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                    marginBottom: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    border: '1px solid #e2e8f0',
                    animation: 'slideUp 0.3s ease-out'
                }}>
                    {/* Header */}
                    <div style={{
                        padding: '16px 20px',
                        background: 'linear-gradient(135deg, #4f46e5, #3b82f6)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        {activeUser ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <button
                                    onClick={() => setActiveUser(null)}
                                    style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', cursor: 'pointer', padding: '6px', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                    <i className="fas fa-arrow-left"></i>
                                </button>
                                <div>
                                    <div style={{ fontWeight: '700', fontSize: '15px' }}>{activeUser.name}</div>
                                    <div style={{ fontSize: '11px', opacity: 0.9 }}>{activeUser.role}</div>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>Messages</h3>
                                <p style={{ margin: '4px 0 0 0', fontSize: '12px', opacity: 0.9 }}>
                                    <i className="fas fa-circle" style={{ color: database ? '#4ade80' : '#f59e0b', fontSize: '8px', marginRight: '6px' }}></i>
                                    {database ? 'Cloud Connected' : 'Local Mode'}
                                </p>
                            </div>
                        )}
                        <button
                            onClick={() => setIsOpen(false)}
                            style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', fontSize: '16px' }}
                        >
                            <i className="fas fa-times"></i>
                        </button>
                    </div>

                    {/* Configuration Warning - Shown if Firebase is missing */}
                    {!database && (
                        <div style={{
                            padding: '15px',
                            backgroundColor: '#fff7ed',
                            borderBottom: '1px solid #fed7aa',
                            fontSize: '13px',
                            color: '#c2410c'
                        }}>
                            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>⚠ Cloud Chat Not Configured</div>
                            <p style={{ margin: '0 0 8px 0' }}>
                                For <strong>Live Chat</strong> across different devices (like Vercel), you must set up your cloud database.
                            </p>
                            <div style={{ fontSize: '11px', backgroundColor: '#fff', padding: '8px', borderRadius: '4px', border: '1px solid #fed7aa', marginBottom: '5px' }}>
                                1. Open <code>src/firebaseConfig.ts</code><br />
                                2. Paste your Firebase keys.<br />
                                3. Redeploy.
                            </div>
                            <div style={{ fontSize: '11px', opacity: 0.8 }}>
                                Currently running in <strong>Local Offline Mode</strong> (tabs only).
                            </div>
                        </div>
                    )}

                    {/* Content Area */}
                    <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>

                        {activeUser ? (
                            // Chat View
                            <>
                                <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    {messages.length === 0 && (
                                        <div style={{ textAlign: 'center', marginTop: '40px', color: '#94a3b8' }}>
                                            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px auto', fontSize: '24px', color: '#64748b' }}>
                                                {activeUser.name.charAt(0)}
                                            </div>
                                            <p style={{ fontSize: '13px' }}>Start a conversation with <strong>{activeUser.name}</strong></p>
                                        </div>
                                    )}
                                    {messages.map(msg => {
                                        const isOwn = msg.senderId === currentUser.username;
                                        return (
                                            <div key={msg.id} style={{ display: 'flex', justifyContent: isOwn ? 'flex-end' : 'flex-start' }}>
                                                <div style={{
                                                    maxWidth: '80%',
                                                    padding: '12px 16px',
                                                    borderRadius: '16px',
                                                    borderTopRightRadius: isOwn ? '2px' : '16px',
                                                    borderTopLeftRadius: isOwn ? '16px' : '2px',
                                                    backgroundColor: isOwn ? '#4f46e5' : 'white',
                                                    color: isOwn ? 'white' : '#1e293b',
                                                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                                    fontSize: '14px',
                                                    lineHeight: '1.5'
                                                }}>
                                                    {msg.content}
                                                    <div style={{ fontSize: '10px', marginTop: '4px', opacity: 0.7, textAlign: 'right' }}>
                                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input */}
                                <form onSubmit={handleSendMessage} style={{ padding: '15px', backgroundColor: 'white', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type a message..."
                                        style={{
                                            flex: 1,
                                            padding: '12px 20px',
                                            borderRadius: '25px',
                                            border: '1px solid #e2e8f0',
                                            backgroundColor: '#f1f5f9',
                                            fontSize: '14px',
                                            outline: 'none',
                                            transition: 'all 0.2s'
                                        }}
                                        onFocus={(e) => { e.target.style.backgroundColor = 'white'; e.target.style.borderColor = '#4f46e5'; }}
                                        onBlur={(e) => { e.target.style.backgroundColor = '#f1f5f9'; e.target.style.borderColor = '#e2e8f0'; }}
                                    />
                                    <button
                                        type="submit"
                                        disabled={!newMessage.trim()}
                                        style={{
                                            width: '44px',
                                            height: '44px',
                                            borderRadius: '50%',
                                            backgroundColor: newMessage.trim() ? '#4f46e5' : '#e2e8f0',
                                            color: 'white',
                                            border: 'none',
                                            cursor: newMessage.trim() ? 'pointer' : 'default',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '18px',
                                            boxShadow: newMessage.trim() ? '0 4px 12px rgba(79, 70, 229, 0.3)' : 'none',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <i className="fas fa-paper-plane"></i>
                                    </button>
                                </form>
                                {/* Debug Footer */}
                                <div style={{ fontSize: '10px', color: '#94a3b8', textAlign: 'center', padding: '5px', backgroundColor: '#f1f5f9', borderTop: '1px solid #e2e8f0' }}>
                                    {!database && <div style={{ color: '#f59e0b', fontWeight: 'bold', padding: '2px' }}>⚠ LIVE CHAT: Set keys in src/firebaseConfig.ts ⚠</div>}
                                    <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>Mode: {database ? 'Cloud (Live)' : 'Local (Offline)'}</div>
                                    <div>key: {getChatKey(currentUser.username, activeUser.username)}</div>
                                </div>
                            </>
                        ) : (
                            // List View
                            <>
                                <div style={{ padding: '15px', borderBottom: '1px solid #e2e8f0', backgroundColor: 'white' }}>
                                    <div style={{ position: 'relative' }}>
                                        <i className="fas fa-search" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}></i>
                                        <input
                                            type="text"
                                            placeholder="Search users..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '10px 10px 10px 36px',
                                                borderRadius: '8px',
                                                border: '1px solid #e2e8f0',
                                                fontSize: '14px',
                                                backgroundColor: '#f8fafc',
                                                outline: 'none',
                                                boxSizing: 'border-box'
                                            }}
                                        />
                                    </div>
                                </div>
                                <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
                                    {sortedFilteredUsers.length === 0 ? (
                                        <div style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                                            No users found
                                        </div>
                                    ) : (
                                        sortedFilteredUsers.map(user => {
                                            const lastMsg = lastMessages[user.username];
                                            const isUnread = lastMsg && !lastMsg.isRead && lastMsg.receiverId === currentUser.username;

                                            return (
                                                <div
                                                    key={user.username}
                                                    onClick={() => setActiveUser(user)}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '12px',
                                                        padding: '12px',
                                                        borderRadius: '12px',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s',
                                                        backgroundColor: 'white',
                                                        marginBottom: '8px',
                                                        border: '1px solid transparent'
                                                    }}
                                                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f1f5f9'; }}
                                                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white'; }}
                                                >
                                                    <div style={{ position: 'relative' }}>
                                                        <div style={{
                                                            width: '40px',
                                                            height: '40px',
                                                            borderRadius: '50%',
                                                            backgroundColor: `${getRoleColor(user.role)}20`,
                                                            color: getRoleColor(user.role),
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontWeight: '700',
                                                            fontSize: '16px'
                                                        }}>
                                                            {user.name.charAt(0)}
                                                        </div>
                                                        {isUnread && (
                                                            <div style={{
                                                                position: 'absolute',
                                                                top: '-2px',
                                                                right: '-2px',
                                                                width: '12px',
                                                                height: '12px',
                                                                borderRadius: '50%',
                                                                backgroundColor: '#ef4444',
                                                                border: '2px solid white'
                                                            }} />
                                                        )}
                                                    </div>

                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <div style={{ fontWeight: isUnread ? '700' : '600', color: '#1e293b', fontSize: '14px' }}>{user.name}</div>
                                                            {lastMsg && (
                                                                <div style={{ fontSize: '10px', color: '#94a3b8' }}>
                                                                    {new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </div>
                                                            )}
                                                        </div>

                                                        {lastMsg ? (
                                                            <div style={{
                                                                fontSize: '12px',
                                                                color: isUnread ? '#1e293b' : '#64748b',
                                                                whiteSpace: 'nowrap',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                fontWeight: isUnread ? '600' : '400'
                                                            }}>
                                                                {lastMsg.senderId === currentUser.username ? 'You: ' : ''}{lastMsg.content}
                                                            </div>
                                                        ) : (
                                                            <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                                <span style={{
                                                                    display: 'inline-block',
                                                                    padding: '2px 6px',
                                                                    borderRadius: '4px',
                                                                    backgroundColor: `${getRoleColor(user.role)}10`,
                                                                    color: getRoleColor(user.role),
                                                                    fontSize: '10px',
                                                                    fontWeight: '600',
                                                                    textTransform: 'capitalize'
                                                                }}>
                                                                    {user.role === 'hr_manager' ? 'HR Manager' : user.role}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>

                                {/* DEBUG INFO - REMOVE IN PRODUCTION */}


                                {/* Input */}

                            </>
                        )}
                    </div>
                </div>
            )}



            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: isOpen ? '#1e293b' : '#4f46e5',
                    color: 'white',
                    border: 'none',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)'
                }}
            >
                {/* Check if any unread messages across all users */}
                {!isOpen && Object.values(lastMessages).some(msg => !msg.isRead && msg.receiverId === currentUser.username) && (
                    <div style={{
                        position: 'absolute',
                        top: '0',
                        right: '0',
                        width: '18px',
                        height: '18px',
                        backgroundColor: '#ef4444',
                        borderRadius: '50%',
                        border: '2px solid white',
                        zIndex: 10
                    }} />
                )}
                <i className={`fas ${isOpen ? 'fa-times' : 'fa-comment-alt'}`}></i>
            </button>

            {/* Styles for animation */}
            <style>
                {`
                    @keyframes slideUp {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                `}
            </style>
        </div>
    );
};

export default ChatWidget;
