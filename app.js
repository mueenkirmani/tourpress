import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// Security packages
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

import tourRouter from './routes/tourRoutes.js';
import userRouter from './routes/userRoutes.js';

import AppError from './utils/appError.js';
import globalError from './controllers/errorController.js';

const app = express();

app.use(helmet());

// body parser
app.use(express.json({ limit: '10kb' }));
app.set('query parser', 'extended');

if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

// app.get('/', (req, res) => {
// 	console.log(req.body);
// 	res.send('Hello World');
// });

app.use(
	cors({
		origin: 'https://localhost:5173',
		credentials: true,
	}),
);
app.use(cookieParser());

// Rate limiter
const limiter = rateLimit({
	max: 500,
	windowMs: 60 * 60 * 1000,
	message: 'Too many requests from this IP, please try again in an hour!',
});

app.use('/api', limiter);

// TODO: check alternative libraries
// Sanitization
// app.use(mongoSanitize());
// app.use(xss());

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
