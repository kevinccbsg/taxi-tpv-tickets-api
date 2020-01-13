const {
	errorFactory,
	CustomErrorTypes,
} = require('error-handler-module');
const parse = require('date-fns/parse');

const wrongInput = errorFactory(CustomErrorTypes.WRONG_INPUT);
const forbiddenError = errorFactory(CustomErrorTypes.FORBIDDEN);

const token = require('../../lib/token');

module.exports = () => {
	const start = async ({
		logger, filePDF, store, config,
	}) => {
		const jwt = token(config.tokenSecret);

		const isVerified = authorization => jwt.verifyToken(authorization);

		const savePDFInfo = async (file, type = 'ibercaja') => {
			if (!file) throw wrongInput('File is required');
			const wasRecorded = await store.alreadyRecorded(file.name);
			if (wasRecorded) throw wrongInput('This File was already recorded');
			const ibercajaInfo = filePDF.pdfParser(type);
			logger.info(`Parsing ${file.name} of ${type} type`);
			const parsedInfo = await ibercajaInfo(file.data, file.name);
			const tickets = parsedInfo.data.map(ticket => ({
				...ticket,
				pdfName: file.name,
				validated: false,
			}));
			const ticketsPromises = tickets.map(ticket => (
				store.upsertTickets({
					formattedDate: ticket.formattedDate,
					hour: ticket.hour,
					price: ticket.price,
				}, {
					...ticket,
					date: parse(ticket.formattedDate, 'dd-MM-yyyy', new Date()),
				})
			));
			await Promise.all(ticketsPromises);
			return parsedInfo.data;
		};

		const getTickets = async () => {
			logger.info('Geting tickets');
			const tickets = await store.getTickets();
			return tickets;
		};

		const registerTicket = async (date, price) => {
			logger.info(`Registering ticket with date ${date} and price ${price}`);
			store.registerTicket(date, price);
			return true;
		};

		const login = async (email, password) => {
			logger.info(`Requesting loging for user ${email}`);
			const user = await store.getUserByEmail(email);
			if (password !== user.password) {
				throw forbiddenError('User or password incorrect');
			}
			return {
				jwt: jwt.signToken({ id: user._id }),
				email: user.email,
			};
		};

		return {
			savePDFInfo,
			getTickets,
			registerTicket,
			login,
			isVerified,
		};
	};

	return { start };
};
