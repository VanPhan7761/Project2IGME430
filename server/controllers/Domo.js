const models = require('../models');
const DomoModel = require('../models/Domo'); //Asset schema
const File = require('../models/filestore.js'); //File schema

const { Domo } = models;

const makerPage = (req, res) => res.render('app');

//handles adding the domo logic passed in from our req into the database
const makeDomo = async (req, res) => {

  //check if fields in place for user input
  if (!req.body.name || !req.body.age || !req.body.description) {
    return res.status(400).json({ error: 'Both name, age, and description are required!' });
  }

  //check if there are files being uploaded
  if(!req.body.fileData){
    return res.status(400).json({ error: 'No files data was uploaded' });
  }

  if (!req.files || !req.files.sampleFile ) {
    return res.status(400).json({ error: 'No files were uploaded' });
  }

  //grab the files from the user and save
  const { sampleFile } = req.files;

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    description: req.body.description,
    owner: req.session.account._id,
  };

  try {
    //save the info of the asset to the database
    const newDomo = new Domo(domoData);
    await newDomo.save();

    //save the file to the database
    const newFile = new File(sampleFile);
    const doc = await newFile.save();

    console.log(doc._id); 

    //handles returning the domo json obj
    console.log("domo added!")


    return res.status(201).json({ name: newDomo.name, age: newDomo.age, description: newDomo.description });
    // return res.json({ redirect: '/maker' });
  } catch (err) {
    console.log(err);

    //check if we our error is because that asset has already been uploaded
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists!' });
    }

    return res.status(400).json({ error: 'An error occured' });
  }

};

//getting all domos
const getDomos = (req, res) => DomoModel.findByOwner(req.session.account._id, (err, docs) => {
  //console.log(DomoModel);
  if (err) {
    console.log(err);
    return res.status(400).json({ error: 'An error occured!' });
  }

  return res.json({ domos: docs });
});

const getAllDomos = (req, res) => DomoModel.findByOwner(req.session.account._id, (err, docs) => {
  console.log(DomoModel);
  if (err) {
    console.log(err);
    return res.status(400).json({ error: 'An error occured!' });
  }

  return res.json({ domos: docs });
});

module.exports = {
  makerPage,
  makeDomo,
  getDomos,
  getAllDomos,
};
