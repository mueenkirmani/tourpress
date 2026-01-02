import express from 'express';
import userController from '../controllers/userController.js';
import authController from '../controllers/authController.js';

const userRouter = express.Router();

const { getAllUsers, createUser, getUser, updateUser, deleteUser } = userController();
const { signup, login, protect } = authController();

userRouter.route('/signup').post(signup);
userRouter.route('/login').post(login);

userRouter.route('/').get(protect, getAllUsers).post(protect, createUser);
userRouter.route('/:id').get(protect, getUser).patch(protect, updateUser).delete(protect, deleteUser);

export default userRouter;
