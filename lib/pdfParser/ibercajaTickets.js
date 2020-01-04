const pdf = require('pdf-parse');

const regexPattern = /([0-9]{2}-[0-9]{2}-[0-9]{4})%%([0-9]{2}:[0-9]{2})%%.{30}%%([0-9]{1,3},[0-9]{2})/;
// default render callback
const renderPage = pageData => {
	// check documents https://mozilla.github.io/pdf.js/
	const renderOptions = {
		// replaces all occurrences of whitespace with standard spaces (0x20). The default value is `false`.
		normalizeWhitespace: false,
		// do not attempt to combine same line TextItem's. The default value is `false`.
		disableCombineTextItems: false,
	};

	return pageData.getTextContent(renderOptions)
		.then(textContent => {
			let lastY = '';
			let total = 0;
			let text = [];
			for (const item of textContent.items) { // eslint-disable-line
				if (lastY == item.transform[5] || !lastY) {  // eslint-disable-line
					text = [...text];
				} else {
					if (item.str.includes('TOTAL COMERCIO')) {
						const [,, totalComercio] = item.str.split(' ').filter(splitItem => splitItem);
						total = Number(totalComercio);
					}
					if (item.str.includes('VENTA')) {
						const parserTable = item.str.split(' ').filter(splitItem => splitItem).join('%%');
						const [, year, hour, price] = parserTable.match(regexPattern);
						if (!!year || !!hour || !!price) {
							text = [
								...text,
								{ year, hour, price },
							];
						}
					}
				}
				lastY = item.transform[5]; // eslint-disable-line
			}
			if (text.length !== total) {
				throw new Error('Not all bills where parsed. Retry again');
			}
			return JSON.stringify(text).trim();
		});
};

module.exports = (buffer, name) => pdf(buffer, {
	pagerender: renderPage,
}).then(data => ({
	name,
	data: JSON.parse(data.text),
}));
