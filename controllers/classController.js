const User = require('./../models/userModel');
const Classroom = require('./../models/classModel');
const factory = require('../models/handlerFactory');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');




exports.getAllClass = factory.getAll(Classroom);
exports.getClass = factory.getOne(Classroom, { path: 'students' ,select: '_id name'});
exports.createClass = factory.createOne(Classroom);
exports.updateClass = factory.updateOne(Classroom);
exports.deleteClass = factory.deleteOne(Classroom);

exports.register = catchAsync(async(req,res,next)=>{
    const classroom = await Classroom.findById(req.body.class);
    if(!classroom) return next(new AppError('No class with that id found,try again with valid class Id',404));
    const check = await User.find({
        "classes":req.body.class
    })
    check.forEach(el=>{
        if(el._id == req.user.id)
        return next(new AppError('Already registered for this class',400));
    });
 
    const updatedStudent = await User.findByIdAndUpdate(req.user._id,{
      $addToSet :{classes:req.body.class}
    });
    const updatedClass = await Classroom.findByIdAndUpdate(classroom,{
        $addToSet:{students:updatedStudent._id}
      });
    res.status(200).json({
        status:"success",
        data: updatedStudent
    });
 });

