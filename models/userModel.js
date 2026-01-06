import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
	{
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
			// save and create only
			validate: {
				validator: function (curVal) {
					return curVal === this.password;
				},
				message: 'Passwords do not match!',
			},
		},
		passwordChangedAt: Date,
		// if jwt token is issued before passwordChange
		role: {
			type: String,
			enum: ['admin', 'editor', 'user'],
			default: 'user',
		},
	},
	{ timestamps: true },
);

userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();

	//hash(salt + password) = hash(output + salt) = hash(output + salt) == output 2^12
	this.password = await bcrypt.hash(this.password, 12);

	this.passwordConfirm = undefined;
});

// Instance method
// Verify password

userSchema.methods.correctPassword = async function (candidatePassword) {
	// candidate password = req.body.password
	// user password  = hashed password stored
	return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
	if (this.passwordChangedAt) {
		const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
		// if return true === password is changed
		return JWTTimeStamp < changedTimeStamp;
		// else if return false password is not changed
	}

	return false;
};

const User = mongoose.model('User', userSchema);

export default User;

// Authentication

//1. Authentication ::
//2. Authorization ::
