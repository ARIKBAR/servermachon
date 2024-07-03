const express = require('express');
const connectDB = require('./db');
const cors = require('cors');
const studentRoutes = require('./routes/students'); // הוסף את זה
const classRoutes = require('./routes/classes');

const app = express();
app.use(cors());
app.use(express.json());

// התחבר למסד הנתונים
connectDB();

// הוסף את זה: הגדרת הנתיבים
app.use('/api/students', studentRoutes);
app.use('/api/classes', classRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));