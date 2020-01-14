const {
	errorFactory,
	CustomErrorTypes,
} = require('error-handler-module');

const wrongInput = errorFactory(CustomErrorTypes.WRONG_INPUT);
const crypto = require('../../lib/crypto');

module.exports = () => {
	const start = async ({ mongo, config }) => {
		const tickets = mongo.collection('tickets');
		const users = mongo.collection('users');
		const { decrypt, encrypt } = crypto(config.cryptoSecret, config.cryptoAlgorithm);
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

		const getUserByEmail = async email => {
			const user = await users.findOne({ email });
			if (!user) return {};
			const normalPassword = decrypt(user.password, user.salt.buffer);
			return { ...user, password: normalPassword };
		};

		const registerUser = async user => {
			const { crypted, salt } = encrypt(user.password);
			const payload = {
				name: user.name,
				email: user.email,
				password: crypted,
				salt,
			};
			await users.insertOne(payload);
			return { email: user.email };
		};

		return {
			upsertTickets: upsertCollection(tickets),
			alreadyRecorded,
			getTickets,
			registerTicket,
			getUserByEmail,
			registerUser,
		};
	};

	return { start };
};
