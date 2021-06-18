const express = require('express');
const cors =require('cors');
const path = require('path');
const AppError = require('./utils/appError');
const globalErrorHandler = require(path.join(__dirname, 'controllers/errorController'));
const classRouter = require(path.join(__dirname, 'routes/classRoutes'));
const manageClassRouter = require(path.join(__dirname, 'routes/manageClassRoutes'));
const userRouter = require(path.join(__dirname,'routes/userRoutes'));
const app = express();

app.use(express.json());
app.enable('trust proxy');
app.use(cors()); // Cors is used to enable Cross Origin Requests
app.options('*', cors());
app.use(require('body-parser').json()); 
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

//ROUTES
app.use('/api/v1/classes', classRouter);
app.use('/api/v1/users', userRouter);


app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  });

app.use(globalErrorHandler);

process.on('uncaughtException' , err =>{ // It will listen to event ,If there are any Uncaught Exception occurs then our app will call this err function,close the server and then exit
     console.log(err);
     console.log('Uncaught Exception Occured!Shutting Down...');
    process.exit(1);
 });

 app.all('*' ,(req,res,next)=>{
    next(new AppError(`Can't find ${req.originalUrl} on this server!💥`,404)); //Anything passed as parameter in next() express treats it as error and calls error handling function
 });
 
 
 module.exports = app;