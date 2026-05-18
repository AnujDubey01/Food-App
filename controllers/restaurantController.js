const Restaurant = require('../models/Resturant.model.js');

const createRestaurant = async(req,res) => {
    try {
        const {name, description, cuisine, address, phone, email, openingTime, closingTime} = req.body;

          const restaurant = await Restaurant.create({
            name, 
            description, 
            cuisine, 
            address, 
            phone, 
            email, 
            openingTime, 
            closingTime,
             restaurant_owner: req.user.id
        });

        res.status(200).send({
            "success" : true,
            "message" : "Restaurant created successfully",
             data: restaurant 
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error in creating restaurant: ' + error.message,
        })
    }
}

const getAllRestaurants = async(req,res) => {
    try {
        const restaurants = await Restaurant.find({ isVerified: true })
        .populate('owner', 'firstName lastName email');  
        
        res.status(200).json({ 
            success: true, 
            count: restaurants.length, 
            data: restaurants 
        }); 
    } catch (error) {
        res.status(500).send({
            "success": false,
            "message": 'Error in fetching restaurants: ' + error.message
        })
    }
}

const getRestaurantById = async(req,res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);

        if(!restaurant) {
            return res.status(404).send({
                success: false,
                message: 'Restaurant not found'
            });
        }
       res.status(200).json({ 
            success: true, 
            data: restaurant 
        }); 
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error in fetching restaurant: ' + error.message,
        });
    }
}

const UpdateResturant = async(req,res) => {
        try {
            
            const Resturant = await Restaurant.findById(req.params.id);

            if(!Resturant) {
              return  res.status(404).send({
                    success: false,
                    message: 'Restaurant not found'
                });
            }

            if  (Resturant.restaurant_owner.toString() !== req.user.id) { 
                return res.status(403).send({
                    success: false, 
                    message: 'Not authorized to update this restaurant' 
                }); 
            }
            
            const updatedRestaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true
            });
            
            res.status(200).json({ 
                success: true, 
                message: 'Restaurant updated successfully', 
                data: updatedRestaurant 
            });


        } catch (error) {
            res.status(500).send({
                success: false,
                message: 'Error in updating restaurant: ' + error.message,
            });
        }
}

const deleteResturant = async(req,res) => {
    try {
        const Resturant = await Restaurant.findById(req.params.id);

        if(!Resturant){
            res.status(404).send({
                 success: false, 
                 message: 'Restaurant not found'
            });
        }

       if (Resturant.restaurant_owner.toString() !== req.user.id){
            res.status(403).send({ 
                success: false, 
                message: 'Not authorized to delete this restaurant' 
            }); 
        }

        const deleteRes = await Restaurant.findByIdAndDelete(req.params.id);

         res.status(200).json({ 
            success: true, 
            message: 'Restaurant deleted successfully' 
        }); 


    } catch (error) {
        res.status(500).send({
            "success": false,
            "message": "error "
        })
    }
}
module.exports = { createRestaurant  , 
                    getAllRestaurants , 
                    getRestaurantById, 
                    UpdateResturant ,
                    deleteResturant
                };