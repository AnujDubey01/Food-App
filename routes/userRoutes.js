const express = require('express');
const { get } = require('mongoose');
const router = express.Router();
const { getUserController , UpdateUserController } = require('../controllers/userController.js');  
const authMiddleware = require('../middleware/authMiddleware.js');

//routes
router.get('/getUser', authMiddleware, getUserController);
// update profile
router.put('/updateUser' , authMiddleware , UpdateUserController);
module.exports = router;