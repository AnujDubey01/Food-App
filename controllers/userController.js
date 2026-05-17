const User = require('../models/User.model.js');

 const getUserController = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if(!user){
            return res.status(404).send({
                success: false,
                message: 'User not found',
            });
        }

        // find password
        user.password = undefined;
        res.status(200).send({
            success: true,
            message: 'User found',
            user,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error in user controller: ' + error.message,
        });
    }
}

const UpdateUserController = async(req,res) => {
    try{
         const user = await User.findById(req.user.id);

        if(!user){
            return res.status(404).send({
                success: false,
                message: 'User not found'
            })
        }
        //update user 
        const { firstName, lastName, email, phone, address } = req.body;

        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.email = email || user.email;
        user.phone = phone || user.phone;
        user.address = address || user.address;

         await user.save();

        res.status(200).send({
            success: true,
            message: 'User updated successfully',
            user
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message: 'Error in update user controller: ' + error.message,
        })
    }
}



module.exports = { getUserController,
                    UpdateUserController
 };