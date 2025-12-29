class AppError extends Error {
	constructor(message, statusCode) {
		super(message); //Parent constructor
		this.statusCode = statusCode;
		this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'; //fail or error :: 4xx, 5xxx
		this.isOperational = true;

		// Capture stack of errors
		Error.captureStackTrace(this, this.constructor);
	}
}

export default AppError;

// this :: current object

// new AppError(`Can't find ${req.originalUrl} on this server`, 404)
// class Error {
//     constructor(message){

//     }
// }
// const err = new Error(`Can't find ${req.originalUrl} on this server`);
// 	err.statusCode = 404;
// 	err.status = 'fail';
// 	next(err);
