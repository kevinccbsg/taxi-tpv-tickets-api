
module.exports = () => {
	const start = async ({ app, controller }) => {
		app.post('/api/v1/tickets', async (req, res) => {
			const { file } = req.files;
			const processedInfo = await controller.savePDFInfo(file);
			res.json({ success: true, file: processedInfo });
		});

		return Promise.resolve();
	};

	return { start };
};
