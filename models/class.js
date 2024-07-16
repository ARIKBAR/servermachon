const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: { type: String, required: true },
  grade: { type: String, required: true },
  teacher: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  countStudents: { type: Number }
});

module.exports = mongoose.model('Class', classSchema);