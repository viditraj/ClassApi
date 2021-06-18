const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

// Protect all routes after this middleware ie only logged in users can accesss
router.use(authController.protect);

router.get('/me', userController.getMe, userController.getUser);
router.get('/myClasses',authController.restrictTo('student'),userController.getClasses);

router.use(authController.restrictTo('instructor'));  // Routes after this are only accessible by instructors

router
  .route('/')
  .get(userController.getAllUsers);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
