const csv = require('csv-parser');
const fs = require('fs');
const mongoose = require('mongoose');
const Model = require('./schema/products')
const Style = Model.Style;

mongoose.connect('mongodb://localhost:27017/test1', { useNewUrlParser: true }, { useUnifiedTopology: true });

const db = mongoose.connection;

db.once('open', (err, conn) => {
  console.log(`connected to mongoDB!`);
  const insertPhoto = () => {
    var bulk = Style.collection.initializeUnorderedBulkOp();
    var counter = 0;
    var batch = 0;
    const readStream = fs.createReadStream(__dirname + '/photos.csv')
      .pipe(csv({}))
      .on('data', data => {
        console.log(data)
        let newPhoto = {
          thumbnail_url: data.thumbnail_url,
          url: data.url
        }
        bulk.find({ style_id: Number(data.styleId) }).update(
          {
            $push:
            {
              photos: newPhoto
            }
          });
        counter++;
        if (counter % 1000 === 0) {
          readStream.pause(); //lets stop reading from file until we finish writing this batch to db
          bulk.execute(function (err, result) {
            if (err) null;   // or do something
            // possibly do something with result
            batch++;
            console.log(`${batch * 1000} photo entries finished, continuing...`)
          });
          bulk = Style.collection.initializeUnorderedBulkOp();
          readStream.resume(); //continue to read from file
        }
      })
      .on('err', err => console.log(err))
      .on('end', () => {
        console.log('less than 1000 photo entries to go...')
        if (counter % 1000 != 0) {
          bulk.execute((err, result) => {
            if (err) {
              null
            } else {
              console.log(`seeding done for ${counter} photo!`);
            }
          });
        }

      })
  }
  insertPhoto()
})


