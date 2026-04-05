const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true ,
        trim: true
    },
    lastName: {
        type: String,
        required: true ,
        trim: true
    },
    email: {
        type: String,
        required: true ,
        required: [true, 'Please provide email'], 
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email'] ,
        trim: true
    },
    password: {
        type: String,
         required: [true, 'Please provide password'], 
        minlength: 6,
        select: false
    },
    phone: {
        type: String,
        required: true ,
        trim: true
    },
    address: {
         street: String, 
        city: String, 
        state: String, 
        zipCode: String 
    },
    role: {
         type: String, 
        enum: ['customer', 'restaurant_owner', 'admin', 'delivery_partner'], 
        default: 'customer' 
    },
      profileImage: String, 
    isActive: { 
        type: Boolean, 
        default: true 
    }, 
    createdAt: { 
        type: Date, 
        default: Date.now 
    } 
},
 { timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    } 
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.matchPassword = async function(enteredPassword) { 
  return await bcrypt.compare(enteredPassword, this.password); 
}; 

module.exports = mongoose.model('User', userSchema); 