const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('./userModel');
// const validator = require('validator');

const classSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: [true, 'A class must have a name'],
      trim: true
    },
    teacher: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    students:[
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ] 
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

classSchema.virtual('classes', {
    ref: 'User',
    foreignField: 'classes',
    localField: '_id'
  });



// QUERY MIDDLEWARE

classSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'teacher',
    select: '-__v -passwordChangedAt -classes -email -role'
  });

  next();
});
classSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'students',
    select: '-__v -passwordChangedAt -classes -email -role'
  });
  next();
});


const Classroom = mongoose.model('Classroom', classSchema);

module.exports = Classroom;
