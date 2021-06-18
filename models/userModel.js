const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs'); //npm i bcryptjs -> used to encrypt fields like passwords etc

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'Please tell us your name!']
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email']
    },
    role: {
      type: String,
      enum: ['student', 'teacher', 'instructor'],
      required:[true,'Your must enter your role']
    },
    classes: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Classroom'
      }
   ],
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 8,
      select: false
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      //This will only work on .create() or .save()
      validate: {
        validator : function(el){
          return el === this.password;
        },
        message: "Password didn't match 💤"
      }
    }
  },
    {
      toJSON: { virtuals: true },
      toObject: { virtuals: true }
    }
  );

userSchema.virtual('students', {
    ref: 'Classroom',
    foreignField: 'students',
    localField: '_id'
  });

//PASSWORD ENCRYPTION// 
userSchema.pre('save', async function(next){
  if(!this.isModified('password')) return next(); // This checks if the password is created or changed..if the User has not changed the password then no need to encrypt it again.It will simply return and call next middleware function
  this.password = await bcrypt.hash(this.password , 12); 
  //after password validation we don't need passwordConfirm hence destroying it before storing in DB.benefit: no need to encrypt it and is more secure
  this.passwordConfirm = undefined;
  next();
});


//PASSWORD COMPARISON
userSchema.methods.correctPassword = async function(candidatePass , userPass){
  return await bcrypt.compare(candidatePass , userPass) // return TRUE if password matches otherwise FASLE
};

const User = mongoose.model('User', userSchema);

module.exports = User;