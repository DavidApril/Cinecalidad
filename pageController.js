const ScraperObject = require('./pageScraper');
const fs = require('fs');

async function scrapeAll(browserInstance) {
	let browser;

	try {
		let pageScraper = new ScraperObject('https://www.cinecalidad.tf/');

		browser = await browserInstance;
		let scrapedData = {};

		scrapedData['Estrenos'] = await pageScraper.Scraper(browser, 'Estrenos');

		await browser.close();

		fs.writeFile('data.json', JSON.stringify(scrapedData), 'utf-8', function (err) {
			if (err) {
				return console.log(err);
			} else {
				console.log("The data has been scraped and saved successfully! View it at './data.json'");
			}
		});
		
	} catch (err) {
		fs.writeFile('data.json', JSON.stringify(scrapedData), 'utf-8', function (err) {
			if (err) {
				return console.log(err);
			} else {
				console.log("The data has been scraped and saved successfully! View it at './data.json'");
			}
		});
		console.log('Could not resolve the browser instance => ', err);
	}
}

module.exports = (browserInstance) => scrapeAll(browserInstance);
