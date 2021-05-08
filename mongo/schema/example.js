const mongoose = require('mongoose');
const LineInputStream = require('line-input-stream');
const fs = require('fs');
const path = require('path');
const model = require('./model.js');
const address = require('./ip.js');
const Reviews = model.Reviews;
const Reviews_photos = model.Reviews_photos;
const Characs = model.Characs;
// open a connection
mongoose.connect(`mongodb://${address}/reviews_ratings`, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', (err, conn) => {
  console.log(`connected to mongoDB@${address}!`);
  // function to seed reviews collection with data
  // for characs collections:
  const importDataForCharacCSV = () => {
    const seedCharacCollection = () => {
      const stream = LineInputStream(fs.createReadStream(path.join(__dirname, './data/characteristics.csv'), {start: 19}));
      // stream.setDelimiter("\n");
      // lower level method, needs connection
      var bulk = Characs.collection.initializeUnorderedBulkOp();
      var counter = 0;
      var batch = 0;
      stream.on("error",function(err) {
        console.log(err); // or otherwise deal with it
      });
      stream.on("line",function(line) {
        var row = line.split(",");     // split the lines on delimiter
        var obj = new Characs({
          _id: row[0],
          product_id: row[1],
          name: JSON.parse(row[2]),
          totalValue: 0,
          totalReview: 0,
          recommended: 0,
          rating: {}
        });
        bulk.insert(obj);  // Bulk is okay if you don't need schema
                            // defaults. Or can just set them.
        counter++;
        if ( counter % 1000 === 0 ) {
          stream.pause(); //lets stop reading from file until we finish writing this batch to db
          bulk.execute(function(err,result) {
              if (err) null;   // or do something
              // possibly do something with result
              batch++;
              console.log(`${batch * 1000} characteristics entries finished, continuing...`)
              bulk = Characs.collection.initializeUnorderedBulkOp();
              stream.resume(); //continue to read from file
          });
        }
      });
      stream.on("end",function() {
        console.log('less than 1000 characteristics entries to go...')
        if ( counter % 1000 != 0 ) {
            bulk.execute(function(err,result) {
                if (err) null;   // or something
                // maybe look at result
                console.log(`seeding done for ${counter} characteristics!`);
            });
        }
      });
    };
    db.db.listCollections().toArray((err, names) => {
      let exist = false;
      names.forEach((obj) => {
        if (obj.name === 'characs') {
          exist = true;
        }
      });
      if (exist) {
        db.dropCollection('characs', (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log('OLD COLLECTION DROPPED!');
            seedCharacCollection();
          }
        });
      } else {
        seedCharacCollection();
      }
    });
  };
  // seed collections
  importDataForCharacCSV();
});