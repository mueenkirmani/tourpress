import fs from 'fs';

const toursData = JSON.parse(fs.readFileSync('./data/tours.json', 'utf-8'));

export const getAllUsers = (req, res) => {
	// jsend format
	res.status(200).json({
		status: 'success', //success or fail or error
		data: {
			tours: toursData,
		},
	});
};

export const createUser = (req, res) => {
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
};

export const getUser = (req, res) => {
	const id = req.params.id * 1;

	const tour = toursData.find((tour) => tour.id === id);

	res.status(200).json({
		status: 'success',
		data: {
			tour,
		},
	});
};

export const updateUser = (req, res) => {
	const id = req.params.id * 1;

	const { name, duration } = req.body;

	const tour = toursData.find((tour) => tour.id === id);

	if (!name) {
		res.status(400).json({
			status: 'fail',
			message: 'Please provide a name',
		});
	}

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
};

export const deleteUser = (req, res) => {
	const id = req.params.id * 1;

	const tour = toursData.find((tour) => tour.id === id);

	if (!tour) {
		return res.status(404).json({
			status: 'fail',
			message: 'The tour id does not exist',
		});
	}
	res.status(204).json({
		status: 'success',
		data: {
			tour,
		},
	});
};
