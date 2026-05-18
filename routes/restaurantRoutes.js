const express = require("express");
const { createRestaurant, getAllRestaurants, UpdateResturant, getRestaurantById, deleteResturant } = require("../controllers/restaurantController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();



router.post('/', protect, authorize('restaurant_owner', 'admin'), createRestaurant);
router.get('/',getAllRestaurants);
router.get('/:id', getRestaurantById);
router.put('/:id', protect, UpdateResturant);
router.delete('/:id',protect, deleteResturant);

module.exports = router;
