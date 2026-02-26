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
const uploadRoutes = require('./routes/uploadRoutes');
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
app.use('/api/upload', uploadRoutes);

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

