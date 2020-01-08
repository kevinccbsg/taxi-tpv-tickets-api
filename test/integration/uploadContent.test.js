const path = require('path');
const expect = require('expect.js');
const supertest = require('supertest');
const system = require('../../system');
const fileMock = require('../mocks/fileMock');

describe('Upload endpoints', () => {
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

	it('should save pdf mocked data in mongodb', () => request
		.post('/api/v1/tickets')
		.attach('file', path.join(__dirname, '..', 'fixtures', 'file-mock.txt'))
		.expect(200)
		.then(async response => {
			expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
			const tickets = await ticket.find({}).toArray();
			tickets.forEach(ticketItem => {
				expect(ticketItem).to.have.property('validated');
				expect(ticketItem.validated).to.eql(false);
				expect(ticketItem).to.have.property('pdfName');
				expect(ticketItem.pdfName).to.eql('file-mock.txt');
				expect(ticketItem).to.have.property('price');
				expect(ticketItem).to.have.property('hour');
				expect(ticketItem).to.have.property('formatDate');
			});
		}));

	it('should return 400 if pdf was already recorded', () => request
		.post('/api/v1/tickets')
		.attach('file', path.join(__dirname, '..', 'fixtures', 'file-mock.txt'))
		.expect(200)
		.then(() => request
			.post('/api/v1/tickets')
			.attach('file', path.join(__dirname, '..', 'fixtures', 'file-mock.txt'))
			.expect(400)));
});