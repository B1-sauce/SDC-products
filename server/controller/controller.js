const Model = require('../../mongo/schema/products.js')
const Style = Model.Style;
const Product = Model.Product;
const redis = require('redis');
const { promisify } = require('util')
const REDIS_PORT = 6379;
const client = redis.createClient(REDIS_PORT);

const GET_ASYNC = promisify(client.get).bind(client)
const SET_ASYNC = promisify(client.set).bind(client)

const getProducts = async (req, res) => {
  try {
    let page = Number(req.query.page);
    let count = Number(req.query.count);
    const reply = await GET_ASYNC(`${page}+${count}`)
    if (reply) {
      res.send(JSON.parse(reply))
      return
    }
    Product.find({ id: { $gt: (page - 1) * count, $lt: page * count + 1 } })
      .then(result => {
        var saveResult = SET_ASYNC(
          `${page}+${count}`,
          JSON.stringify(result),
          'EX',
          5000
        )
        console.log('new data cached', saveResult)
        res.send(result)
      })
      .catch(err => {
        console.log(err)
      })
  } catch (error) {
    res.send(error.message)
  }

}

const getSingleProduct = async (req, res) => {
  try {
    let productId = req.params.product_id;
    const reply = await GET_ASYNC(productId)
    if (reply) {
      res.send(JSON.parse(reply))
      return
    }
    Product.find({ id: productId })
      .then(result => {
        var saveResult = SET_ASYNC(
          productId,
          JSON.stringify(result),
          'EX',
          5000
        )
        console.log('new data cached', saveResult)
        res.send(result)
      })
      .catch(err => {
        console.log(err)
      })
  } catch (error) {
    res.send(error.message)
  }
}

const getStyle = async (req, res) => {
  try {
    let productId = req.params.product_id;
    const reply = await GET_ASYNC(`${productId}+style`)
    if (reply) {
      res.send(JSON.parse(reply))
      return
    }

    Style.find({ product_id: productId })
      .then(result => {
        var saveResult = SET_ASYNC(
          `${productId}+style`,
          JSON.stringify(result),
          'EX',
          5000
        )
        console.log('new data cached', saveResult)
        res.send(result)
      })
      .catch(err => {
        console.log(err)
      })
  } catch (error) {
    res.send(error.message)
  }
}


module.exports = {
  getProducts: getProducts,
  getSingleProduct: getSingleProduct,
  getStyle: getStyle
}