const getUserController = (req, res) => {
    res.status(200).json({
        success: true,
        message: 'User route is working',
    });
}

module.exports = { getUserController };