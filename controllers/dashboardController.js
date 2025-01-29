const {School, User} = require('../database/models/index.model');

 

async function getUserDashboardData(req, res) {
    try {
        // Find the user by ID
        const user = await User.findOne({ where: { id: req.user.id } });
        if (!user) {
            return res.status(404).json({
                message: 'User not found.',
            });
        }
  
        return res.status(200).json({
            message: 'Dashboard data fetched successfully!',
            data: user,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Something went wrong!',
            error: error.message,
        });
    }
  }
  


module.exports.getUserDashboardData = getUserDashboardData;