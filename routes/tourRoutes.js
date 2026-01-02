import express from 'express';
import tourController from '../controllers/tourController.js';
import authController from '../controllers/authController.js';

const tourRouter = express.Router();
const { protect } = authController();

// Next step
tourRouter.route('/').get(protect, tourController().getAllTours).post(protect, tourController().createTour);

tourRouter
	.route('/:id')
	.get(protect, tourController().getTour)
	.patch(protect, tourController().updateTour)
	.delete(protect, tourController().deleteTour);

export default tourRouter;
