const {
	handleHttpError,
	tagError,
} = require('error-handler-module');

module.exports = () => {
	const start = async ({ app, controller, logger }) => {
		/**
		 * This endpoint allows you to save tickets by uploading pdf files
		 * @route POST /api/v1/tickets
		 * @group Tickets - Everything about tickets
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

		/**
		 * This endpoint allows you retrieve tickets list
		 * @route GET /api/v1/tickets
		 * @group Tickets - Everything about tickets
		 * @param {file} file.formData.required - pdf file
		 * @returns {Array.<TicketsResponse>} 200 - Successful operation
		 * @returns {Error.model} <any> - Error message
		*/
		app.get('/api/v1/tickets', async (req, res, next) => {
			try {
				const tickets = await controller.getTickets();
				return res.json(tickets);
			} catch (error) {
				return next(tagError(error));
			}
		});

		app.use(handleHttpError(logger));
		return Promise.resolve();
	};

	return { start };
};
