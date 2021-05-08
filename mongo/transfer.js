const csv = require('csv-parser');
const fs = require('fs');
const mongoose = require('mongoose');
const Model = require('./schema/products.js')
const Product = Model.Product;

mongoose.connect('mongodb://localhost:27017/test1', { useNewUrlParser: true }, { useUnifiedTopology: true });

const db = mongoose.connection;

const seedDataForFeatureCSV = () => {
  var bulk = Product.collection.initializeUnorderedBulkOp();
  var counter = 0;
  var batch = 0;
  const readStream = fs.createReadStream(__dirname + '/features.csv')
    .pipe(csv({}))
    .on('data', data => {
      let newFeature = {
        feature: data.feature, value: data.value
      }
      bulk.find({ id: Number(data.productId) }).update(
        {
          $push:
          {
            features: newFeature
          }
        });
      counter++;
      if (counter % 1000 === 0) {
        readStream.pause(); //lets stop reading from file until we finish writing this batch to db
        bulk.execute(function (err, result) {
          if (err) null;   // or do something
          // possibly do something with result
          batch++;
          console.log(`${batch * 1000} feature entries finished, continuing...`)
        });
        bulk = Product.collection.initializeUnorderedBulkOp();
        readStream.resume(); //continue to read from file
      }
    })
    .on('err', err => console.log(err))
    .on('end', () => {
      console.log('less than 1000 feature entries to go...')
      if (counter % 1000 != 0) {
        bulk.execute(function (err, result) {
          if (err) null;   // or something
          // maybe look at result
          console.log(`seeding done for ${counter} feature!`);
        });
      }
    })
}

db.once('open', (err, conn) => {
  console.log(`connected to mongoDB!`);
  const importDataForProductCSV = () => {
    const seedDataForProductCSV = () => {
      var bulk = Product.collection.initializeUnorderedBulkOp();
      var counter = 0;
      var batch = 0;
      const readStream = fs.createReadStream(__dirname + '/product.csv')
        .pipe(csv({}))
        .on('data', data => {
          const product = new Product({
            id: data.id,
            name: data.name,
            slogan: data.slogan,
            description: data.description,
            category: data.category,
            default_price: data.default_price,
            features: [],
            realtedItem: []
          })
          bulk.insert(product);  // Bulk is okay if you don't need schema
          // defaults. Or can just set them.
          counter++;
          if (counter % 1000 === 0) {
            readStream.pause(); //lets stop reading from file until we finish writing this batch to db
            bulk.execute(function (err, result) {
              if (err) null;   // or do something
              // possibly do something with result
              batch++;
              console.log(`${batch * 1000} product entries finished, continuing...`)
            });
            bulk = Product.collection.initializeUnorderedBulkOp();
            readStream.resume(); //continue to read from file
          }
        })
        .on('err', err => console.log(err))
        .on('end', () => {
          console.log('less than 1000 product entries to go...')
          if (counter % 1000 != 0) {
            bulk.execute(function (err, result) {
              if (err) null;   // or something
              // maybe look at result
              console.log(`seeding done for ${counter} product!`);
            });
          }
          seedDataForFeatureCSV()
        })
    }
    db.db.listCollections().toArray((err, names) => {
      let exist = false;
      names.forEach((obj) => {
        if (obj.name === 'products') {
          exist = true;
        }
      });
      if (exist) {
        db.dropCollection('products', (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log('OLD COLLECTION DROPPED!');
            seedDataForProductCSV();
          }
        });
      } else {
        seedDataForProductCSV();
      }
    });
  }
  importDataForProductCSV();
})


