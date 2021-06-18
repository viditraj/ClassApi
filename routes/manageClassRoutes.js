const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const classController = require('../controllers/classController');
const router = express.Router({mergeParams:true});
router.use(authController.protect);

router.use(authController.restrictTo('teacher')); // Routes after this are only accessible by techer
router
  .route('/')
  .get(userController.getAllStudents)
  .post(classController.register)

router
  .route('/:id')
  .get(authController.checkUser,userController.getUser)
  .patch(authController.checkUser,userController.updateUser)
  .delete(authController.checkUser,userController.removeStudent);

module.exports = router;