import fs from 'fs';
import Tour from '../models/tourModel.js';

const toursData = JSON.parse(fs.readFileSync('./data/tours.json', 'utf-8'));

// tourController
// REST FULL API's
/*
1. Segregation based on resources
2. use HTTP methods
*/

export default function tourController() {
	return {
		checkIdExists: (req, res, next) => {
			const id = req.params.id * 1;
			const tour = toursData.find((tour) => tour.id === id);

			// jsend format
			if (!tour) {
				return res.status(404).json({
					status: 'fail', // success or fail or error
					message: 'The tour id does not exist',
				});
			}
			next();
		},
		// Get all tours
		getAllTours: async (req, res) => {
			try {
				const tours = await Tour.find();

				// jsend format
				res.status(200).json({
					status: 'success', //success or fail or error
					data: {
						tours,
					},
				});
			} catch (err) {
				res.status(404).json({
					status: 'fail',
					message: err,
				});
			}
		},
		// Create a tour
		createTour: async (req, res) => {
			try {
				const { name, price, rating, summary, duration } = req.body;

				const newTour = await Tour.create({ name, price, rating, summary, duration });
				console.log('🚀 ~ tourController ~ newTour:', newTour);

				res.status(201).json({
					status: 'success',
					data: {
						tour: newTour,
					},
				});
			} catch (err) {
				res.status(400).json({
					status: 'fail',
					message: err,
				});
			}
		},
		// Get a tour
		getTour: (req, res) => {
			const id = req.params.id * 1;

			const tour = toursData.find((tour) => tour.id === id);

			res.status(200).json({
				status: 'success',
				data: {
					tour,
				},
			});
		},
		// Update a tour
		updateTour: (req, res) => {
			const id = req.params.id * 1;

			const { name, duration } = req.body;

			const tour = toursData.find((tour) => tour.id === id);

			if (!name) {
				res.status(400).json({
					status: 'fail',
					message: 'Please provide a name',
				});
			}

			res.status(200).json({
				status: 'success',
				data: {
					tour,
				},
			});
		},
		deleteTour: (req, res) => {
			const id = req.params.id * 1;

			const tour = toursData.find((tour) => tour.id === id);

			res.status(204).json({
				status: 'success',
				data: {
					tour,
				},
			});
		},
	};
}
