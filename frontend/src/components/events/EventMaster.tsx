import React, { useState } from 'react';
import {
    Box,
    Tabs,
    Tab,
    Typography,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Chip,
    IconButton,
    useTheme,
    InputAdornment
} from '@mui/material';
import {
    Add as AddIcon,
    Event as EventIcon,
    Notifications as NotificationIcon,
    Article as NewsIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Search as SearchIcon
} from '@mui/icons-material';
import { Event, Notification, News, EventType, EventStatus, NotificationType, AudienceType } from '../../types/events';
import { getUserDetails } from '../../auth/authService';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`event-tabpanel-${index}`}
            aria-labelledby={`event-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
};

const EventMaster: React.FC = () => {
    const theme = useTheme();
    const [tabValue, setTabValue] = useState(0);
    const user = getUserDetails();

    // Mock Data
    const [events, setEvents] = useState<Event[]>([
        {
            id: 'EVT001',
            title: 'Annual Town Hall 2026',
            description: 'Annual gathering of all employees to discuss company performance and future goals.',
            startDate: '2026-03-15T10:00',
            endDate: '2026-03-15T13:00',
            location: 'Main Auditorium',
            type: 'company',
            status: 'upcoming',
            createdBy: 'admin',
            createdAt: '2026-02-01'
        },
        {
            id: 'EVT002',
            title: 'Q1 Team Building',
            description: 'Departmental team building activities.',
            startDate: '2026-02-20T09:00',
            endDate: '2026-02-20T17:00',
            location: 'Resort Blue',
            type: 'department',
            status: 'upcoming',
            createdBy: 'hr_manager',
            createdAt: '2026-02-05'
        }
    ]);

    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: 'NOT001',
            title: 'System Maintenance',
            message: 'The HRMS will be down for maintenance on Saturday from 10 PM to 12 AM.',
            type: 'warning',
            audience: 'all',
            expiryDate: '2026-02-15',
            createdBy: 'admin',
            createdAt: '2026-02-10'
        },
        {
            id: 'NOT002',
            title: 'Tax Declaration Deadline',
            message: 'Please submit your tax declarations by end of this week.',
            type: 'info',
            audience: 'all',
            expiryDate: '2026-02-28',
            createdBy: 'finance',
            createdAt: '2026-02-01'
        }
    ]);

    const [news, setNews] = useState<News[]>([
        {
            id: 'NWS001',
            headline: 'New Branch Opening in Bangalore',
            content: 'We are thrilled to announce the opening of our new state-of-the-art facility in Bangalore...',
            publishDate: '2026-02-08',
            author: 'CEO Office',
            createdAt: '2026-02-08'
        }
    ]);

    // Dialog States
    const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
    const [isNotificationDialogOpen, setIsNotificationDialogOpen] = useState(false);
    const [isNewsDialogOpen, setIsNewsDialogOpen] = useState(false);

    // Form States (Simplified)
    const [currentEvent, setCurrentEvent] = useState<Partial<Event>>({});
    const [currentNotification, setCurrentNotification] = useState<Partial<Notification>>({});
    const [currentNews, setCurrentNews] = useState<Partial<News>>({});

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    // Event Handlers
    const handleOpenEventDialog = (event?: Event) => {
        if (event) {
            setCurrentEvent(event);
        } else {
            setCurrentEvent({
                type: 'company',
                status: 'upcoming',
                startDate: '',
                endDate: ''
            });
        }
        setIsEventDialogOpen(true);
    };

    const handleSaveEvent = () => {
        if (currentEvent.id) {
            setEvents(events.map(e => e.id === currentEvent.id ? { ...e, ...currentEvent as Event } : e));
        } else {
            const newEvent = {
                ...currentEvent,
                id: `EVT${Date.now()}`,
                createdBy: user?.username || 'system',
                createdAt: new Date().toISOString().split('T')[0]
            } as Event;
            setEvents([...events, newEvent]);
        }
        setIsEventDialogOpen(false);
    };

    // Notification Handlers
    const handleOpenNotificationDialog = (notification?: Notification) => {
        if (notification) {
            setCurrentNotification(notification);
        } else {
            setCurrentNotification({
                type: 'info',
                audience: 'all'
            });
        }
        setIsNotificationDialogOpen(true);
    };

    const handleSaveNotification = () => {
        if (currentNotification.id) {
            setNotifications(notifications.map(n => n.id === currentNotification.id ? { ...n, ...currentNotification as Notification } : n));
        } else {
            const newNotif = {
                ...currentNotification,
                id: `NOT${Date.now()}`,
                createdBy: user?.username || 'system',
                createdAt: new Date().toISOString().split('T')[0]
            } as Notification;
            setNotifications([...notifications, newNotif]);
        }
        setIsNotificationDialogOpen(false);
    };

    // News Handlers
    const handleOpenNewsDialog = (newsItem?: News) => {
        if (newsItem) {
            setCurrentNews(newsItem);
        } else {
            setCurrentNews({
                publishDate: new Date().toISOString().split('T')[0]
            });
        }
        setIsNewsDialogOpen(true);
    };

    const handleSaveNews = () => {
        if (currentNews.id) {
            setNews(news.map(n => n.id === currentNews.id ? { ...n, ...currentNews as News } : n));
        } else {
            const newNewsItem = {
                ...currentNews,
                id: `NWS${Date.now()}`,
                author: user?.name || 'system',
                createdAt: new Date().toISOString().split('T')[0]
            } as News;
            setNews([...news, newNewsItem]);
        }
        setIsNewsDialogOpen(false);
    };

    const handleDelete = (type: 'event' | 'notification' | 'news', id: string) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            if (type === 'event') setEvents(events.filter(e => e.id !== id));
            if (type === 'notification') setNotifications(notifications.filter(n => n.id !== id));
            if (type === 'news') setNews(news.filter(n => n.id !== id));
        }
    };

    return (
        <Box sx={{ width: '100%', p: 2 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: '#1a237e' }}>
                Event Management
            </Typography>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="event management tabs" textColor="primary" indicatorColor="primary">
                    <Tab icon={<EventIcon />} iconPosition="start" label="Events" />
                    <Tab icon={<NotificationIcon />} iconPosition="start" label="Notifications" />
                    <Tab icon={<NewsIcon />} iconPosition="start" label="News" />
                </Tabs>
            </Box>

            {/* Events Tab */}
            <TabPanel value={tabValue} index={0}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <TextField
                        placeholder="Search events..."
                        size="small"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ width: 300 }}
                    />
                    <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenEventDialog()}>
                        Create Event
                    </Button>
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' }, gap: 3 }}>
                    {events.map((event) => (
                        <Card key={event.id} sx={{ height: '100%', position: 'relative', transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 } }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                    <Chip
                                        label={event.status}
                                        color={event.status === 'upcoming' ? 'primary' : event.status === 'completed' ? 'success' : 'default'}
                                        size="small"
                                    />
                                    <Box>
                                        <IconButton size="small" onClick={() => handleOpenEventDialog(event)}><EditIcon fontSize="small" /></IconButton>
                                        <IconButton size="small" color="error" onClick={() => handleDelete('event', event.id)}><DeleteIcon fontSize="small" /></IconButton>
                                    </Box>
                                </Box>
                                <Typography variant="h6" gutterBottom>{event.title}</Typography>
                                <Typography variant="body2" color="text.secondary" paragraph>{event.description}</Typography>
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="caption" display="block">📅 {new Date(event.startDate).toLocaleString()} - {new Date(event.endDate).toLocaleString()}</Typography>
                                    <Typography variant="caption" display="block">📍 {event.location}</Typography>
                                    <Typography variant="caption" display="block">🏷️ {event.type.toUpperCase()}</Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            </TabPanel>

            {/* Notifications Tab */}
            <TabPanel value={tabValue} index={1}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <TextField
                        placeholder="Search notifications..."
                        size="small"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ width: 300 }}
                    />
                    <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenNotificationDialog()}>
                        Create Notification
                    </Button>
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                    {notifications.map((notif) => (
                        <Card key={notif.id} sx={{ borderLeft: `5px solid ${notif.type === 'error' ? 'red' : notif.type === 'warning' ? 'orange' : notif.type === 'success' ? 'green' : 'blue'}` }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <Typography variant="h6">{notif.title}</Typography>
                                    <Box>
                                        <IconButton size="small" onClick={() => handleOpenNotificationDialog(notif)}><EditIcon fontSize="small" /></IconButton>
                                        <IconButton size="small" color="error" onClick={() => handleDelete('notification', notif.id)}><DeleteIcon fontSize="small" /></IconButton>
                                    </Box>
                                </Box>
                                <Typography variant="body2" paragraph>{notif.message}</Typography>
                                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                    <Chip label={notif.type} size="small" variant="outlined" />
                                    <Chip label={`Audience: ${notif.audience}`} size="small" variant="outlined" />
                                    {notif.expiryDate && <Chip label={`Expires: ${notif.expiryDate}`} size="small" variant="outlined" />}
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            </TabPanel>

            {/* News Tab */}
            <TabPanel value={tabValue} index={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <TextField
                        placeholder="Search news..."
                        size="small"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ width: 300 }}
                    />
                    <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenNewsDialog()}>
                        Post News
                    </Button>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {news.map((item) => (
                        <Card key={item.id}>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="h5" color="primary">{item.headline}</Typography>
                                    <Box>
                                        <IconButton size="small" onClick={() => handleOpenNewsDialog(item)}><EditIcon fontSize="small" /></IconButton>
                                        <IconButton size="small" color="error" onClick={() => handleDelete('news', item.id)}><DeleteIcon fontSize="small" /></IconButton>
                                    </Box>
                                </Box>
                                <Typography variant="caption" color="text.secondary" gutterBottom>
                                    By {item.author} on {item.publishDate}
                                </Typography>
                                <Typography variant="body1" sx={{ mt: 2 }}>{item.content}</Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            </TabPanel>

            {/* Dialogs */}

            {/* Event Dialog */}
            <Dialog open={isEventDialogOpen} onClose={() => setIsEventDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>{currentEvent.id ? 'Edit Event' : 'Create Event'}</DialogTitle>
                <DialogContent dividers>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                        <TextField label="Event Title" fullWidth value={currentEvent.title || ''} onChange={(e) => setCurrentEvent({ ...currentEvent, title: e.target.value })} sx={{ gridColumn: 'span 2' }} />

                        <TextField label="Description" fullWidth multiline rows={3} value={currentEvent.description || ''} onChange={(e) => setCurrentEvent({ ...currentEvent, description: e.target.value })} sx={{ gridColumn: 'span 2' }} />

                        <TextField label="Start Date & Time" type="datetime-local" fullWidth InputLabelProps={{ shrink: true }} value={currentEvent.startDate || ''} onChange={(e) => setCurrentEvent({ ...currentEvent, startDate: e.target.value })} />

                        <TextField label="End Date & Time" type="datetime-local" fullWidth InputLabelProps={{ shrink: true }} value={currentEvent.endDate || ''} onChange={(e) => setCurrentEvent({ ...currentEvent, endDate: e.target.value })} />

                        <TextField label="Location" fullWidth value={currentEvent.location || ''} onChange={(e) => setCurrentEvent({ ...currentEvent, location: e.target.value })} />

                        <TextField select label="Type" fullWidth value={currentEvent.type || 'company'} onChange={(e) => setCurrentEvent({ ...currentEvent, type: e.target.value as EventType })}>
                            <MenuItem value="company">Company Wide</MenuItem>
                            <MenuItem value="department">Department</MenuItem>
                            <MenuItem value="team">Team</MenuItem>
                        </TextField>

                        <TextField select label="Status" fullWidth value={currentEvent.status || 'upcoming'} onChange={(e) => setCurrentEvent({ ...currentEvent, status: e.target.value as EventStatus })}>
                            <MenuItem value="upcoming">Upcoming</MenuItem>
                            <MenuItem value="ongoing">Ongoing</MenuItem>
                            <MenuItem value="completed">Completed</MenuItem>
                            <MenuItem value="cancelled">Cancelled</MenuItem>
                        </TextField>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsEventDialogOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSaveEvent}>Save</Button>
                </DialogActions>
            </Dialog>

            {/* Notification Dialog */}
            <Dialog open={isNotificationDialogOpen} onClose={() => setIsNotificationDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{currentNotification.id ? 'Edit Notification' : 'Create Notification'}</DialogTitle>
                <DialogContent dividers>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                        <TextField label="Title" fullWidth value={currentNotification.title || ''} onChange={(e) => setCurrentNotification({ ...currentNotification, title: e.target.value })} sx={{ gridColumn: 'span 2' }} />

                        <TextField label="Message" fullWidth multiline rows={3} value={currentNotification.message || ''} onChange={(e) => setCurrentNotification({ ...currentNotification, message: e.target.value })} sx={{ gridColumn: 'span 2' }} />

                        <TextField select label="Type" fullWidth value={currentNotification.type || 'info'} onChange={(e) => setCurrentNotification({ ...currentNotification, type: e.target.value as NotificationType })}>
                            <MenuItem value="info">Info</MenuItem>
                            <MenuItem value="warning">Warning</MenuItem>
                            <MenuItem value="error">Error</MenuItem>
                            <MenuItem value="success">Success</MenuItem>
                        </TextField>

                        <TextField select label="Audience" fullWidth value={currentNotification.audience || 'all'} onChange={(e) => setCurrentNotification({ ...currentNotification, audience: e.target.value as AudienceType })}>
                            <MenuItem value="all">All Employees</MenuItem>
                            <MenuItem value="role">Specific Role</MenuItem>
                            <MenuItem value="specific">Specific Users</MenuItem>
                        </TextField>

                        <TextField label="Expiry Date" type="date" fullWidth InputLabelProps={{ shrink: true }} value={currentNotification.expiryDate || ''} onChange={(e) => setCurrentNotification({ ...currentNotification, expiryDate: e.target.value })} sx={{ gridColumn: 'span 2' }} />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsNotificationDialogOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSaveNotification}>Save</Button>
                </DialogActions>
            </Dialog>

            {/* News Dialog */}
            <Dialog open={isNewsDialogOpen} onClose={() => setIsNewsDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>{currentNews.id ? 'Edit News' : 'Post News'}</DialogTitle>
                <DialogContent dividers>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                        <TextField label="Headline" fullWidth value={currentNews.headline || ''} onChange={(e) => setCurrentNews({ ...currentNews, headline: e.target.value })} sx={{ gridColumn: 'span 2' }} />

                        <TextField label="Content" fullWidth multiline rows={5} value={currentNews.content || ''} onChange={(e) => setCurrentNews({ ...currentNews, content: e.target.value })} sx={{ gridColumn: 'span 2' }} />

                        <TextField label="Publish Date" type="date" fullWidth InputLabelProps={{ shrink: true }} value={currentNews.publishDate || ''} onChange={(e) => setCurrentNews({ ...currentNews, publishDate: e.target.value })} />

                        <TextField label="Author" fullWidth value={currentNews.author || ''} onChange={(e) => setCurrentNews({ ...currentNews, author: e.target.value })} />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsNewsDialogOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSaveNews}>Publish</Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
};

export default EventMaster;
