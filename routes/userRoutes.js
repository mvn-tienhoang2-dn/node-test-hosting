const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/sign-up', authController.signup);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);
router.patch(
  '/change-password',
  authController.protect,
  authController.changePassword
);
// Signin MiddleWare
router.use(authController.protect);

router.get('/self', userController.getSelf, userController.getUser);
router.patch('/update-me', userController.updateSelf);
router.delete('/disacive', userController.deleteSelf);

// Only admin can use this route
router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
