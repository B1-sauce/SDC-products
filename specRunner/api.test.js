const app = require('../app.js');
// const app = server.app;
// const router = server.router;
// const express = require('express');
const request = require('supertest');
const mongoose = require('mongoose');
// const app = express();

beforeAll((done) => {
  mongoose.connect(
    "mongodb://localhost:27017/test1",
    { useNewUrlParser: true },
    () => done()
  )
})

afterAll(done => {
  // Closing the DB connection allows Jest to exit successfully.
  mongoose.connection.close()
  done()
})



it('should get the first 5 products', (done) => {
  const product = {
    id: 1,
    name: "Camo Onesie"
  }
  return request(app)
    .get('/products?page=1&count=5')
    .expect(201)
    .then((response) => {
      console.log('from response')
      // Check the response type and length
      expect(Array.isArray(response.body)).toBeTruthy()
      expect(response.body.length).toBe(5)

      // Check the response data
      expect(response.body[0].id).toBe(product.id)
      expect(response.body[0].name).toBe(product.name)
      done()
    })
    .catch(err => {
      console.log(err)
      console.log('coming from err')
      done()
    })
});

it('should get a specific product', (done) => {
  const style = {
    product_id: 5,
  }
  return request(app)
    .get('/products/5')
    .expect(200)
    .then((response) => {
      // Check the response type and length
      expect(response.body.length).toBe(1)

      // Check the response data
      expect(response.body[0].id).toBe(5)
      expect(response.body[0].name).toBe('Heir Force Ones')
      done()
    })
    .catch(err => {
      console.log(err)
      console.log('coming from err')
      done()
    })
});


it('should get the styles for the first product', (done) => {
  const style = {
    product_id: 1,
  }
  return request(app)
    .get('/products/1/styles')
    .expect(200)
    .then((response) => {
      // Check the response type and length
      expect(Array.isArray(response.body)).toBeTruthy()
      expect(response.body.length).toBe(6)

      // Check the response data
      expect(response.body[0].style_id).toBe(1)
      expect(response.body[0].product_id).toBe(style.product_id)
      done()
    })
    .catch(err => {
      console.log(err)
      console.log('coming from err')
      done()
    })
});

