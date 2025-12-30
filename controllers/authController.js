import User from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';

export default function authController() {
	return {
		signup: catchAsync(async (req, res, next) => {
			const { name, email, password, passwordConfirm } = req.body;

			const newUser = await User.create({
				name: name,
				email: email,
				password: password,
				passwordConfirm,
			});

			res.status(201).json({
				status: 'success',
				data: {
					user: newUser,
				},
			});
		}),
	};
}
