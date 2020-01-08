
module.exports = () => {
	const start = async ({ mongo }) => {
		const tickets = mongo.collection('tickets');
		const upsertCollection = collection => (filter, body) => collection.updateOne(filter, { $set: { ...body } }, { upsert: true });

		const alreadyRecorded = async name => {
			const ticket = await tickets.findOne({ pdfName: name });
			return !!ticket;
		};

		return {
			upsertTickets: upsertCollection(tickets),
			alreadyRecorded,
		};
	};

	return { start };
};
