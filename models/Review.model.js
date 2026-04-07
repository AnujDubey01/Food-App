const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    
    resturant: {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Restaurant',
        required : true
    },
    user: {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);