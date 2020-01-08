const {
	handleHttpError,
	tagError,
} = require('error-handler-module');

module.exports = () => {
	const start = async ({ app, controller, logger }) => {
		app.post('/api/v1/tickets', async (req, res, next) => {
			try {
				const { file } = req.files;
				const processedInfo = await controller.savePDFInfo(file);
				return res.json({ success: true, file: processedInfo });
			} catch (error) {
				return next(tagError(error));
			}
		});

		app.use(handleHttpError(logger));
		return Promise.resolve();
	};

	return { start };
};
