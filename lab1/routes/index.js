const blog = require('./users')

module.exports = app => {
	app.use('/blog', blog);

	app.use('*', (_, res) => {
		res.status(404).json({ error: 'There are no apis for you!' });
	});
};
