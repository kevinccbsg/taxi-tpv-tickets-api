
module.exports = () => {
	const start = async ({ mongo }) => {
		const tickets = mongo.collection('tickets');
		const upsertCollection = collection => (filter, body) => collection.updateOne(filter, { $set: { ...body } }, { upsert: true });

		return {
			upsertTickets: upsertCollection(tickets),
		};
	};

	return { start };
};
