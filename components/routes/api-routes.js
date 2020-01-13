const {
	handleHttpError,
	tagError,
	errorFactory,
	CustomErrorTypes,
} = require('error-handler-module');

const wrongInput = errorFactory(CustomErrorTypes.WRONG_INPUT);

module.exports = () => {
	const start = async ({ app, controller, logger }) => {
		const authMiddleware = (req, res, next) => {
			const { authorization } = req.headers;
			try {
				controller.isVerified(authorization);
				return next();
			} catch (error) {
				return next(tagError(error));
			}
		};
		/**
		 * This endpoint allows you to save tickets by uploading pdf files
		 * @route POST /api/v1/tickets
		 * @group Tickets - Everything about tickets
		 * @param {file} file.formData.required - pdf file
		 * @returns {SuccessPDFResponse.model} 200 - Successful operation
		 * @returns {Error.model} <any> - Error message
		*/
		app.post('/api/v1/tickets', authMiddleware, async (req, res, next) => {
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
		app.get('/api/v1/tickets', authMiddleware, async (req, res, next) => {
			try {
				const tickets = await controller.getTickets();
				return res.json(tickets);
			} catch (error) {
				return next(tagError(error));
			}
		});

		/**
		 * This endpoint allows you retrieve tickets list
		 * @route POST /api/v1/tickets/register
		 * @group Tickets - Everything about tickets
		 * @param {RegisterTicketRequest.model} body.body.required
		 * @returns {SuccessTicketRegistered.model} 200 - Successful operation
		 * @returns {Error.model} <any> - Error message
		*/
		app.post('/api/v1/tickets/register', authMiddleware, async (req, res, next) => {
			try {
				const { date, price } = req.body;
				if (!date && !price) {
					throw wrongInput('You must provide date and price');
				}
				await controller.registerTicket(date, price);
				return res.json({ success: true });
			} catch (error) {
				return next(tagError(error));
			}
		});

		/**
		 * This endpoint allows you retrieve tickets list
		 * @route POST /api/v1/login
		 * @group User - Everything about user
		 * @param {LoginRequest.model} body.body.required
		 * @returns {LoginResponse.model} 200 - Successful operation
		 * @returns {Error.model} <any> - Error message
		*/
		app.post('/api/v1/login', async (req, res, next) => {
			try {
				const { email, password } = req.body;
				if (!email && !password) {
					throw wrongInput('You must provide email and password');
				}
				const loginInfo = await controller.login(email, password);
				return res.json(loginInfo);
			} catch (error) {
				return next(tagError(error));
			}
		});

		app.use(handleHttpError(logger));
		return Promise.resolve();
	};

	return { start };
};
