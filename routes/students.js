const express = require('express');
const cors = require('cors');

const router = express.Router();
const Student = require('../models/student'); // וודא שהנתיב נכון
router.use(cors())
// קבלת כל התלמידים
router.get('/', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// הוספת תלמיד חדש
router.post('/', async (req, res) => {
  try {
    console.log('Attempting to save student:', req.body);
    const student = new Student(req.body);
    const newStudent = await student.save();
    console.log('Student saved successfully:', newStudent);
    res.status(201).json(newStudent);
  } catch (err) {
    console.error('Error saving student:', err);
    res.status(400).json({ message: err.message });
  }
});
//עדכון פרטי תלמיד
router.put('/:id', async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedStudent) {
      return res.status(404).json({ message: 'תלמיד לא נמצא' });
    }
    res.json(updatedStudent);
  } catch (error) {
    res.status(500).json({ message: 'שגיאת שרת', error: error.message });
  }
});

// קבלת תלמיד ספציפי לפי ID
router.get('/:id', async (req, res) => {
  try {
    console.log('Received request for student ID:', req.params.id);
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'תלמיד לא נמצא' });
    }
    res.json(student);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: err.message });
  }
});
//מחיקת כל הנתונים
router.delete('/deleteAll', async (req, res) => {
  try {
    const result = await Student.deleteMany({});
    console.log('Delete result:', result);
    res.json({ message: 'All students deleted successfully', count: result.deletedCount });
  } catch (error) {
    console.error('Error deleting all students:', error);
    res.status(500).json({ message: 'שגיאה בשרת', error: error.message });
  }
});
//מחיקת תלמיד לפי id
router.delete('/:id', async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    if (!deletedStudent) {
      return res.status(404).json({ message: 'תלמיד לא נמצא' });
    }
    res.json({ message: 'תלמיד נמחק בהצלחה', deletedStudent });
  } catch (error) {
    res.status(500).json({ message: 'שגיאה בשרת', error: error.message });
  }
});
// העלאת קובץ excle
router.post('/bulk', async (req, res) => {
  try {
    const students = req.body;
    const result = await Student.insertMany(students);
    res.json({ message: 'Data uploaded successfully', count: result.length });
  } catch (error) {
    console.error('Error uploading bulk data:', error);
    res.status(500).json({ message: 'Error uploading data', error: error.message });
  }
});

module.exports = router;