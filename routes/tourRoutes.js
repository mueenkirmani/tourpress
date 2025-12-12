import express from 'express';
import tourController from '../controllers/tourController.js';

const tourRouter = express.Router();

tourRouter.route('/').get(tourController().getAllTours).post(tourController().createTour);

tourRouter.param('id', tourController().checkIdExists);

tourRouter
	.route('/:id')
	.get(tourController().getTour)
	.patch(tourController().updateTour)
	.delete(tourController().deleteTour);

export default tourRouter;
