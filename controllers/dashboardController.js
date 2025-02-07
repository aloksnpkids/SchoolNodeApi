const { Op } = require('sequelize');
const { User, StudentPayment, Student } = require('../database/models/index.model');

 

async function getUserDashboardData(req, res) {
    try {
        // Find the user by ID
        const user = await User.findOne({ where: { id: req.user.id } });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Define session date range
        const sessionStart = new Date('2024-04-01');
        const sessionEnd = new Date('2025-03-31');

        // Get total payments for the session
        const totalPaymentCurrentSession = await StudentPayment.sum('amount', {
            where: { 
                payment_date: { [Op.between]: [sessionStart, sessionEnd] }
            }
        }) || 0;

        // Get total payments for the current month
        const now = new Date();
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const currentMonthTotalPayment = await StudentPayment.sum('amount', {
            where: { 
                payment_date: { [Op.between]: [currentMonthStart, currentMonthEnd] }
            }
        }) || 0;

        // Get total payments for today
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        const todaysPayment = await StudentPayment.sum('amount', {
            where: { 
                payment_date: { [Op.between]: [todayStart, todayEnd] }
            }
        }) || 0;

        // Get total student count
        const totalStudents = await Student.count();

        return res.status(200).json({
            message: 'Dashboard data fetched successfully!',
            //data: user,
            totalPaymentCurrentSession: `₹${totalPaymentCurrentSession.toFixed(2)}`,
            currentMonthTotalPayment: `₹${currentMonthTotalPayment.toFixed(2)}`,
            todaysPayment: `₹${todaysPayment.toFixed(2)}`,
            totalStudents
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