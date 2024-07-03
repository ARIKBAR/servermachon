const express = require('express');
const router = express.Router();
const Class = require('../models/class');
const Student = require('../models/student');

// יצירת כיתה חדשה
router.post('/', async (req, res) => {
  try {
    const newClass = new Class(req.body);
    const savedClass = await newClass.save();
    res.status(201).json(savedClass);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// קבלת כל הכיתות
router.get('/', async (req, res) => {
  try {
    const classes = await Class.find();
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// קבלת כיתה ספציפית
router.get('/:id', async (req, res) => {
  try {
    const classItem = await Class.findById(req.params.id).populate('students');
    if (!classItem) return res.status(404).json({ message: 'כיתה לא נמצאה' });
    res.json(classItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// עדכון כיתה
router.put('/:id', async (req, res) => {
  try {
    const updatedClass = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedClass);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// הוספת תלמיד לכיתה
router.post('/:classId/students/:studentId', async (req, res) => {
  try {
    const classItem = await Class.findById(req.params.classId);
    const student = await Student.findById(req.params.studentId);

    if (!classItem || !student) {
      return res.status(404).json({ message: 'כיתה או תלמיד לא נמצאו' });
    }

    classItem.students.push(student._id);
    student.class = classItem._id;

    await classItem.save();
    await student.save();

    res.json({ message: 'תלמיד נוסף לכיתה בהצלחה' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;