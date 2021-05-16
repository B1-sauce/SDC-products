const Express = require("express");
const BodyParser = require("body-parser");
const router = Express.Router();
const mongoose = require('mongoose');
const Model = require('../mongo/schema/products.js')
const Style = Model.Style;
const Product = Model.Product;


const path = require('path');
const redis = require('redis');
const REDIS_PORT = 6379;
const client = redis.createClient(REDIS_PORT);
const controller = require('./controller/controller.js');

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
  res.send('loaderio-ea15dffc4acf1a237bf998540eb652cb');
})

const cache = (req, res, next) => {
  let page = Number(req.query.page);
  let count = Number(req.query.count);
  for (var id = (page - 1) * count; id <= page * count; id++) {
    client.get(id, (err, data) => {
      if (err) {
        throw err;
      }
      if (data !== null) {
        res.status(200).send(data);
      } else {
        next();
      }
    })
  }
}


router.get('/products', controller.getProducts)
router.get('/products/:product_id', controller.getSingleProduct)
router.get('/products/:product_id/styles', controller.getStyle)
// router.get('/products/:product_id', (req, res) => {
//   let productId = req.params.product_id
//   Product.find({ id: productId })
//     .then(result => {
//       res.send(result)
//     })
//     .catch(err => {
//       console.log(err)
//     })
// })

// router.get('/products/:product_id/styles', (req, res) => {
//   let productId = req.params.product_id
//   Style.find({ product_id: productId })
//     .then(result => {
//       res.send(result)
//     })
//     .catch(err => {
//       console.log(err)
//     })
// })

module.exports = router;
module.exports = app;