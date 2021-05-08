const mongoose = require('mongoose');
const LineInputStream = require('line-input-stream');
const fs = require('fs');
const path = require('path');
const Model = require('./schema/products.js')
const Product = Model.Product;
const csv = require('csv-parser');
// const Feature = Model.Feature;

mongoose.connect('mongodb://localhost:27017/test1', { useNewUrlParser: true }, { useUnifiedTopology: true });
const db = mongoose.connection;
const seedDataForFeatureCSV = () => {
  const stream = LineInputStream(fs.createReadStream(__dirname + '/feature_test.csv'));
  var bulk = Product.collection.initializeUnorderedBulkOp();
  var counter = 0;
  var batch = 0;
  stream.on("error", function (err) {
    console.log(err); // or otherwise deal with it
  });
  stream.on("line", function (line) {
    var row = line.split(",");     // split the lines on delimiter
    // const feature = new Feature({
    //   productId: row[1],
    //   feature: row[2],
    //   value: row[3]
    // });
    // console.log(row);
    // console.log((row[1]))
    let newFeature = {
      feature: row[2], value: row[3]
    }
    bulk.find({ id: Number(row[1]) }).update(
      {
        $push:
        {
          features: newFeature

        }
      });
    counter++;
    if (counter % 1000 === 0) {
      stream.pause(); //lets stop reading from file until we finish writing this batch to db
      bulk.execute(function (err, result) {
        if (err) null;   // or do something
        // possibly do something with result
        batch++;
        console.log(`${batch * 1000} feature entries finished, continuing...`)
      });
      bulk = Product.collection.initializeUnorderedBulkOp();
      stream.resume(); //continue to read from file
    }
  });
  stream.on("end", function () {
    console.log('less than 1000 feature entries to go...')
    if (counter % 1000 != 0) {
      bulk.execute(function (err, result) {
        if (err) null;   // or something
        // maybe look at result
        console.log(`seeding done for ${counter} feature!`);
      });
    }
  });
}

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', (err, conn) => {
  console.log(`connected to mongoDB!`);
  // function to seed reviews collection with data
  // for characs collections:
  const importDataForProductCSV = () => {
    const seedDataForProductCSV = () => {
      const stream = LineInputStream(fs.createReadStream(__dirname + '/test.csv'));
      // stream.setDelimiter("\n");
      // lower level method, needs connection
      var bulk = Product.collection.initializeUnorderedBulkOp();
      var counter = 0;
      var batch = 0;
      stream.on("error", function (err) {
        console.log(err); // or otherwise deal with it
      });
      stream.on("line", function (line) {
        var row = line.split(",");     // split the lines on delimiter
        // console.log(row);
        const product = new Product({
          id: row[0],
          name: row[1],
          slogan: row[2],
          description: row[3],
          category: row[4],
          default_price: row[5],
          features: []
        });
        bulk.insert(product);  // Bulk is okay if you don't need schema
        // defaults. Or can just set them.
        counter++;
        if (counter % 1000 === 0) {
          stream.pause(); //lets stop reading from file until we finish writing this batch to db
          bulk.execute(function (err, result) {
            if (err) null;   // or do something
            // possibly do something with result
            batch++;
            console.log(`${batch * 1000} product entries finished, continuing...`)
          });
          bulk = Product.collection.initializeUnorderedBulkOp();
          stream.resume(); //continue to read from file

        }
      });
      stream.on("end", function () {
        console.log('less than 1000 product entries to go...')
        if (counter % 1000 != 0) {
          bulk.execute(function (err, result) {
            if (err) null;   // or something
            // maybe look at result
            console.log(`seeding done for ${counter} product!`);
          });
        }
        seedDataForFeatureCSV()
      });
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
  };
  // seed collections
  importDataForProductCSV();
});


