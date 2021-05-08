const mongoose = require('mongoose');
const { Schema } = mongoose;
const productSchema = Schema({
  id: { type: Number, index: { unique: true } },
  name: String, // String is shorthand for {type: String}
  slogan: String,
  description: String,
  category: String,
  default_price: String,
  features: [{
    feature: String,
    value: String
  }],
  realtedItem: []
});
productSchema.index({ id: 1 });

const Product = mongoose.model('Product', productSchema);
// const Feature = mongoose.model('Feature', featureSchema);

module.exports = {
  Product: Product,
  // Feature: Feature
};