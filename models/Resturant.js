const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name: {
        tyope: String,
        required: true,
        unique: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true, 
    },
    description: String, 
    cuisine: [String], // ['Indian', 'Chinese', 'Italian']
      address: { 
    street: String, 
    city: String, 
    state: String, 
    zipCode: String, 
    coordinates: { 
      latitude: Number, 
      longitude: Number 
     }
    },
    phone: String, 
    email: String, 
    rating: { 
        type: Number, 
        min: 0, 
        max: 5, 
        default: 0 
    }, 
    totalReviews: { 
        type: Number, 
        default: 0 
    }, 
    image: String, 
    isOpen: { 
        type: Boolean, 
        default: true 
    }, 
    openingTime: String,    // HH:MM format 
    closingTime: String,    // HH:MM format 
    deliveryTime: Number,   // minutes 
    minimumOrder: Number,   // minimum order amount 
    deliveryCharge: Number, 
    isVerified: { 
        type: Boolean, 
        default: false 
    }, 
    createdAt: { 
        type: Date, 
        default: Date.now 
    } 
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);