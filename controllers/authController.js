import User from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/email.js';

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

			//1. Check if email and password exist
			if (!email || !password) {
				return next(new AppError('Please provide email and password', 400));
			}

			//2. Check if user exists && password is correct
			const user = await User.findOne({ email }).select('+password');

			if (!user || !(await user.correctPassword(password))) {
				return next(new AppError('Incorrect email or password'));
			}

			//3. if email and password correct, send token to client
			const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
				expiresIn: process.env.JWT_EXPIRES_IN,
			});

			// 4. Send response
			res.status(200).json({
				status: 'success',
				data: {
					user,
					token,
				},
			});
		}),

		protect: catchAsync(async (req, res, next) => {
			let token;
			// Bearer tokenValue
			if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
				token = req.headers.authorization.split(' ')[1];
			}

			if (!token) {
				return next(new AppError('You are not logged in , Please login to get access', 401));
			}

			//verify token
			const decodedToken = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

			const currentUser = await User.findById(decodedToken.id);
			if (!currentUser) {
				return next(new AppError('The user belonging to this token does not exist', 401));
			}
			// tokenIssued > passwordChangedAt
			if (currentUser.changedPasswordAfter(decodedToken.iat)) {
				return next(new AppError('User has recently changed the password, PPlease log in again', 401));
			}
			req.user = currentUser;
			next();
		}),
		restrictTo: (...roles) => {
			return (req, res, next) => {
				console.log('user in retritctTo middleware', req.user);
				console.log(roles);
				if (!roles.includes(req.user.role)) {
					next(new AppError('You are not authorized to perform this action', 403));
				}
				next();
			};
		},
		forgotPassword: catchAsync(async (req, res, next) => {
			const { email } = req.body;
			const user = await User.findOne({ email });

			if (!user) return next(new AppError('No user found with that email', 404));

			//generate a reset token
			const resetToken = user.createPasswordResetToken();
			await user.save({ validateBeforeSave: false });

			//Send email
			try {
				await sendEmail({
					email: user.email,
					subject: 'You password reset token',
					text: `Forgot password? Here is the link to reset your password http://localhost:5173/reset-password?token=${resetToken}`,
				});
				res.status(200).json({
					status: 'success',
					message: 'Password reset link successfully sent on your email, Please check your inbox',
				});
			} catch (e) {
				console.log('🚀 ~ e:', e);
				user.passwordResetToken = undefined;
				user.passwordResetExpires = undefined;
				await user.save({ validateBeforeSave: false });

				return next(new AppError('There was some error sending email', 500));
			}
		}),
		// resetPassword: catchAsync(async (req, res, next) => {}),
	};
}
