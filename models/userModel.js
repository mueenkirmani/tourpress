import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Please provide a name'],
	},
	email: {
		type: String,
		required: [true, 'Please provide an email'],
		unique: true,
	},
	password: {
		type: String,
		required: [true, 'Please provide a password'],
	},
	passwordChangeAt: Date,
	role: {
		type: String,
		enum: ['admin', 'user'],
		default: 'user',
	},
});

const User = mongoose.model('User', userSchema);

export default User;

// Authentication

//1. Authentication ::
//2. Authorization ::
