const express = require('express');
const router = express.Router();

const { register } = require('../controllers/authController.js');

//routes
// Register route

router.post('/register', register);

module.exports = router;