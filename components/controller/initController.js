const {
	errorFactory,
	CustomErrorTypes,
} = require('error-handler-module');

const wrongInput = errorFactory(CustomErrorTypes.WRONG_INPUT);

module.exports = () => {
	const start = async ({ logger, filePDF, store }) => {
		const savePDFInfo = async (file, type = 'ibercaja') => {
			if (!file) throw wrongInput('File is required');
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
					pdfName: ticket.pdfName,
					year: ticket.name,
					hour: ticket.name,
					price: ticket.name,
				}, ticket)
			));
			await Promise.all(ticketsPromises);
			return parsedInfo.data;
		};
		return { savePDFInfo };
	};

	return { start };
};
