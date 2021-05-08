const csv = require('csv-parser');
const fs = require('fs');
const mongoose = require('mongoose');
const Model = require('./schema/products.js')
const Product = Model.Product;

mongoose.connect('mongodb://localhost:27017/test1', { useNewUrlParser: true }, { useUnifiedTopology: true });

const db = mongoose.connection;

db.once('open', (err, conn) => {
  console.log(`connected to mongoDB!`);
  const seedDataForRelatedItemCSV = () => {
    var bulk = Product.collection.initializeUnorderedBulkOp();
    var counter = 0;
    var batch = 0;
    const readStream = fs.createReadStream(__dirname + '/related.csv')
      .pipe(csv({}))
      .on('data', data => {
        bulk.find({ id: Number(data.current_product_id) }).update(
          {
            $push:
            {
              realtedItem: Number(data.related_product_id)
            }
          });
        counter++;
        if (counter % 1000 === 0) {
          readStream.pause(); //lets stop reading from file until we finish writing this batch to db
          bulk.execute(function (err, result) {
            if (err) null;   // or do something
            // possibly do something with result
            batch++;
            console.log(`${batch * 1000} related entries finished, continuing...`)
          });
          bulk = Product.collection.initializeUnorderedBulkOp();
          readStream.resume(); //continue to read from file
        }
      })
      .on('err', err => console.log(err))
      .on('end', () => {
        console.log('less than 1000 related entries to go...')
        if (counter % 1000 != 0) {
          bulk.execute(function (err, result) {
            if (err) null;   // or something
            // maybe look at result
            console.log(`seeding done for ${counter} related!`);
          });
        }
      })
  }
  seedDataForRelatedItemCSV()
});
