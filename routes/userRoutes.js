const express = require('express');
const { get } = require('mongoose');
const router = express.Router();
const { getUserController } = require('../controllers/userController.js');  

//routes
router.get('/getUser', getUserController);
// Register 
module.exports = router;