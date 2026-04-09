const User = require('../models/User.model.js');

const registerController = async (req, res) => {
   try {
    const { firstName, lastName, email, password, phone, address, role } = req.body;

    // Basic validation
    if (!firstName || !lastName || !email || !password || !phone) {
        return res.status(500).json({
            success: false,
            message: 'Please provide all required fields',
        });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(500).json({
            success: false,
            message: 'User already exists with this email',
        });
    }

    // Create new user
    const newUser = await  User.create({
        firstName,
        lastName,
        email,
        password,
        phone,
        address,
        role
    })

    res.status(200).json({
        success: true,
        message: 'User registered successfully',
    });
    } catch (error) {
    res.status(500).json({
         success: false,
         message: 'Error registering user: ' + error.message,
    });
   }
}

module.exports = {
    register: registerController,
};