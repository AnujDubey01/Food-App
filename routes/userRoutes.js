const express = require('express');
const { get } = require('mongoose');
const router = express.Router();
const { getUserController } = require('../controllers/userController.js');  
const authMiddleware = require('../middleware/authMiddleware.js');

//routes
router.get('/getUser', authMiddleware, getUserController);
// Register 
module.exports = router;