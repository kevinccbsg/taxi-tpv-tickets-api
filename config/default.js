module.exports = {
	server: {
		host: '0.0.0.0',
		port: 4000,
	},
	controller: {
		tokenSecret: process.env.TOKEN_SECRET,
	},
	store: {
		cryptoSecret: process.env.CRYPTO_SECRET,
		cryptoAlgorithm: process.env.CRYPTO_ALGORITHM,
	},
	routes: {
		admin: {
			swaggerOptions: {
				swaggerDefinition: {
					info: {
						description: 'Documentation for taxi-tpv-tickets-api',
						title: 'taxi-tpv-tickets-api',
						version: '1.0.0',
					},
					host: process.env.SERVICE_ENV || 'localhost:4000',
					basePath: '/',
					produces: ['application/json'],
					schemes: ['https', 'http'],
					securityDefinitions: {
						JWT: {
							type: 'apiKey',
							in: 'header',
							name: 'Authorization',
							description: '',
						},
					},
				},
			},
		},
	},
	mongo: {
		connectionString: process.env.AZURE_COSMOSDB_CONNECTION_STRING || 'mongodb://node:node@localhost:27017/tpv-tickets',
		contentDatabaseName: process.env.EVENTS_DATABASE_NAME || 'tpv-tickets',
	},
	logger: {
		transport: 'console',
		include: [
			'tracer',
			'timestamp',
			'level',
			'message',
			'error.message',
			'error.code',
			'error.stack',
			'request.url',
			'request.headers',
			'request.params',
			'request.method',
			'response.statusCode',
			'response.headers',
			'response.time',
			'process',
			'system',
			'package.name',
			'service',
		],
		exclude: ['password', 'secret', 'token', 'request.headers.cookie', 'dependencies', 'devDependencies'],
	},
};
