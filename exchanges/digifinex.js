const axios = require('axios');

const { promiseResolver } = require('../utilities/helpers.js');

const baseUrl = 'https://openapi.digifinex.com/v3';

module.exports = {
  async fetchPrice() {
    const response = await axios.get(`${baseUrl}/ticker?symbol=bsi_usdt`);

    const { data } = response;
    const ticker = data.ticker[0];

    const priceData = {
      price: ticker.last,
      change24Hr: ticker.change,
      lastUpdatedAt: data.date * 1000,
    };

    return priceData;
  },
};
