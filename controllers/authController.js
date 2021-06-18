
const {promisify} = require('util'); // It is a built in Node module containing promisify
const jwt = require('jsonwebtoken'); // it used for signin purpose..Do read more about JWT later
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const crypto = require('crypto');
const { fail } = require('assert');

//***********************UTILITY function to create new tokens based on ID as parameter********************//
const signToken = id => {
    const token = jwt.sign({id:id},process.env.JWT_SECRET,{
        expiresIn :process.env.JWT_EXPIRES_IN
       });
       return token;
};

//***********************UTILITY function to send TOKEN********************//
const sendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
  
    // Remove password from output
    user.password = undefined;
  
    res.status(statusCode).json({
      status: 'success',
      token,
      data: {
        user
      }
    });
  };
//*********************************SIGN UP Function to create new user in DB****************************//
exports.signup = catchAsync(async(req, res , next)=>{
   const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role:req.body.role
    });
   sendToken(user,200,res);
    });

//*************************LOGIN Function to login users****************************//

exports.login = catchAsync(async (req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;

    // 1. Check if email and password exists
    if(!email||!password) return next(new AppError('Please provide email and password to login',404));

    // 2. Check if details are valid and exists in DB or not
    const user = await User.findOne({email : email}).select('+password'); //Here selecting password explicitly becoz by default password selection is set to false
   if(!user|| !await user.correctPassword(password,user.password)){  // it will only check for password if there is valid email/user otherwise not
       return next(new AppError('Incorrect Email or Password',401));
   }
   else{
    // 3. On success send JWT token to client
    sendToken(user,200,res);
}
});


exports.logout = (req, res) => {
  try{
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ status: 'success' });
}catch(err){
  console.log(err);
}
};

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  else token = 0;
  if (token==0) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }
  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});


exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['teacher', 'instructor']. role='user'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    next();
  };
};

exports.checkUser = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if(user.role!='student')
    return next(new AppError(`You do not have permissions to edit users with role: ${user.role}`));
 
    next();
  
});