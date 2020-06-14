const mongoose = require('mongoose');
  module.exports = () => {
    mongoose.connect('mongodb://biracini:sadece0ben@ds237475.mlab.com:37475/heroku_05d8m1wn', { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});    
      mongoose.connection.on('open', () => {
      });
        mongoose.connection.on('error', (err) => {
        console.log('MongoDB: Error', err);
  });
         
  mongoose.Promise = global.Promise;
};
