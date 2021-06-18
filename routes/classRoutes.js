const express = require('express');
const classController = require('../controllers/classController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const manageClassRouter = require('./manageClassRoutes');

const router = express.Router();


router.use('/:classId/manageClass',manageClassRouter);

router.route('/register').post(authController.protect,authController.restrictTo('student'),classController.register);
router
  .route('/')
  .get(classController.getAllClass)
  .post(authController.protect,authController.restrictTo('instructor'),classController.createClass)
router
  .route('/:id')
  .get(authController.protect,authController.restrictTo('teacher','instructor'),classController.getClass)
  .patch(
   authController.protect,
   authController.restrictTo('instructor'),
    classController.updateClass
  )
  router.route('/:id').delete(
    authController.protect,
    authController.restrictTo('instructor'),
    classController.deleteClass
  );


module.exports = router;
