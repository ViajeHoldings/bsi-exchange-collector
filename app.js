require('dotenv').config();

const CoinGecko = require('coingecko-api');

const mongoConnect = require('./database/scripts/mongo-connect.js');
const Price = require('./database/models/price.js');
const { promiseResolver } = require('./utilities/helpers.js');

const CoinGeckoClient = new CoinGecko();
const mongoUrl =
  process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/BSI-exchange-collector';
const delay = parseInt(process.env.REQUEST_INTERVAL, 10) || 30000;

async function getLatestPrice() {
  const params = {
    ids: 'bali-social-integrated',
    vs_currencies: 'usd',
    include_last_updated_at: true,
    include_24hr_change: true,
  };
  const result = await CoinGeckoClient.simple.price(params);

  if (!result.success) {
    throw new Error(result.message);
  }

  return result.data;
}

async function createNewPrice(data) {
  const newPrice = {
    price: data.usd,
    change24Hr: data.usd_24h_change,
    lastUpdatedAt: data.last_updated_at * 1000,
  };

  const [result, createErr] = await promiseResolver(Price.create(newPrice));

  return result;
}

async function updatePriceDatabase(data) {
  const sortKey = '-created';
  const [latest] = await promiseResolver(Price.findOne({}).sort(sortKey));

  const incomingDataTime = data.last_updated_at;
  const storedDataTime = latest?.lastUpdatedAt.getTime() / 1000;

  // Only update if it gets the latest data according to "last_updated_at".
  if (latest === null || incomingDataTime > storedDataTime) {
    await createNewPrice(data);
  }
}

function fetchOnInterval() {
  const intervalId = setInterval(async () => {
    const [priceData, priceErr] = await promiseResolver(getLatestPrice());

    if (priceErr) {
      console.error(priceErr.message);
      return undefined;
    }

    const [dbData, dbErr] = await promiseResolver(
      updatePriceDatabase(priceData['bali-social-integrated']),
    );

    console.log('Price data:', priceData);
  }, delay);

  return intervalId;
}

async function init() {
  const dbConnection = mongoConnect(mongoUrl);

  fetchOnInterval();
}

init();
