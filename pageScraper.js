class ScraperObject {
	constructor(url) {
		this.url = url;
	}

	async Scraper(browser, category) {
		let page = await browser.newPage();
		console.log(`Navegando a: ${this.url}...`);

		await page.goto(this.url);

		let selectedCategory = await page.$$eval(
			'#menu > ul > li > a',
			(links, _category) => {
				links = links.map((a) => (a.textContent.replace(/(\r\n\t|\n|\r|\t|^\s|\s$|\B\s|\s\B)/gm, '') === _category ? a : null));
				let link = links.filter((tx) => tx !== null)[0];
				return link.href;
			},
			category
		);

		await page.goto(selectedCategory);

		let scrapedData = [];

		async function scrapeCurrentPage() {

			await page.waitForSelector('div.container');

			let urls = await page.$$eval('main > div > article', (links) => {
				links = links.map((el) => el.querySelector('a').href);
				return links;
			});

			let pagePromise = (link) =>
				new Promise(async (resolve) => {
					let dataObj = {};
					let newPage = await browser.newPage();

					await newPage.goto(link);

					dataObj['Title'] = await newPage.$eval('h1.mb-2.text-lg.font-bold', (text) => text.textContent);

					let dowloadLinks = await newPage.$$eval(
						'a[class="cfe inline-block px-2 py-1 text-xs font-bold text-center text-blue-600 border border-blue-600 rounded btn hover:bg-blue-600 hover:text-white"]',
						(links) =>
							(links = links.map((el) => {
								let object = { platform: el.textContent, link: atob(el.getAttribute('data-url')) };
								return object;
							}))
					);

					for (const item of dowloadLinks) {
						dataObj[`${item.platform.replace(' ', '')}`] = item.link;
					}

					resolve(dataObj);
					await newPage.close();
				});

			for (const link of urls) {
				let currentPageData = await pagePromise(link);
				console.log(currentPageData);
				scrapedData.push(currentPageData);
			}

			let nextButtonExist = false;

			try {
				const nextButton = await page.$eval('a.next.page-numbers', (a) => a.textContent);
				nextButtonExist = true;
			} catch (err) {
				nextButtonExist = false;
			}

			if (nextButtonExist) {
				await page.click('a.next.page-numbers');
				return scrapeCurrentPage();
			}

			await page.close();
			return scrapedData;
		}

		let data = await scrapeCurrentPage();
		console.log(data);
		return data;
	}
}

module.exports = ScraperObject;
