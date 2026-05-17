const express = require('express');
const { get } = require('mongoose');
const router = express.Router();
const { getUserController , UpdateUserController } = require('../controllers/userController.js');  
const {protect} = require('../middleware/authMiddleware.js');

//routes
router.get('/getUser', protect, getUserController);
// update profile
router.put('/updateUser' , protect , UpdateUserController);
module.exports = router;