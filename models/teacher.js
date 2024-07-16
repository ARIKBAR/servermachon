const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  nameMishpacha: { type: String, required: true },
  namePrati: { type: String, required: true },
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Teacher', teacherSchema);