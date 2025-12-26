import express from 'express';
import morgan from 'morgan';

import tourRouter from './routes/tourRoutes.js';
import userRouter from './routes/userRoutes.js';

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
app.all('{/*path}', (req, res) => {
	res.status(404).json({
		status: 'fail',
		message: `Can't find this url on this server`,
	});
});

export default app;
