const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Teacher = require('../models/teacher');

router.post('/', async (req, res) => {
    try {
      const newTeacher = new Teacher(req.body);
      const savedTeacher = await newTeacher.save();
      console.log(newTeacher);
      if (req.body.class) {
        const updatedClass = await Class.findByIdAndUpdate(
          req.body.class,
          { $push: { students: savedStudent._id } },
          { new: true }
        );
        console.log('Updated class:', updatedClass); // הוסף את זה
      }
      res.status(201).json(savedTeacher);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  router.get('/',async(req,res)=>{
    try {
        const newTeacher= await Teacher.find()
        res.json(newTeacher)
    } catch (error) {
        res.status(500).json({ message: err.message });
    }
  })
  module.exports = router;