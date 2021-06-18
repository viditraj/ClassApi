const dotenv = require('dotenv'); // package to access enviroment variables
const app =require('./app');


console.log(__dirname );
dotenv.config({path :'./config.env'}); // reading the enviroment variables from config file
const DB = process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD); 
const mongoose = require('mongoose');
//DATABASE CONNECTION METHOD
mongoose.connect(DB,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => console.log('Connected to database successfully!'));


const port = process.env.PORT;
const server = app.listen(port,()=>{
    console.log(`App running on port ${port}...`);
});

// In case of Unhanlded Eejections

process.on('unhandledRejection' , err =>{ // It will listen to event ,If there are any unhandled Rejections then our app will call this err function,close the server and then exit
   console.log(err.name, err.message);
   console.log('Unexpected Event Occured!Shutting Down...');
    server.close(()=>{
   process.exit(1);
  });
});