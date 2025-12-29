import express from 'express';
import morgan from 'morgan';

import tourRouter from './routes/tourRoutes.js';
import userRouter from './routes/userRoutes.js';

import AppError from './utils/appError.js';
import globalError from './controllers/errorController.js';

const app = express();

app.use(express.json());
app.set('query parser', 'extended');

if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

// app.get('/', (req, res) => {
// 	console.log(req.body);
// 	res.send('Hello World');
// });

// routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// unhandled routes
app.all('{/*path}', (req, res, next) => {
	// const err = new Error(`Can't find ${req.originalUrl} on this server`);
	// err.statusCode = 404;
	// err.status = 'fail';

	next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalError);
export default app;
