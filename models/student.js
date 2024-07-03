const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  created: { type: String, required: false },
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  shlucha:String,
  maslul:String,
  nameMishpacha: { type: String, required: true },
  namePrati: { type: String, required: true },
  id: { type: String, required: true, unique: true },
  tl: { type: String, required: true },
  tlhw: { type: String, required: true },
  nameAv:String,
  addres: String,
  city: String,
  phone: String,
  telphon:String,
  email:String,
  statusp:String,
  classes:String,
  paymentMethod: String,
  paymentesder:String,
  creditCardNumber: String,
  creditCardExpiry: String,
  creditCardCVV: String,
  notes: String,
  courses: [{
    name: String,
    hours: String,
    grade: String
  }]
});

module.exports = mongoose.model('Student', studentSchema);