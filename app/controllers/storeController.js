const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith('image/')
    if(isPhoto) {
      next(null, true);
    } else {
      next({ message: 'That filetype is not supported'}, false);
    }
  }
};

exports.homePage = (req, res) => {
  res.render('index');
};  

exports.addStore = (req, res) => {
    res.render('editStore', {
        title: 'Add Store'
    });
};  

exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next) => {
  // check if there is no new file to resize
  if (!req.file) {
    // skip to the next middleware
    next();
    return;
  }

  const extension = req.file.mimetype.split('/')[1];
  req.body.photo = `${uuid.v4()}.${extension}`;

  // now we resize
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(800, jimp.AUTO);
  await photo.write(`./public/uploads/${req.body.photo}`);

  // once we have written the photo to the filesystem keep moving
  next();
}

exports.createStore = async (req, res) => {
    const store = await (new Store(req.body)).save();
    await store.save();
    req.flash('success', `Successfully created ${store.name}. care to leave a review?`);
    res.redirect(`/store/${store.slug}`);
};

exports.getStores = async (req, res) => {
  // Query database for a list of the stores
  const stores = await Store.find();
  console.log(stores);

  res.render('stores', {
    title: 'Stores',
    stores
  });
};

exports.editStore = async (req, res) => {
  // Find the store given the ID
  const store = await Store.findOne({ _id: req.params.id })
  // Confirm they are the owner of the store
  // TODO

  // Render out the edit form so the user can update their store
  res.render('editStore', {
    title: `Edit ${store.name}`,
    store
  });
};

exports.updateStore = async (req, res) => {
  // set location data to be a point
  req.body.location.type = 'Point';

  // Find and update the store
  const store = await Store.findOneAndUpdate({_id: req.params.id}, req.body, {
    new: true, // return the new store insted of the old one
    runValidators: true
  }).exec();
  req.flash('success', `Successfully updated ${store.name}. <a href="/stores/${store.slug}">View Store -></a>`);
  res.redirect(`/stores/${store._id}/edit`);

  // Redirect them to the store and tell them it worked
}