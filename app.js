const Express = require("express");
const BodyParser = require("body-parser");
const router = Express.Router();
const mongoose = require('mongoose');
const Model = require('./mongo/schema/products')
const Style = Model.Style;
const Product = Model.Product;

var app = Express();
app.use(BodyParser.json());
app.use('', router);
app.use(BodyParser.urlencoded({ extended: true }));


mongoose.connect('mongodb://localhost:27017/test1', { useNewUrlParser: true }, { useUnifiedTopology: true })
  .then(() => {
    console.log('connecting to mongo!')
  })
  .catch(err => {
    console.log(err)
  })
const db = mongoose.connection;

router.get('/loaderio-ea15dffc4acf1a237bf998540eb652cb/', (req, res) => {
  res.send(path.join(__dirname, '../loaderio-d70ce9175132d999fa0f36bf2d214fb0.txt'));
})

router.get('/products', (req, res) => {
  let page = Number(req.query.page);
  let count = Number(req.query.count);
  Product.find({ id: { $gt: (page - 1) * count, $lt: page * count + 1 } })
    .then(result => {
      res.status(201).send(result)
    })
    .catch(err => {
      console.log(err)
    })
})

router.get('/products/:product_id', (req, res) => {
  let productId = req.params.product_id
  Product.find({ id: productId })
    .then(result => {
      res.send(result)
    })
    .catch(err => {
      console.log(err)
    })
})

router.get('/products/:product_id/styles', (req, res) => {
  let productId = req.params.product_id
  Style.find({ product_id: productId })
    .then(result => {
      res.send(result)
    })
    .catch(err => {
      console.log(err)
    })
})

module.exports = router;
module.exports = app;