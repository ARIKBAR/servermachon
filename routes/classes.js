const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Class = require('../models/class');
const Student = require('../models/student');

// יצירת כיתה חדשה
router.post('/', async (req, res) => {
  try {
    const newClass = new Class(req.body);
    console.log(newClass);
    const savedClass = await newClass.save();
    res.status(201).json(savedClass);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});



// קבלת כל הכיתות עם התלמידים שלהם
router.get('/', async (req, res) => {
  try {
    const classes = await Class.find();
    // const students = await Student.aggregate([{$group:{_id:{
    //   class:"$class"
    // }, count : {$sum : 1}}}]);
    const students = await Student.find();
    let obj = {};
    students.forEach(v=>{
      obj[v.class] = obj[v.class] ? obj[v.class] + 1 : 1; 
    })
    // classes.forEach(item=>{
    //   item.countStudents = students.find(st=>st._id.class.toString() == item._id).count
    // })
    console.log(students)
    console.log(classes)
    res.json(classes);
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ message: error.message, stack: error.stack });
  }
});
//קבלת כמות תלמידים בכיתה
// router.get('/count/:classId', async (req, res) => {
//   try {
//     const classId = req.params.classId;
    
//     // בדיקה שה-ID תקין
//     if (!mongoose.Types.ObjectId.isValid(classId)) {
//       return res.status(400).json({ message: 'Invalid class ID' });
//     }

//     const studentCount = await Student.countDocuments({ class: classId });
    
//     res.json({ classId: classId, studentCount: studentCount });
//   } catch (error) {
//     console.error('Error counting students:', error);
//     res.status(500).json({ message: error.message, stack: error.stack });
//   }
// });

// קבלת כיתה ספציפית
router.get('/:id', async (req, res) => {
  try {
    const classItem = await Class.findById(req.params.id);
    if (!classItem) return res.status(404).json({ message: 'כיתה לא נמצאה' });
    res.json(classItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// עדכון כיתה
// router.put('/:id', async (req, res) => {
//   try {
//     const updatedClass = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     res.json(updatedClass);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// הוספת תלמיד לכיתה
// router.post('/:classId/students/:studentId', async (req, res) => {
//   try {
//     const classItem = await Class.findById(req.params.classId);
//     const student = await Student.findById(req.params.studentId);

//     if (!classItem || !student) {
//       return res.status(404).json({ message: 'כיתה או תלמיד לא נמצאו' });
//     }

//     classItem.students.push(student._id);
//     student.class = classItem._id;

//     await classItem.save();
//     await student.save();

//     res.json({ message: 'תלמיד נוסף לכיתה בהצלחה' });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });
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