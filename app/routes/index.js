const express = require('express');
const router = express.Router();
// Require storeController to control store requests in seperate file... organization matters!!!

const storeController = require('../controllers/storeController');

router.get('/', storeController.myMiddleware, storeController.homePage);

module.exports = router;
