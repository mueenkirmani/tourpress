import express from 'express';
import userController from '../controllers/userController.js';
import authController from '../controllers/authController.js';

const userRouter = express.Router();

const { getAllUsers, createUser, getUser, updateUser, deleteUser } = userController();
const { signup, login, protect, restrictTo, forgotPassword, resetPassword } = authController();

userRouter.route('/signup').post(signup);
userRouter.route('/login').post(login);
userRouter.route('/forgot-password').post(forgotPassword);
// userRouter.route('/reset-password').post(resetPassword);

userRouter.use(protect);

userRouter.route('/').get(getAllUsers).post(restrictTo('admin'), createUser);
userRouter.route('/:id').get(getUser).patch(restrictTo('admin'), updateUser).delete(restrictTo('admin'), deleteUser);

export default userRouter;
