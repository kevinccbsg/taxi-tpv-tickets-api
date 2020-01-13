const supertest = require('supertest');
const system = require('../../system');

describe('Login endpoints', () => {
	let request;
	const sys = system();

	before(async () => {
		const { app } = await sys.start();
		request = supertest(app);
	});

	after(() => sys.stop());

	it.only('should throw error 400 when pws and user is not sent', () => request
		.post('/api/v1/login')
		.send({})
		.expect(400));
});
