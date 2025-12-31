import User from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import jwt from 'jsonwebtoken';

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
		login: catchAsync(async (req, res, next) => {
			const { email, password } = req.body;

			if (!email || !password) {
				return next(new AppError('Please provide email and password', 400));
			}

			const user = await User.findOne({ email }).select('+password');

			if (!user || !(await user.correctPassword(password, user.password))) {
				return next(new AppError('Incorrect email or password'));
			}

			const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
				expiresIn: process.env.JWT_EXPIRES_IN,
			});

			res.status(200).json({
				status: 'success',
				data: {
					user,
					token,
				},
			});
		}),
	};
}
