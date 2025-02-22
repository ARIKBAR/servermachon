const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const mongoose = require ('mongoose')
const { ObjectId} = mongoose.Types;

const router = express.Router();
const Student = require('../models/student'); // וודא שהנתיב נכון
router.use(cors())

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // הגדר את התיקייה שבה יישמרו הקבצים
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) // שם הקובץ יהיה הזמן הנוכחי + הסיומת המקורית
  }
});

const upload = multer({ storage: storage });

// קבלת כל התלמידים
router.get('/', async (req, res) => {
  try {
    const students = await Student.find().populate("class");
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// קבלת תלמידים לפי כיתה
router.get('/byClass/:classID', async (req, res) => {
  try {
    const students = await Student.find({'class': new ObjectId(req.params.classID)})
      .populate("class");
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// הוספת תלמיד חדש
// router.post('/', async (req, res) => {
//   try {
//     const student = new Student(req.body);
//     const savedStudent = await student.save();
//     console.log('Saved student:', savedStudent); // הוסף את זה

//     if (req.body.class) {
//       const updatedClass = await Class.findByIdAndUpdate(
//         req.body.class,
//         { $push: { students: savedStudent._id } },
//         { new: true }
//       );
//       console.log('Updated class:', updatedClass); // הוסף את זה
//     }

//     res.status(201).json(savedStudent);
//   } catch (err) {
//     console.error('Error creating student:', err); // שנה את זה
//     res.status(400).json({ message: err.message, stack: err.stack });
//   }
// });
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const studentData = req.body;
    
    // אם יש קובץ, הוסף את הנתיב ושם הקובץ לנתוני התלמיד
    if (req.file) {
      studentData.fileLink = req.file.path;
      studentData.fileName = req.file.originalname;
    }

    const student = new Student(studentData);
    const savedStudent = await student.save();
    console.log('Saved student:', savedStudent);

    if (req.body.class) {
      const updatedClass = await Class.findByIdAndUpdate(
        req.body.class,
        { $push: { students: savedStudent._id } },
        { new: true }
      );
      console.log('Updated class:', updatedClass);
    }

    res.status(201).json(savedStudent);
  } catch (err) {
    console.error('Error creating student:', err);
    res.status(400).json({ message: err.message, stack: err.stack });
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