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


const StyleSchema = new Schema({
  style_id: { type: Number, index: { unique: true } },
  product_id: { type: Number, index: true },
  name: String,
  original_price: String,
  sale_price: String,
  default: String,
  photos: [{
    thumbnail_url: String,
    url: String
  }],
  skus: [{
    size: String,
    quantity: Number
  }]
})
StyleSchema.index({ style_id: 1, product_id: 1 });


const Product = mongoose.model('Product', productSchema);
const Style = mongoose.model('Style', StyleSchema);


module.exports = {
  Product: Product,
  Style: Style
};