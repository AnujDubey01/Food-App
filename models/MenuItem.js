const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    category: { 
        type: String, 
        required: true 
    // 'Appetizers', 'Main Course', 'Desserts', 'Beverages' 
    }, 
    price: {
        type: Number,
        required: true,
        min: 0
    },
        image: String, 
        isVegetarian: Boolean, 
        isSpicy: Boolean, 
        preparationTime: Number, // minutes 
    availability: { 
        type: Boolean, 
        default: true 
    }, 
    ratings: { 
        type: Number, 
        default: 0 
    }, 
    createdAt: { 
        type: Date, 
        default: Date.now 
    } 
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', menuItemSchema);