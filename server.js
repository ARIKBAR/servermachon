const express = require('express');
const connectDB = require('./db');
const cors = require('cors');
const path=require('path')
const studentRoutes = require('./routes/students');
const classRoutes = require('./routes/classes');
const teacherRoutes=require('./routes/teachers')



const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/students', studentRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/uploads', express.static(path.join(__dirname,'uploads')));







const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));