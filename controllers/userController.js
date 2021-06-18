const User = require('./../models/userModel');
const Classroom = require('./../models/classModel');
const factory = require('./../models/handlerFactory');
const catchAsync =require('./../utils/catchAsync');
const AppError = require('../utils/appError');


exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
  };



  exports.getUser = factory.getOne(User);
  exports.getAllUsers = factory.getAll(User);
  exports.updateUser = factory.updateOne(User);
  exports.deleteUser = factory.deleteOne(User);


  exports.getAllStudents = catchAsync(async(req,res)=>{
    const classroom = await Classroom.findById(req.params.classId);
    let Data
    if(classroom.students.length==0){
      Data = "No Students enrolled for this class"
    }
    else 
      Data = classroom.students;
    res.status(200).json({
        status:"success",
        data:{
            Data
        }
    });
});
  
exports.getClasses = catchAsync(async(req,res)=>{
  const Student = await User.findById(req.user.id).populate({ path: 'classes' , select :'-students -__v -teacher'});
  let Classes
  if(Student.classes.length==0)
    Classes ="You are not enrolled in any class,Register to enroll in class"
  else
   Classes = Student.classes
  res.status(200).json({
    status:"success",
    data:{
      Classes
    }
  });
});

exports.removeStudent = catchAsync(async (req,res,next)=>{
  const Student = await User.findByIdAndUpdate(req.params.id, { $pull: { 'classes': req.params.classId  } }
  );
  const updatedStudent = await User.find({"classes":req.params.classId});
  if(updatedStudent.length==0)
  return next(new AppError('This student is already been deregistered',404))

  res.status(200).json({
    status:'success',
    data:{
      data:'Student successfully unenrolled'
    }
  });

})