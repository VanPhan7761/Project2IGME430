const mongoose = require('mongoose');
const _ = require('underscore');

let AssetModel = {};

const setName = (name) => _.escape(name).trim();

const AssetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  age: {
    type: Number,
    min: 0,
    require: true,
  },

  //-----------
  // Changes for E
  //-----------
  description: {
    type: String,
    required: true,
    trim: false,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

AssetSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  age: doc.age,
  description: doc.description,
});

AssetSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    // Convert the string ownerId to an object id
    owner: mongoose.Types.ObjectId(ownerId),
  };

  return AssetModel.find(search)
    .select('name age description')
    .lean()
    .exec(callback);
};

AssetModel = mongoose.model('Asset', AssetSchema);

module.exports = AssetModel;
