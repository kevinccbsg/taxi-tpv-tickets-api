const {
	handleHttpError,
	tagError,
} = require('error-handler-module');

module.exports = () => {
	const start = async ({ app, controller, logger }) => {
		/**
		 * This endpoint allows you to save tickets by uploading pdf files
		 * @route POST /api/v1/tickets
		 * @group Tickets - Everything about admin routes
		 * @param {file} file.formData.required - pdf file
		 * @returns {SuccessPDFResponse.model} 200 - Successful operation
		 * @returns {Error.model} <any> - Error message
		*/
		app.post('/api/v1/tickets', async (req, res, next) => {
			try {
				const { file } = req.files;
				const processedInfo = await controller.savePDFInfo(file);
				return res.json({ success: true, processedInfo });
			} catch (error) {
				return next(tagError(error));
			}
		});

		app.use(handleHttpError(logger));
		return Promise.resolve();
	};

	return { start };
};
