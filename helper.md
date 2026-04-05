# Restaurant Food App Backend - Complete Guide

## Project Overview
This guide provides step-by-step instructions to build a complete backend system for a restaurant food delivery app using Node.js, Express.js, and MongoDB.

---

## 1. Project Structure

```
Food-App/
├── config/
│   ├── database.js          # Database connection
│   └── dotenv.js            # Environment variables
├── controllers/
│   ├── restaurantController.js
│   ├── menuController.js
│   ├── orderController.js
│   ├── userController.js
│   └── authController.js
├── middleware/
│   ├── authMiddleware.js
│   ├── errorHandler.js
│   └── validation.js
├── models/
│   ├── Restaurant.js
│   ├── MenuItem.js
│   ├── Order.js
│   ├── User.js
│   └── Review.js
├── routes/
│   ├── authRoutes.js
│   ├── restaurantRoutes.js
│   ├── menuRoutes.js
│   ├── orderRoutes.js
│   └── userRoutes.js
├── utils/
│   ├── emailService.js
│   ├── paymentService.js
│   └── validators.js
├── .env
├── .gitignore
├── server.js
└── package.json
```

---

## 2. Initial Setup

### 2.1 Install Dependencies

```bash
npm init -y
npm install express mongoose dotenv cors bcryptjs jsonwebtoken multer nodemailer axios
npm install --save-dev nodemon
```

### 2.2 Update package.json

```json
{
  "name": "food-app",
  "version": "1.0.0",
  "description": "Restaurant Food Delivery App Backend",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.0.0",
    "dotenv": "^16.0.3",
    "cors": "^2.8.5",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.0",
    "multer": "^1.4.5",
    "nodemailer": "^6.9.1",
    "axios": "^1.3.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.20"
  }
}
```

---

## 3. Environment Configuration

### 3.1 Create .env file

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/food-app
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
STRIPE_SECRET_KEY=your_stripe_secret
```

### 3.2 config/dotenv.js

```javascript
require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRE: process.env.JWT_EXPIRE,
  CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY
};
```

### 3.3 config/database.js

```javascript
const mongoose = require('mongoose');
const config = require('./dotenv');

const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
```

---

## 4. Database Models

### 4.1 models/User.js

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please provide first name'],
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 6,
    select: false
  },
  phone: {
    type: String,
    required: true
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
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

### 4.2 models/Restaurant.js

```javascript
const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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
```

### 4.3 models/MenuItem.js

```javascript
const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  category: {
    type: String,
    required: true
    // 'Appetizers', 'Main Course', 'Desserts', 'Beverages'
  },
  price: {
    type: Number,
    required: true
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
```

### 4.4 models/Order.js

```javascript
const mongoose = require('mongoose');

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
    required: true
  },
  deliveryCharge: Number,
  discount: {
    type: Number,
    default: 0
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
    enum: ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  paymentMethod: {
    type: String,
    enum: ['Card', 'UPI', 'Cash on Delivery', 'Wallet'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed'],
    default: 'Pending'
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

// Generate unique Order ID before saving
orderSchema.pre('save', async function(next) {
  if (!this.orderId) {
    this.orderId = 'ORD' + Date.now();
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
```

### 4.5 models/Review.js

```javascript
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  comment: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
```

---

## 5. Middleware

### 5.1 middleware/authMiddleware.js

```javascript
const jwt = require('jsonwebtoken');
const config = require('../config/dotenv');

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'You do not have permission to perform this action' });
    }
    next();
  };
};
```

### 5.2 middleware/errorHandler.js

```javascript
exports.errorHandler = (err, req, res, next) => {
  const error = { ...err };
  error.message = err.message;

  // Log to console for dev
  console.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found`;
    error.statusCode = 404;
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = `Duplicate field value entered`;
    error.statusCode = 400;
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error'
  });
};
```

### 5.3 middleware/validation.js

```javascript
exports.validateRegister = (req, res, next) => {
  const { firstName, lastName, email, password, phone } = req.body;

  if (!firstName || !lastName || !email || !password || !phone) {
    return res.status(400).json({ success: false, message: 'Please provide all required fields' });
  }

  if (password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
  }

  next();
};

exports.validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password' });
  }

  next();
};
```

---

## 6. Controllers

### 6.1 controllers/authController.js

```javascript
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config/dotenv');

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRE
  });
};

exports.register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, phone, role } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    // Create user
    user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phone,
      role: role || 'customer'
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};
```

### 6.2 controllers/restaurantController.js

```javascript
const Restaurant = require('../models/Restaurant');

exports.createRestaurant = async (req, res, next) => {
  try {
    const { name, description, cuisine, address, phone, email, openingTime, closingTime } = req.body;

    const restaurant = await Restaurant.create({
      owner: req.user.id,
      name,
      description,
      cuisine,
      address,
      phone,
      email,
      openingTime,
      closingTime
    });

    res.status(201).json({
      success: true,
      message: 'Restaurant created successfully',
      data: restaurant
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllRestaurants = async (req, res, next) => {
  try {
    const restaurants = await Restaurant.find({ isVerified: true })
      .populate('owner', 'firstName lastName email');

    res.status(200).json({
      success: true,
      count: restaurants.length,
      data: restaurants
    });
  } catch (error) {
    next(error);
  }
};

exports.getRestaurantById = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
      .populate('owner', 'firstName lastName email');

    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    res.status(200).json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    next(error);
  }
};

exports.updateRestaurant = async (req, res, next) => {
  try {
    let restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    if (restaurant.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this restaurant' });
    }

    restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Restaurant updated successfully',
      data: restaurant
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    if (restaurant.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this restaurant' });
    }

    await Restaurant.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Restaurant deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
```

### 6.3 controllers/menuController.js

```javascript
const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant');

exports.createMenuItem = async (req, res, next) => {
  try {
    const { restaurantId, name, description, category, price, isVegetarian } = req.body;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    if (restaurant.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const menuItem = await MenuItem.create({
      restaurant: restaurantId,
      name,
      description,
      category,
      price,
      isVegetarian
    });

    res.status(201).json({
      success: true,
      message: 'Menu item created successfully',
      data: menuItem
    });
  } catch (error) {
    next(error);
  }
};

exports.getMenuByRestaurant = async (req, res, next) => {
  try {
    const menuItems = await MenuItem.find({ restaurant: req.params.restaurantId });

    res.status(200).json({
      success: true,
      count: menuItems.length,
      data: menuItems
    });
  } catch (error) {
    next(error);
  }
};

exports.updateMenuItem = async (req, res, next) => {
  try {
    let menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }

    const restaurant = await Restaurant.findById(menuItem.restaurant);
    if (restaurant.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    menuItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Menu item updated successfully',
      data: menuItem
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteMenuItem = async (req, res, next) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }

    const restaurant = await Restaurant.findById(menuItem.restaurant);
    if (restaurant.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await MenuItem.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Menu item deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
```

### 6.4 controllers/orderController.js

```javascript
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');

exports.createOrder = async (req, res, next) => {
  try {
    const { restaurantId, items, deliveryAddress, paymentMethod, specialInstructions } = req.body;

    let totalPrice = 0;

    // Verify items and calculate total
    for (let item of items) {
      const menuItem = await MenuItem.findById(item.menuItem);
      if (!menuItem) {
        return res.status(404).json({ success: false, message: `Menu item not found` });
      }
      totalPrice += menuItem.price * item.quantity;
    }

    const order = await Order.create({
      customer: req.user.id,
      restaurant: restaurantId,
      items,
      totalPrice,
      deliveryAddress,
      paymentMethod,
      specialInstructions,
      finalPrice: totalPrice
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer')
      .populate('restaurant')
      .populate('items.menuItem');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ customer: req.user.id })
      .populate('restaurant', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    let order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const restaurant = await Restaurant.findById(order.restaurant);
    if (restaurant.owner.toString() !== req.user.id && order.customer.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    order = await Order.findByIdAndUpdate(req.params.id, { status }, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

exports.cancelOrder = async (req, res, next) => {
  try {
    let order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.customer.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (order.status !== 'Pending' && order.status !== 'Confirmed') {
      return res.status(400).json({ success: false, message: 'Cannot cancel this order' });
    }

    order = await Order.findByIdAndUpdate(req.params.id, { status: 'Cancelled' }, {
      new: true
    });

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
};
```

---

## 7. Routes

### 7.1 routes/authRoutes.js

```javascript
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validationMiddleware = require('../middleware/validation');

router.post('/register', validationMiddleware.validateRegister, authController.register);
router.post('/login', validationMiddleware.validateLogin, authController.login);

module.exports = router;
```

### 7.2 routes/restaurantRoutes.js

```javascript
const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware.protect, authMiddleware.authorize('restaurant_owner', 'admin'), restaurantController.createRestaurant);
router.get('/', restaurantController.getAllRestaurants);
router.get('/:id', restaurantController.getRestaurantById);
router.put('/:id', authMiddleware.protect, restaurantController.updateRestaurant);
router.delete('/:id', authMiddleware.protect, restaurantController.deleteRestaurant);

module.exports = router;
```

### 7.3 routes/menuRoutes.js

```javascript
const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware.protect, authMiddleware.authorize('restaurant_owner', 'admin'), menuController.createMenuItem);
router.get('/:restaurantId', menuController.getMenuByRestaurant);
router.put('/:id', authMiddleware.protect, menuController.updateMenuItem);
router.delete('/:id', authMiddleware.protect, menuController.deleteMenuItem);

module.exports = router;
```

### 7.4 routes/orderRoutes.js

```javascript
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware.protect, orderController.createOrder);
router.get('/:id', authMiddleware.protect, orderController.getOrderById);
router.get('/', authMiddleware.protect, orderController.getMyOrders);
router.put('/:id/status', authMiddleware.protect, orderController.updateOrderStatus);
router.put('/:id/cancel', authMiddleware.protect, orderController.cancelOrder);

module.exports = router;
```

---

## 8. Main Server File

### 8.1 server.js

```javascript
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const config = require('./config/dotenv');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});

// Error handling middleware
app.use(errorHandler.errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

const PORT = config.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

## 9. API Endpoints Summary

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Restaurants
- `POST /api/restaurants` - Create restaurant (Owner only)
- `GET /api/restaurants` - Get all restaurants
- `GET /api/restaurants/:id` - Get restaurant details
- `PUT /api/restaurants/:id` - Update restaurant (Owner only)
- `DELETE /api/restaurants/:id` - Delete restaurant (Owner only)

### Menu Items
- `POST /api/menu` - Create menu item (Owner only)
- `GET /api/menu/:restaurantId` - Get menu by restaurant
- `PUT /api/menu/:id` - Update menu item (Owner only)
- `DELETE /api/menu/:id` - Delete menu item (Owner only)

### Orders
- `POST /api/orders` - Create order (Customer)
- `GET /api/orders/:id` - Get order details
- `GET /api/orders` - Get my orders
- `PUT /api/orders/:id/status` - Update order status
- `PUT /api/orders/:id/cancel` - Cancel order

---

## 10. Installation & Running

```bash
# Install dependencies
npm install

# Create .env file with required variables
# Start development server
npm run dev

# Or start production server
npm start
```

---

## 11. Testing with Postman

### Register User
```
POST http://localhost:5000/api/auth/register
Headers: Content-Type: application/json

Body:
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890"
}
```

### Login
```
POST http://localhost:5000/api/auth/login
Headers: Content-Type: application/json

Body:
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Create Restaurant (Use token from login)
```
POST http://localhost:5000/api/restaurants
Headers: 
  Content-Type: application/json
  Authorization: Bearer <token>

Body:
{
  "name": "Pizza Palace",
  "description": "Best pizza in town",
  "cuisine": ["Italian", "Continental"],
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001"
  },
  "phone": "1234567890",
  "email": "info@pizzapalace.com",
  "openingTime": "11:00",
  "closingTime": "23:00"
}
```

---

## 12. Next Steps & Enhancements

1. **Payment Integration** - Stripe/Razorpay integration
2. **Email Service** - Send order confirmations and updates
3. **Image Upload** - Cloudinary integration for restaurant/menu images
4. **Ratings & Reviews** - Implement full review system
5. **Search & Filter** - Add advanced search functionality
6. **Real-time Updates** - WebSocket for live order tracking
7. **Admin Dashboard** - Admin panel for managing restaurants and users
8. **Delivery Tracking** - GPS tracking for deliveries
9. **Notifications** - Push notifications for order updates
10. **Analytics** - Sales reports and analytics

---

This guide provides a complete foundation for building a restaurant food app backend. Customize as needed for your specific requirements!
