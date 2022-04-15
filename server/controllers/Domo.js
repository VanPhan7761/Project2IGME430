const models = require('../models');
const DomoModel = require('../models/Domo');

const { Domo } = models;

const makerPage = (req, res) => res.render('app');

//handles adding the domo logic passed in from our req into the database
const makeDomo = async (req, res) => {
  if (!req.body.name || !req.body.age || !req.body.description) {
    return res.status(400).json({ error: 'Both name, age, and description are required!' });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    description: req.body.description,
    owner: req.session.account._id,
  };

  try {
    const newDomo = new Domo(domoData);
    await newDomo.save();

    //handles returning the domo json obj
    console.log("domo added!")
    return res.status(201).json({ name: newDomo.name, age: newDomo.age, description: newDomo.description });
    // return res.json({ redirect: '/maker' });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists!' });
    }
    return res.status(400).json({ error: 'An error occured' });
  }
};

const getDomos = (req, res) => DomoModel.findByOwner(req.session.account._id, (err, docs) => {
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
};
