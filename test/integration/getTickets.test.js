const path = require('path');
const expect = require('expect.js');
const supertest = require('supertest');
const system = require('../../system');
const fileMock = require('../mocks/fileMock');

describe('GET endpoints', () => {
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

	it('should return pdf info when we called GET /api/v1/tickets', () => request
		.post('/api/v1/tickets')
		.attach('file', path.join(__dirname, '..', 'fixtures', 'file-mock.txt'))
		.expect(200)
		.then(() => request.get('/api/v1/tickets')
			.expect(200))
		.then(({ body: tickets }) => {
			tickets.forEach(ticketItem => {
				expect(ticketItem).not.to.have.property('_id');
				expect(ticketItem).to.have.property('validated');
				expect(ticketItem.validated).to.eql(false);
				expect(ticketItem).to.have.property('pdfName');
				expect(ticketItem.pdfName).to.eql('file-mock.txt');
				expect(ticketItem).to.have.property('price');
				expect(ticketItem).to.have.property('hour');
				expect(ticketItem).to.have.property('formatDate');
			});
		}));
});
