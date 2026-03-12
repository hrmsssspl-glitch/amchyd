import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Card,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Button,
    Avatar,
    Chip,
    IconButton,
    Switch,
    TextField,
    InputAdornment,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
    Add as AddIcon,
    MoreVert as MoreVertIcon,
    FileUpload as FileUploadIcon,
    FileDownload as FileDownloadIcon
} from '@mui/icons-material';
import { User, UserRole } from '../types';
import { getUserDetails } from '../auth/authService';

interface UserData {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    status: 'active' | 'inactive';
    lastLogin: string;
    employeeId: string;
}

const initialUsers: UserData[] = [
    { id: '1', name: 'Super Admin', email: 'admin@hrms.com', role: 'superadmin', status: 'active', lastLogin: '2026-02-05 10:30', employeeId: 'EMP001' },
    { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', role: 'hr_manager', status: 'active', lastLogin: '2026-02-04 15:45', employeeId: 'EMP002' },
    { id: '3', name: 'Mike Johnson', email: 'mike.j@example.com', role: 'employee', status: 'inactive', lastLogin: '2026-01-28 09:12', employeeId: 'EMP003' },
    { id: '4', name: 'Sarah Wilson', email: 'sarah.w@example.com', role: 'employee', status: 'active', lastLogin: '2026-02-05 08:00', employeeId: 'EMP004' },
    { id: '5', name: 'Robert Brown', email: 'robert.b@example.com', role: 'employee', status: 'active', lastLogin: '2026-02-03 11:20', employeeId: 'EMP005' },
];

const Users: React.FC = () => {
    const [users, setUsers] = useState<UserData[]>(initialUsers);
    const [searchTerm, setSearchTerm] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [newUser, setNewUser] = useState<Partial<UserData>>({
        name: '',
        email: '',
        role: 'employee',
        employeeId: '',
        status: 'active'
    });
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const user = getUserDetails();
        setCurrentUser(user);
    }, []);

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenDialog = () => {
        setNewUser({
            name: '',
            email: '',
            role: 'employee',
            employeeId: '',
            status: 'active'
        });
        setError('');
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        const { name, value } = e.target;
        setNewUser(prev => ({ ...prev, [name as string]: value }));
    };

    const getAllowedRoles = (): UserRole[] => {
        if (!currentUser) return [];

        switch (currentUser.role) {
            case 'superadmin':
                // Super admin can Create all roles
                return ['admin', 'hr_manager', 'employee'];
            case 'admin':
                // Admin Can Create Hr Manager and employees
                return ['hr_manager', 'employee'];
            case 'hr_manager':
                // Hr Manager can create Employee
                return ['employee'];
            default:
                return [];
        }
    };

    const downloadTemplate = () => {
        const headers = ['Employee ID', 'Name', 'Email', 'Role', 'Status'];
        const exampleRow = ['EMP123', 'Sample Name', 'sample@example.com', 'employee', 'active'];

        let csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + exampleRow.join(",");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "user_import_template.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleAddUser = () => {
        if (!newUser.name || !newUser.email || !newUser.employeeId || !newUser.role) {
            setError('Please fill all fields');
            return;
        }

        const userExists = users.some(u => u.employeeId === newUser.employeeId);
        if (userExists) {
            setError('Employee ID already exists');
            return;
        }

        const addedUser: UserData = {
            id: (users.length + 1).toString(),
            name: newUser.name!,
            email: newUser.email!,
            role: newUser.role as UserRole,
            status: newUser.status as 'active' | 'inactive',
            lastLogin: 'Never',
            employeeId: newUser.employeeId!
        };

        setUsers([...users, addedUser]);
        setOpenDialog(false);
    };

    const exportToCSV = () => {
        const headers = ['Employee ID', 'Name', 'Email', 'Role', 'Status'];
        const rows = users.map(user => [
            user.employeeId,
            user.name,
            user.email,
            user.role,
            user.status
        ]);

        let csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "users_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            const lines = text.split('\n');
            const newUsersFromImport: UserData[] = [];

            // Skip header
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;

                const [empId, name, email, role, status] = line.split(',');

                if (empId && name && email && role) {
                    // Basic validation
                    if (!users.some(u => u.employeeId === empId)) {
                        newUsersFromImport.push({
                            id: (users.length + newUsersFromImport.length + 1).toString(),
                            employeeId: empId.trim(),
                            name: name.trim(),
                            email: email.trim(),
                            role: (role.trim().toLowerCase() as UserRole) || 'employee',
                            status: (status?.trim().toLowerCase() as 'active' | 'inactive') || 'active',
                            lastLogin: 'Never'
                        });
                    }
                }
            }

            if (newUsersFromImport.length > 0) {
                setUsers(prev => [...prev, ...newUsersFromImport]);
                alert(`Successfully imported ${newUsersFromImport.length} users.`);
            } else {
                alert('No new users to import or invalid file format.');
            }
        };
        reader.readAsText(file);
        // Reset file input
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const allowedRoles = getAllowedRoles();
    const canAddUsers = allowedRoles.length > 0;

    return (
        <Box sx={{ p: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Box>
                    <Typography variant="h4" fontWeight="800" sx={{ color: '#1e293b', mb: 1 }}>
                        User Management
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#64748b' }}>
                        Manage system access, roles, and user permissions
                    </Typography>
                </Box>
                <Box display="flex" gap={2}>
                    <input
                        type="file"
                        accept=".csv"
                        style={{ display: 'none' }}
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                    />
                    <Button
                        variant="contained"
                        startIcon={<FileDownloadIcon />}
                        onClick={downloadTemplate}
                        sx={{
                            borderRadius: '12px',
                            textTransform: 'none',
                            bgcolor: '#f1f5f9',
                            color: '#475569',
                            boxShadow: 'none',
                            '&:hover': { bgcolor: '#e2e8f0', boxShadow: 'none' }
                        }}
                    >
                        Template
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<FileUploadIcon />}
                        onClick={handleImportClick}
                        sx={{ borderRadius: '12px', textTransform: 'none', borderWeight: 2 }}
                    >
                        Import
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<FileDownloadIcon />}
                        onClick={exportToCSV}
                        sx={{ borderRadius: '12px', textTransform: 'none', borderWeight: 2 }}
                    >
                        Export
                    </Button>
                    {canAddUsers && (
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={handleOpenDialog}
                            sx={{
                                backgroundColor: '#6366f1',
                                '&:hover': { backgroundColor: '#4f46e5' },
                                borderRadius: '12px',
                                textTransform: 'none',
                                px: 3,
                                boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.39)'
                            }}
                        >
                            Add New User
                        </Button>
                    )}
                </Box>
            </Box>

            <Card sx={{ borderRadius: '15px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)', overflow: 'hidden', mb: 4 }}>
                <Box p={3} borderBottom="1px solid #f0f0f0">
                    <TextField
                        fullWidth
                        placeholder="Search by name, email or employee ID..."
                        variant="outlined"
                        size="small"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: '#999' }} />
                                </InputAdornment>
                            ),
                            sx: { borderRadius: '10px', backgroundColor: '#f8f9fa' }
                        }}
                    />
                </Box>

                <TableContainer>
                    <Table>
                        <TableHead sx={{ backgroundColor: '#f8f9fa' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: '700', color: '#666' }}>User Details</TableCell>
                                <TableCell sx={{ fontWeight: '700', color: '#666' }}>Employee ID</TableCell>
                                <TableCell sx={{ fontWeight: '700', color: '#666' }}>Role</TableCell>
                                <TableCell sx={{ fontWeight: '700', color: '#666' }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: '700', color: '#666' }}>Last Login</TableCell>
                                <TableCell sx={{ fontWeight: '700', color: '#666' }} align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <TableRow key={user.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell>
                                            <Box display="flex" alignItems="center" gap={2}>
                                                <Avatar sx={{ bgcolor: '#6366f1' }}>{user.name[0]}</Avatar>
                                                <Box>
                                                    <Typography fontWeight="600" variant="body1">{user.name}</Typography>
                                                    <Typography variant="caption" color="textSecondary">{user.email}</Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight="500">{user.employeeId}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={user.role.toUpperCase()}
                                                size="small"
                                                sx={{
                                                    backgroundColor: user.role === 'superadmin' ? '#fee2e2' : '#e0e7ff',
                                                    color: user.role === 'superadmin' ? '#991b1b' : '#3730a3',
                                                    fontWeight: '700',
                                                    fontSize: '0.7rem'
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <Switch
                                                    checked={user.status === 'active'}
                                                    size="small"
                                                    color="success"
                                                />
                                                <Typography variant="body2" color={user.status === 'active' ? 'success.main' : 'textSecondary'}>
                                                    {user.status === 'active' ? 'Active' : 'Inactive'}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="textSecondary">{user.lastLogin}</Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton size="small" sx={{ color: '#6366f1' }}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton size="small" sx={{ color: '#ef4444' }}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                        <Typography variant="body2" color="textSecondary">No users found</Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>

            {/* Add New User Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: '700', color: '#1e293b' }}>Add New User</DialogTitle>
                <DialogContent>
                    <Box display="flex" flexDirection="column" gap={2.5} mt={1}>
                        {error && <Alert severity="error">{error}</Alert>}
                        <TextField
                            label="Full Name"
                            name="name"
                            fullWidth
                            value={newUser.name}
                            onChange={handleInputChange}
                        />
                        <TextField
                            label="Email Address"
                            name="email"
                            type="email"
                            fullWidth
                            value={newUser.email}
                            onChange={handleInputChange}
                        />
                        <TextField
                            label="Employee ID (Login Username)"
                            name="employeeId"
                            fullWidth
                            value={newUser.employeeId}
                            onChange={handleInputChange}
                            helperText="This will be used as the login username"
                        />
                        <FormControl fullWidth>
                            <InputLabel>Role</InputLabel>
                            <Select
                                name="role"
                                value={newUser.role}
                                label="Role"
                                onChange={(e) => handleInputChange(e as any)}
                            >
                                {allowedRoles.map((role) => (
                                    <MenuItem key={role} value={role}>
                                        {role.charAt(0).toUpperCase() + role.slice(1)}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select
                                name="status"
                                value={newUser.status}
                                label="Status"
                                onChange={(e) => handleInputChange(e as any)}
                            >
                                <MenuItem value="active">Active</MenuItem>
                                <MenuItem value="inactive">Inactive</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={handleCloseDialog} sx={{ color: '#64748b' }}>Cancel</Button>
                    <Button
                        onClick={handleAddUser}
                        variant="contained"
                        sx={{ bgcolor: '#6366f1', '&:hover': { bgcolor: '#4f46e5' } }}
                    >
                        Create User
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Users;
