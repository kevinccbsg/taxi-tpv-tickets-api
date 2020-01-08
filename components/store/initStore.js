
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

		return {
			upsertTickets: upsertCollection(tickets),
			alreadyRecorded,
			getTickets,
		};
	};

	return { start };
};
