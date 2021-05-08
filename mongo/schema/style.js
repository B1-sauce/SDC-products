const mongoose = require('mongoose');
const { Schema } = mongoose;



const StyleSchema = new Schema({
  style_id: { type: Number, index: { unique: true } },
  product_id: Number,
  name: String,
  original_price: String,
  sale_price: String,
  default: String,
  photos: [{
    thumbnail_url: String,
    url: String
  }],
  skus: {
    type: Map, of: String
  }
}, { strict: false })
StyleSchema.index({ style_id: 1 });

const Style = mongoose.model('Style', StyleSchema);


module.exports = {
  Style: Style
};