const Express = require("express");
const BodyParser = require("body-parser");
const PORT = 3030;
const mongoose = require('mongoose');
const Model = require('./mongo/schema/products')
const Style = Model.Style;
const Product = Model.Product;

var app = Express();
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
app.listen(PORT, () => { console.log('Listening to ' + PORT) });

mongoose.connect('mongodb://localhost:27017/test1', { useNewUrlParser: true }, { useUnifiedTopology: true })
  .then(() => {
    console.log('connecting to mongo!')
  })
  .catch(err => {
    console.log(err)
  })
const db = mongoose.connection;

app.get('/products', (req, res) => {
  let page = Number(req.query.page);
  let count = Number(req.query.count);
  Product.find({ id: { $gt: (page - 1) * count, $lt: page * count + 1 } })
    .then(result => {
      res.send(result)
    })
    .catch(err => {
      console.log(err)
    })
})

app.get('/products/:product_id', (req, res) => {
  let productId = req.params.product_id
  Product.find({ id: productId })
    .then(result => {
      res.send(result)
    })
    .catch(err => {
      console.log(err)
    })
})

app.get('/products/:product_id/styles', (req, res) => {
  let productId = req.params.product_id
  Style.find({ product_id: productId })
    .then(result => {
      res.send(result)
    })
    .catch(err => {
      console.log(err)
    })
})
