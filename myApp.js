require('dotenv').config();
const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

// Create a new MongoClient
mongoose.connect(process.env.MONGO_URI,{useNewUrlParser: true, useUnifiedTopology: true});

const urlSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  shortId: Number
});

urlSchema.plugin(AutoIncrement, { inc_field: 'shortId' });
let Url = mongoose.model('Url', urlSchema);


const saveUrl = (url) => {
  return Url.create({ "url": url })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.error(err);
      throw err; // Re-throw the error for handling in the calling code
    });
};


const findUrlById = (shortId) => {
  return Url.find({shortId:shortId})
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.error(err);
      throw err; // Re-throw the error for handling in the calling code
    });
};



const removeUrlById = (shortId) => {
  return Url.findOneAndRemove({shortId:shortId})
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.error(err);
      throw err; // Re-throw the error for handling in the calling code
    });
};


const isUrl = (url) => {
  const urlRegex = /^(http?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
  return urlRegex.test(url);
};

exports.UrlModel = Url;
exports.findUrlById = findUrlById;
exports.removeUrlById = removeUrlById;
exports.saveUrl = saveUrl;
exports.isUrl = isUrl;