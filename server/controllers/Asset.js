const models = require('../models');
const AssetModel = require('../models/Asset'); // Asset schema
const File = require('../models/filestore.js'); // File schema

const { Asset } = models;

const makerPage = (req, res) => res.render('app');

// handles adding the asset logic passed in from our req into the database
const makeAsset = async (req, res) => {
  // check if fields in place for user input
  if (!req.body.name || !req.body.age || !req.body.description) {
    return res
      .status(400)
      .json({ error: 'Both name, age, and description are required!' });
  }

  // check if there are files being uploaded
  if (!req.body.fileData) {
    return res.status(400).json({ error: 'No files data was uploaded' });
  }

  if (!req.files || !req.files.sampleFile) {
    return res.status(400).json({ error: 'No files were uploaded' });
  }

  // grab the files from the user and save
  const { sampleFile } = req.files;

  // creating our asset obj which holds who owns the obj and what file to download from the obj

  try {
    // save the file to the database
    const newFile = new File(sampleFile);
    const doc = await newFile.save();

    console.log(doc._id);
    const assetData = {
      name: req.body.name,
      age: req.body.age,
      description: req.body.description,
      fileId: doc._id,
      owner: req.session.account._id,
    };

    // save the info of the asset to the database
    const newAsset = new Asset(assetData);
    await newAsset.save();

    return res.status(201).json({
      name: newAsset.name,
      age: newAsset.age,
      description: newAsset.description,
    });
    // return res.json({ redirect: '/maker' });
  } catch (err) {
    // console.log(err);

    // check if we our error is because that asset has already been uploaded
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Asset already exists!' });
    }

    return res.status(400).json({ error: 'An error occured' });
  }
};

// getting all assets
const getAssets = (req, res) => AssetModel.findByOwner(req.session.account._id, (err, docs) => {
  // console.log(AssetModel);
  if (err) {
    // console.log(err);
    return res.status(400).json({ error: 'An error occured!' });
  }

  return res.json({ assets: docs });
});

// load all assets that exists
const getAllAssets = async (req, res) => {
  // console.log('getting all assets');
  try {
    const docs = await Asset.find({}).exec();

    // console.log(docs);

    return res.json({ assets: docs });
  } catch (err) {
    // console.log('Error getting all assets');
    return res.status(400).json({ error: 'cannot get all assets!' });
  }
};

// const storePage = async (req, res) => {
//   try {
//     return res.status(200).json({ message: "You made to the funny store!" });
//   } catch {
//     return res.status(400).json({ error: "You made to the funny store!" });
//   }
// };

module.exports = {
  makerPage,
  makeAsset,
  getAssets,
  getAllAssets,
};
