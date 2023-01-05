require('dotenv').config();

const cron = require('node-cron');

const mongoConnect = require('./mongo-connect.js');
const deleteOldData = require('./delete-old-data.js');

const mongoUrl =
  process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/BSI-exchange-collector';

mongoConnect(mongoUrl);

/* ======================= Cron Jobs ======================= */

const everySundayNight = '0 0 * * 0';

cron.schedule(everySundayNight, deleteOldData);
