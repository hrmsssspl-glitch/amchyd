
export interface LeaveTypeConfig {
    id: string;
    code: string;
    name: string;
    daysAllowed: number;
    description: string;
    isPaid: boolean;
    status: 'Active' | 'Inactive';
}

const STORAGE_KEY = 'hrms_leave_types';

export const defaultLeaveTypes: LeaveTypeConfig[] = [
    { id: '1', code: 'CL', name: 'Casual Leave', daysAllowed: 12, description: 'For personal matters', isPaid: true, status: 'Active' },
    { id: '2', code: 'SL', name: 'Sick Leave', daysAllowed: 10, description: 'Medical reasons', isPaid: true, status: 'Active' },
    { id: '3', code: 'ESI', name: 'ESI Leave', daysAllowed: 0, description: 'ESI Medical Leave', isPaid: true, status: 'Active' },
    { id: '4', code: 'EL', name: 'Earned Leave', daysAllowed: 15, description: 'Privilege Leave', isPaid: true, status: 'Active' },
    { id: '5', code: 'CO', name: 'Compensatory Off', daysAllowed: 0, description: 'Work on holiday', isPaid: true, status: 'Active' },
    { id: '6', code: 'ML/PL', name: 'Maternity / Paternity Leave', daysAllowed: 180, description: 'Parental Leave', isPaid: true, status: 'Active' },
    { id: '7', code: 'AL', name: 'Accident Leave', daysAllowed: 0, description: 'Workplace accident', isPaid: true, status: 'Active' },
    { id: '8', code: 'OD', name: 'On Duty / Tour', daysAllowed: 0, description: 'Official work', isPaid: true, status: 'Active' },
    { id: '9', code: 'EDU', name: 'Educational Leave', daysAllowed: 0, description: 'Exams/Studies', isPaid: false, status: 'Active' },
    { id: '10', code: 'TRN', name: 'On Training', daysAllowed: 0, description: 'Training program', isPaid: true, status: 'Active' }
];

export const getLeaveTypes = (): LeaveTypeConfig[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultLeaveTypes));
        return defaultLeaveTypes;
    }
    try {
        return JSON.parse(stored);
    } catch (e) {
        return defaultLeaveTypes;
    }
};

export const saveLeaveTypes = (types: LeaveTypeConfig[]): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(types));
    // Trigger storage event for other components to update if they listen
    window.dispatchEvent(new Event('leaveTypesUpdated'));
};
