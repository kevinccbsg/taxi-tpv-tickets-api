const expressSwaggerGenerator = require('express-swagger-generator');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const pdfParser = require('../../lib/pdfParser');

module.exports = () => {
	const start = async ({ manifest = {}, app, config }) => {
		const { swaggerOptions } = config;
		const expressSwagger = expressSwaggerGenerator(app);
		const options = {
			swaggerDefinition: {
				...swaggerOptions.swaggerDefinition,
			},
			basedir: __dirname,
			files: ['./**/**-routes.js'],
		};
		expressSwagger(options);
		app.use(cors());
		app.use(bodyParser.urlencoded({ extended: true }));
		app.use(bodyParser.json());
		app.use(fileUpload());

		/**
		 * This endpoint serves the manifest
		 * @route GET /__/manifest
		 * @group Admin - Everything about admin routes
		 * @returns 200 - Sucessful response
		*/
		app.get('/__/manifest', (req, res) => res.json(manifest));

		app.post('/api/v1/tickets', async (req, res) => {
			const ibercajaInfo = pdfParser('ibercaja');
			const { file } = req.files;
			const parsedInfo = await ibercajaInfo(file.data, file.name);
			res.json({ success: true, file: parsedInfo });
		});

		return Promise.resolve();
	};

	return { start };
};
