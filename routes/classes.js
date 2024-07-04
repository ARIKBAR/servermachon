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
    const classes = await Class.find().populate('students');
    console.log('Classes fetched:', classes); // הוסף את זה
    res.json(classes);
  } catch (error) {
    console.error('Error fetching classes:', error); // שנה את זה
    res.status(500).json({ message: error.message, stack: error.stack });
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
router.delete('/deleteAll', async (req, res) => {
  try {
    const result = await Class.deleteMany({});
    console.log('Delete result:', result);
    res.json({ message: 'All Class deleted successfully', count: result.deletedCount });
  } catch (error) {
    console.error('Error deleting all Class:', error);
    res.status(500).json({ message: 'שגיאה בשרת', error: error.message });
  }
});

//מחיקת כיתה לפי id
router.delete('/:id', async (req, res) => {
  try {
    const deletedClass = await Class.findByIdAndDelete(req.params.id);
    if (!deletedClass) {
      return res.status(404).json({ message: 'כיתה יד לא נמצא' });
    }
    res.json({ message: 'כיתה נמחק בהצלחה', deletedClass });
  } catch (error) {
    res.status(500).json({ message: 'שגיאה בשרת', error: error.message });
  }
});

module.exports = router;