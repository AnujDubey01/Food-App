const mongoose = reqquire('mongoose');

const orderSchema = new mongoose.Schema({
    orderId: { 
        type: String, 
        unique: true 
    }, 
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    items: [{ 
        menuItem: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'MenuItem' 
    }, 
        quantity: Number, 
        price: Number 
  }],
    totalPrice: {
        type: Number,
        required: true,
        min: 0
    },
    deliveryCharge: Number,
    discount: {
        type: Number,
        default: 0,
    },
    finalPrice: Number, 
    deliveryAddress: { 
        street: String, 
        city: String, 
        state: String, 
        zipCode: String 
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        enum: ['Card', 'UPI', 'Cash on Delivery', 'Wallet'], 
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    deliveryPartner: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }, 
  specialInstructions: String, 
  estimatedDeliveryTime: Date, 
  deliveredAt: Date, 
    createdAt: { 
        type: Date, 
        default: Date.now 
    } 
}, { timestamps: true }); 


// Generate unique orderId before saving
orderSchema.pre('save', async function (next) {
    if (!this.this.orderId) {
        this.orderId = 'ORD-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
        return next();
    }
});

module.exports = mongoose.model('Order', orderSchema);