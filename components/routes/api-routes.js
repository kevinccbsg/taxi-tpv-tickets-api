
const pdfParser = require('../../lib/pdfParser');

module.exports = () => {
	const start = async ({ app }) => {
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
