const path = require('path');
const expect = require('expect.js');
const supertest = require('supertest');
const system = require('../../system');
const fileMock = require('../mocks/fileMock');

describe('POST endpoints', () => {
	let request;
	let sys = system();
	sys = sys.set('filePDF', fileMock()).dependsOn();

	let ticket;
	before(async () => {
		const { app, mongo } = await sys.start();
		request = supertest(app);
		ticket = mongo.collection('tickets');
	});

	beforeEach(async () => {
		await ticket.deleteMany({});
	});

	afterEach(async () => {
		await ticket.deleteMany({});
	});

	after(() => sys.stop());

	it('should register a ticket after calling POST /api/v1/tickets', () => request
		.post('/api/v1/tickets')
		.attach('file', path.join(__dirname, '..', 'fixtures', 'file-mock.txt'))
		.expect(200)
		.then(() => request.post('/api/v1/tickets/register')
			.send({
				date: '13-12-2019',
				price: '2,6',
			})
			.expect(200))
		.then(async ({ body }) => {
			expect(body.success).to.eql(true);
			const { validated } = await ticket.findOne({
				formattedDate: '13-12-2019',
				price: '2,6',
			});
			expect(validated).to.eql(true);
		}));
});
