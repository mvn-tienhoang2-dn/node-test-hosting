const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
// const reviewController = require('../controllers/reviewController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.use(authController.protect);

router
  .route('/tour-stats')
  .get(authController.restrictTo('admin', 'user'), tourController.getTourStats);
router
  .route('/monthly-plan/:year')
  .get(authController.restrictTo('admin'), tourController.getMonthlyPlan);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(authController.restrictTo('admin'), tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(authController.restrictTo('admin'), tourController.updateTour)
  .delete(authController.restrictTo('admin'), tourController.deleteTour);

module.exports = router;
