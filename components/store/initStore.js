const {
	errorFactory,
	CustomErrorTypes,
} = require('error-handler-module');

const wrongInput = errorFactory(CustomErrorTypes.WRONG_INPUT);

module.exports = () => {
	const start = async ({ mongo }) => {
		const tickets = mongo.collection('tickets');
		const upsertCollection = collection => (filter, body) => collection.updateOne(filter, { $set: { ...body } }, { upsert: true });

		const alreadyRecorded = async name => {
			const ticket = await tickets.findOne({ pdfName: name });
			return !!ticket;
		};

		const getTickets = async () => {
			const ticketList = await tickets.find({}, {
				projection: { _id: 0 },
				sort: [['date', -1]],
			}).toArray();
			return ticketList;
		};

		const registerTicket = async (date, price) => {
			const { result } = await tickets.updateOne({
				formattedDate: date, price,
			}, { $set: { validated: true } });
			if (result.nModified !== 1) {
				throw wrongInput('There was not updated this ticket');
			}
		};

		return {
			upsertTickets: upsertCollection(tickets),
			alreadyRecorded,
			getTickets,
			registerTicket,
		};
	};

	return { start };
};
