import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Please provide a name'],
	},
	email: {
		type: String,
		required: [true, 'Please provide an email'],
		unique: true,
		lowercase: true,
		validate: [validator.isEmail, 'Please provide a valid email'],
	},
	profilePhoto: String,
	password: {
		type: String,
		required: [true, 'Please provide a password'],
		min: 8,
		select: false,
	},
	passwordConfirm: {
		type: String,
		required: [true, 'Please provide confirm password'],
		validate: {
			validator: function (curVal) {
				return curVal === this.password;
			},
			message: 'Passwords do not match!',
		},
	},
	passwordChangeAt: Date,
	role: {
		type: String,
		enum: ['admin', 'user'],
		default: 'user',
	},
});

userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();

	//hash(salt + password) = hash(output + salt) = hash(output + salt) == output 2^12
	this.password = await bcrypt.hash(this.password, 12);

	this.passwordConfirm = undefined;
});

// Instance method
// Verify password

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
	// candidate password = req.body.password
	// user password  = hashed password stored
	return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

export default User;

// Authentication

//1. Authentication ::
//2. Authorization ::
