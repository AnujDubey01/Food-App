const testUserController = (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            message: 'This is a test user controller'
    });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

module.exports = {
    testUserController
};