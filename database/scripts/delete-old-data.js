require('dotenv').config();

const Price = require('../models/price.js');
const { promiseResolver } = require('../../utilities/helpers.js');

async function deleteOldData() {
  // Delete data older than 3 days ago.
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
  const query = {
    created: { $lt: threeDaysAgo },
  };

  const [deleteResult, deleteError] = await promiseResolver(
    Price.deleteMany(query),
  );

  if (deleteError) {
    console.log('Delete error:', deleteError.message);
    return undefined;
  }

  console.log(`Deleted ${deleteResult.deletedCount} price data.`);

  return undefined;
}

module.exports = deleteOldData;
