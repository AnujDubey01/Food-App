const express = require('express');
const router = express.Router();

const { registerController , loginController } = require('../controllers/authController.js');

//routes
// Register route
router.post('/register', registerController);

// Login route (to be implemented)
router.post('/login', loginController);

module.exports = router;