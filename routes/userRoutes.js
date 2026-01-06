import express from 'express';
import userController from '../controllers/userController.js';
import authController from '../controllers/authController.js';

const userRouter = express.Router();

const { getAllUsers, createUser, getUser, updateUser, deleteUser } = userController();
const { signup, login, protect, restrictTo } = authController();

userRouter.route('/signup').post(signup);
userRouter.route('/login').post(login);

userRouter.use(protect);

userRouter.route('/').get(getAllUsers).post(restrictTo('admin'), createUser);
userRouter.route('/:id').get(getUser).patch(restrictTo('admin'), updateUser).delete(restrictTo('admin'), deleteUser);

export default userRouter;
