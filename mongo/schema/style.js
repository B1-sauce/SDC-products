const mongoose = require('mongoose');
const { Schema } = mongoose;

const style = new Schema({
  style_id: Number,
  name: String,
  original_price: String,
  sale_price: String,
  default?: String,
  photos: [{
    thumbnail_url: String,
    url: String
  }],
  skus: {
    skus_id: {
      quantity: Number,
      size: String
    }
  }
})

const stylesSchema = new Schema({
  product_id: String,
  result: [style]
});


const Styles = mongoose.model('Styles', stylesSchema);
const Style = mongoose.model('Style', styleSchema);

module.exports = {
  Styles: Styles,
  Style: Style
};