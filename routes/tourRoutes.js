import express from 'express';
import tourController from '../controllers/tourController.js';
import authController from '../controllers/authController.js';

const tourRouter = express.Router();
const { protect, restrictTo } = authController();

// Next step
tourRouter.use(protect);

tourRouter
	.route('/')
	.get(tourController().getAllTours)
	.post(restrictTo('admin', 'editor'), tourController().createTour);

tourRouter
	.route('/:id')
	.get(tourController().getTour)
	.patch(restrictTo('admin', 'editor'), tourController().updateTour)
	.delete(restrictTo('admin', 'editor'), tourController().deleteTour);

export default tourRouter;
