const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const crewRoutes = require('./routes/crew');
const adminRoutes = require('./routes/admin');
const attendanceRoutes = require('./routes/attendance');
const todosRoutes = require('./routes/todos');
const uploadRoutes = require('./routes/upload');
const publicRoutes = require('./routes/public');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/auth', authRoutes);
app.use('/crew', crewRoutes);
app.use('/admin', adminRoutes);
app.use('/attendance', attendanceRoutes);
app.use('/todos', todosRoutes);
app.use('/upload', uploadRoutes);
app.use('/', publicRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on PORT: ${PORT}`);
});
