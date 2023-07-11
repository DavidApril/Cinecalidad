const puppeteer = require('puppeteer');

class Browser {
	async Start() {
		let browser;
		try {
			console.log('Abriendo navegador...');
			browser = await puppeteer.launch({
				headless: false,
			});
		} catch (err) {
			console.log('Error al crear la instancia del navegador: ', err);
		}
		return browser;
	}
}

module.exports = Browser;
