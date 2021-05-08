const mongoose= require('mongoose');
const { Schema } = mongoose;

const relatedItemSchema = new Schema({
  product_id: String,
  RelatedItemId: []
});

const RelatedItem = mongoose.model('RelatedItem', relatedItemSchema);


module.exports = RelatedItem;