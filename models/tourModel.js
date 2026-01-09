import mongoose from 'mongoose';
import slugify from 'slugify';

const tourSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'A tour must have a name'],
			unique: true,
			min: [4, 'Name should have atleast 4 characters'],
			max: [20, 'Name should have atleast 4 characters'],
		},
		price: {
			type: Number,
			required: [true, 'A tour must have a price'],
		},
		rating: {
			type: Number,
			min: [1, 'Rating should atleast be 1'],
			max: [5, 'Rating cannot be more than 5'],
		},
		summary: {
			type: String,
			// trim: true,
			required: [true, 'A tour must have a summary'],
		},
		// plan: {
		// 	type: String,
		// 	enum: {
		// 		values: ['basic', 'premium', 'luxury'],
		// 		message: 'Plan can only be basic, premium and luxury'
		// 	}

		// },
		drink: {
			type: String,
			enum: {
				values: ['Coffee', 'Tea'],
				message: '{VALUE} is not supported',
			},
		},
		slug: String,
		privateTour: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true },
);

// Mongoose middleware
// DOCUMENT MIDDLEWARE: runs before .save() and .create()
// save(), create().
// ❌ won't work on insertMany
tourSchema.pre('save', function () {
	this.slug = slugify(this.name, { lower: true });
});

// Post save hook (after the document is saved to the database)
// tourSchema.post('save', function (doc,) {
// 	console.log('Post save hook ran successfully');
// 	next();
// });

// QUERY MIDDLEWARE
// tourSchema.pre('find', function () {
tourSchema.pre(/^find/, function () {
	this.find({ privateTour: { $ne: true } });
	//12:00:12
	this.start = Date.now();
});

tourSchema.post(/^find/, function (docs) {
	// 12:00:15
	console.log(`Query took ${Date.now() - this.start} milliseconds`);
});

// post
const Tour = mongoose.model('Tour', tourSchema);
export default Tour;
