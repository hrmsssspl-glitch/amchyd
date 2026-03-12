const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const organizationRoutes = require('./routes/organizationRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const assetRoutes = require('./routes/assetRoutes');
const engineRoutes = require('./routes/engineRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const duplicateRoutes = require('./routes/duplicateRoute');

// HRMS Routes
const hrmsAttendanceRoutes = require('./routes/hrms/attendance');
const hrmsDashboardRoutes = require('./routes/hrms/dashboard');
const hrmsEmployeesRoutes = require('./routes/hrms/employees');
const hrmsOrganizationRoutes = require('./routes/hrms/organization');
const hrmsPayrollRoutes = require('./routes/hrms/payroll');
const hrmsPermissionsRoutes = require('./routes/hrms/permissions');
const hrmsRecruitmentRoutes = require('./routes/hrms/recruitment');
const hrmsUsersRoutes = require('./routes/hrms/users');
const hrmsMetadataRoutes = require('./routes/hrms/metadata');

const path = require('path');

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(fileUpload());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/engines', engineRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/check-duplicate', duplicateRoutes);

// Mount HRMS Routes
app.use('/api/hrms/attendance', hrmsAttendanceRoutes);
app.use('/api/hrms/dashboard', hrmsDashboardRoutes);
app.use('/api/hrms/employees', hrmsEmployeesRoutes);
app.use('/api/hrms/organization', hrmsOrganizationRoutes);
app.use('/api/hrms/payroll', hrmsPayrollRoutes);
app.use('/api/hrms/permissions', hrmsPermissionsRoutes);
app.use('/api/hrms/recruitment', hrmsRecruitmentRoutes);
app.use('/api/hrms/users', hrmsUsersRoutes);
app.use('/api/hrms/metadata', hrmsMetadataRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;

