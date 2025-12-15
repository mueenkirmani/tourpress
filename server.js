import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: './config.env' });
import app from './app.js';

console.log(process.env.NODE_ENV);

mongoose
	.connect(process.env.DB_URL)
	.then(() => {
		console.log('Database connected ✅');
	})
	.catch((err) => {
		console.log('Database connection failed 🔥', err);
	});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
