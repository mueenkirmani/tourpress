import express from 'express';
import userController from '../controllers/userController.js';
const userRouter = express.Router();

const { getAllUsers, createUser, getUser, updateUser, deleteUser } = userController();

userRouter.route('/').get(getAllUsers).post(createUser);
userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export default userRouter;
