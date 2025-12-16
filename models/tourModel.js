import mongoose from 'mongoose';

const tourSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'A tour must have a name'],
		unique: true,
	},
	price: {
		type: Number,
		required: [true, 'A tour must have a price'],
	},
	rating: Number,
	summary: {
		type: String,
		// trim: true,
		required: [true, 'A tour must have a summary'],
	},
});

const Tour = mongoose.model('Tour', tourSchema);
export default Tour;
