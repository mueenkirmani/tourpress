import Tour from '../models/tourModel.js';

export default function tourController() {
	return {
		// Get all tours
		getAllTours: async (req, res) => {
			const queryObj = { ...req.query };
			// 1A) Filtering: rating: 5, rating[gte]=4.5, price[lte]=1500

			// Removing fields from query object that are not used for filtering otherwise it will interfere with the query
			const excludeFields = ['page', 'sort', 'limit', 'fields'];
			excludeFields.forEach((el) => delete queryObj[el]);

			let queryStr = JSON.stringify(queryObj);

			queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

			try {
				let query = Tour.find(JSON.parse(queryStr)).sort('name rating');

				// second)
				if (req.query.sort) {
					// sort=price,rating,name but mongoose needs space separated string
					const sortBy = req.query.sort.split(',').join(' ');
					query = query.sort(sortBy);
				} else {
					query = query.sort('-createdAt');
				}
				if (req.query.fields) {
					const limitFields = req.query.fields.split(',').join(' ');
					console.log('🚀 ~ tourController ~ limitFields:', limitFields);
					query = query.select(limitFields);
				} else {
					query = query.select('-__v');
				}
				if (req.query.page) {
				}

				const tours = await query;
				res.status(200).json({
					status: 'success', //success or fail or error
					results: tours.length,
					data: {
						tours: tours,
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
		getTour: async (req, res) => {
			try {
				const id = req.params.id;

				const tour = await Tour.findById(id);

				if (!tour) {
					return res.status(404).json({
						status: 'fail',
						message: 'The tour id does not exist',
					});
				}

				res.status(200).json({
					status: 'success',
					data: {
						tour,
					},
				});
			} catch (err) {
				res.status(400).json({
					status: 'fail',
					message: err,
				});
			}
		},
		// Update a tour
		updateTour: async (req, res) => {
			try {
				const id = req.params.id;

				const { name } = req.body;

				if (!name) {
					res.status(400).json({
						status: 'fail',
						message: 'Please provide a name',
					});
				}

				const tour = await Tour.findByIdAndUpdate(
					id,
					{
						name,
					},
					{
						new: true,
					},
				);

				res.status(200).json({
					status: 'success',
					data: {
						tour,
					},
				});
			} catch (err) {
				res.status(400).json({
					status: 'fail',
					message: err,
				});
			}
		},
		deleteTour: async (req, res) => {
			try {
				const id = req.params.id;

				const tourExists = await Tour.findById(id);

				if (!tourExists) {
					return res.status(404).json({
						status: 'fail',
						message: 'The tour id does not exist',
					});
				}

				const tour = await Tour.deleteOne({ _id: id });

				res.status(204).json({
					status: 'success',
					data: {
						tour,
					},
				});
			} catch (err) {
				res.status(400).json({
					status: 'fail',
					message: err,
				});
			}
		},
	};
}
