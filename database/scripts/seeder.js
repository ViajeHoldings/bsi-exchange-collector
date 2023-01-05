require('dotenv').config();

const { faker } = require('@faker-js/faker');

const Price = require('../models/price.js');
const mongoConnect = require('./mongo-connect.js');
const { promiseResolver } = require('../../utilities/helpers.js');

const mongoUrl =
  process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/BSI-exchange-collector';

const dbConnection = mongoConnect(mongoUrl);

function generatePrices(amount) {
  const prices = [];

  for (let num = 0; num < amount; num += 1) {
    const newPrice = {
      price: faker.datatype.number({ min: 0, max: 10 }),
      change24Hr: faker.datatype.number({
        min: -100,
        max: 100,
        precision: 0.01,
      }),
      lastUpdatedAt: faker.date.recent(14),
      created: faker.date.recent(14),
    };

    prices.push(newPrice);
  }

  return prices;
}

async function start() {
  // Delete all data.
  // Generate price.
  // Save price data to database.

  const amountArg = parseInt(process.argv[2], 10) || 10;

  const [deleteResult] = await promiseResolver(Price.deleteMany({}));

  const newPrices = generatePrices(amountArg);

  const [createResult] = await promiseResolver(Price.create(newPrices));

  console.log(`Successfully generated ${createResult.length} price data...`);

  dbConnection.close();
}

start();
