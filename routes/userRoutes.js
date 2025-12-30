import express from 'express';
import userController from '../controllers/userController.js';
import authController from '../controllers/authController.js';

const userRouter = express.Router();

const { getAllUsers, createUser, getUser, updateUser, deleteUser } = userController();
const { signup } = authController();

userRouter.route('/signup').post(signup);

userRouter.route('/').get(getAllUsers).post(createUser);
userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export default userRouter;
