const csv = require('csv-parser');
const fs = require('fs');
const mongoose = require('mongoose');
const Model = require('./schema/style.js')
const SingleStyle = Model.SingleStyle;
const Style = Model.Style;

mongoose.connect('mongodb://localhost:27017/test1', { useNewUrlParser: true }, { useUnifiedTopology: true });

const db = mongoose.connection;
const transferDefault = (str) => {
  if (str === "1") {
    return true
  } else {
    return false
  }
}
const seedStylesData = () => {
  var bulk = Style.collection.initializeUnorderedBulkOp();
  var counter = 0;
  var batch = 0;
  const readStream = fs.createReadStream(__dirname + '/photos.csv')
    .pipe(csv({}))
    .on('data', data => {
      let photo = {
        id: Number(data.id),
        thumbnail_url: data.thumbnail_url,
        url: data.url
      }
      bulk.find({ style_id: Number(data.styleId) }).update(
        {
          $push:
          {
            photos: photo
          }
        });
      counter++;
      if (counter % 1000 === 0) {
        readStream.pause(); //lets stop reading from file until we finish writing this batch to db
        bulk.execute(function (err, result) {
          if (err) null;   // or do something
          // possibly do something with result
          batch++;
          console.log(`${batch * 1000} singleStyle entries finished, continuing...`)
        });
        bulk = Style.collection.initializeUnorderedBulkOp();
        readStream.resume(); //continue to read from file
      }
    })
    .on('err', err => console.log(err))
    .on('end', () => {
      console.log('less than 1000 singleStyle entries to go...')
      if (counter % 1000 !== 0) {
        bulk.execute(function (err, result) {
          if (err) null;   // or something
          // maybe look at result
          console.log(`seeding done for ${counter} singleStyle!`);
        });
      }
    })
}


db.once('open', (err, conn) => {
  console.log(`connected to mongoDB!`);
  const seedDataForStyletemCSV = () => {
    var bulk = Style.collection.initializeUnorderedBulkOp();
    var counter = 0;
    var batch = 0;
    const readStream = fs.createReadStream(__dirname + '/product.csv')
      .pipe(csv({}))
      .on('data', data => {
        const style = new Style({
          product_id: data.id,
          results: []
        })
        bulk.insert(style);
        counter++;
        if (counter % 1000 === 0) {
          readStream.pause(); //lets stop reading from file until we finish writing this batch to db
          bulk.execute(function (err, result) {
            if (err) null;   // or do something
            // possibly do something with result
            batch++;
            console.log(`${batch * 1000} style entries finished, continuing...`)
          });
          bulk = Style.collection.initializeUnorderedBulkOp();
          readStream.resume(); //continue to read from file
        }
      })
      .on('err', err => console.log(err))
      .on('end', () => {
        console.log('less than 1000 style entries to go...')
        if (counter % 1000 !== 0) {
          bulk.execute(function (err, result) {
            if (err) null;   // or something
            // maybe look at result
            console.log(`seeding done for ${counter} style!`);
          });
        }
        seedStylesData()
      })
  }
  db.db.listCollections().toArray((err, names) => {
    let exist = false;
    names.forEach((obj) => {
      if (obj.name === 'styles') {
        exist = true;
      }
    });
    if (exist) {
      db.dropCollection('styles', (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log('OLD COLLECTION DROPPED!');
          seedDataForStyletemCSV();
        }
      });
    } else {
      seedDataForStyletemCSV();
    }
  });
});