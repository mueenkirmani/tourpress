import nodemailer from 'nodemailer';

export const sendEmail = async (options) => {
	console.log('email sending started');
	const transporter = nodemailer.createTransport({
		host: process.env.SMTP_HOST,
		port: process.env.SMTP_PORT,
		auth: {
			user: process.env.SMTP_USER,
			pass: process.env.SMTP_PASS,
		},
	});

	await transporter.sendMail({
		from: options.from || process.env.SMTP_FROM || 'TourPress LTD. <tech.incmak@gmail.com>',
		to: options.email,
		subject: options.subject,
		text: options.text,
		// html: '<p>hello</p> <button style="">Click here</button>',
	});
};
