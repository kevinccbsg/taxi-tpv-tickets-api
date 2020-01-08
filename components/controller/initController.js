
module.exports = () => {
	const start = async ({ logger, filePDF }) => {
		const savePDFInfo = async (file, type = 'ibercaja') => {
			const ibercajaInfo = filePDF.pdfParser(type);
			logger.info(`Parsing ${file.name} of ${type} type`);
			const parsedInfo = await ibercajaInfo(file.data, file.name);
			return parsedInfo;
		};
		return { savePDFInfo };
	};

	return { start };
};
