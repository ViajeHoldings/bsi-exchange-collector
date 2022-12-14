const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const priceSchema = new Schema({
  price: Number,
  change24Hr: Number,
  lastUpdatedAt: Date,
  created: { type: Date, default: Date.now },
});

const Model = model('Price', priceSchema);

module.exports = Model;
