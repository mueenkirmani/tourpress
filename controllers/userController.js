import User from '../models/userModel.js';

export default function userController() {
	return {
		// Get all Users
		getAllUsers: async (_req, res) => {
			try {
				const users = await User.find();

				res.status(200).json({
					status: 'success',
					results: users.length,
					data: {
						users,
					},
				});
			} catch (err) {
				res.status(404).json({
					status: 'fail',
					message: err,
				});
			}
		},
		// Create a User
		createUser: async (req, res) => {
			try {
				const { name, email, password } = req.body;

				const newUser = await User.create({ name, email, password });

				res.status(201).json({
					status: 'success',
					data: {
						user: newUser,
					},
				});
			} catch (err) {
				res.status(400).json({
					status: 'fail',
					message: err,
				});
			}
		},
		// Get a User
		getUser: async (req, res) => {
			try {
				const id = req.params.id;

				const user = await User.findById(id);

				if (!user) {
					return res.status(404).json({
						status: 'fail',
						message: 'The user id does not exist',
					});
				}

				res.status(200).json({
					status: 'success',
					data: {
						User,
					},
				});
			} catch (err) {
				res.status(400).json({
					status: 'fail',
					message: err,
				});
			}
		},
		// Update a User
		updateUser: async (req, res) => {
			try {
				const id = req.params.id;

				const { name } = req.body;

				if (!name) {
					res.status(400).json({
						status: 'fail',
						message: 'Please provide a name',
					});
				}

				const user = await User.findByIdAndUpdate(
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
						user,
					},
				});
			} catch (err) {
				res.status(400).json({
					status: 'fail',
					message: err,
				});
			}
		},
		// Delete a user
		deleteUser: async (req, res) => {
			try {
				const id = req.params.id;

				const userExists = await User.findById(id);

				if (!userExists) {
					return res.status(404).json({
						status: 'fail',
						message: 'The user id does not exist',
					});
				}

				const user = await User.deleteOne({ _id: id });

				res.status(204).json({
					status: 'success',
					data: {
						user,
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
