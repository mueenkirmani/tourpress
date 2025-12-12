import fs from 'fs';

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
		getAllTours: (req, res) => {
			// jsend format
			res.status(200).json({
				status: 'success', //success or fail or error
				data: {
					tours: toursData,
				},
			});
		},
		// Create a tour
		createTour: (req, res) => {
			const { id, name, duration } = req.body;

			toursData.push({ id, name, duration });

			fs.writeFile('./data/tours.json', JSON.stringify(toursData), (err) => {
				if (err) {
					console.log(err);
				}
			});

			res.status(201).json({
				status: 'success',
				data: {
					tours: req.body,
				},
			});
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
