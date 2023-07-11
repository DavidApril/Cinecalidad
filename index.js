const Browser = require('./browser');
const Controller = require('./pageController');

const browser = new Browser();
let browserInstance = browser.Start();

Controller(browserInstance);

// import data from './data.json' assert { type: 'json' };

// const CuatroK = data['4K'].length;
// const Estrenos = data['Estrenos'].length;
// const Animación = data['Animación'].length;

// console.log(`4K => ${CuatroK} películas`);
// console.log(`Estrenos => ${Estrenos} películas`);
// console.log(`Animación => ${Animación} películas`);
