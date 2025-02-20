const { Op, fn, col, Sequelize } = require('sequelize');

const { User, StudentPayment, Student, Grade } = require('../database/models/index.model');
const { createClient } = require('redis');

// Create and connect a Redis client
const redisClient = createClient();
redisClient.on('error', (err) => console.error('Redis Error:', err));
(async () => {
  await redisClient.connect();
})();

async function getUserDashboardData(req, res) {
    try {
        const userId = req.user.id;
        const cacheKey = `dashboard_data`;

        // Check if data is cached in Redis
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            console.log('Serving from cache');
            return res.status(200).json(JSON.parse(cachedData));
        }

        // Find the user by ID
        const user = await User.findOne({ where: { id: userId } });
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


        // Calculate total student fee per month
        const totalStudentFeePerMonth = await Student.findAll({
            attributes: [
                [Sequelize.fn('SUM', Sequelize.col('Grade.grade_fee')), 'totalFee']
            ],
            include: [{
                model: Grade,
                as: 'Grade',
                attributes: []
            }],
            raw: true
        });

        const totalFeePerMonth = totalStudentFeePerMonth[0]?.totalFee || 0;

        const newAdmissionFeeTypeId = 2; // Assuming "New Admission" has an ID of 2
        const admissionPaymentSum = await calculateAdmissionPaymentSum(newAdmissionFeeTypeId)

        const dashboardData = {
            message: 'Dashboard data fetched successfully!',
            totalPaymentCurrentSession: `₹${totalPaymentCurrentSession.toFixed(2)}`,
            currentMonthTotalPayment: `₹${currentMonthTotalPayment.toFixed(2)}`,
            todaysPayment: `₹${todaysPayment.toFixed(2)}`,
            totalStudents,
            totalStudentFeePerMonth: `₹${totalFeePerMonth}`,
            currentMonthTotalAdmissionPayment: `₹${admissionPaymentSum.toFixed(2)}`,
        };

        // Cache the result in Redis for 5 minutes (300 seconds)
        await redisClient.setEx(cacheKey, 300, JSON.stringify(dashboardData));

        return res.status(200).json(dashboardData);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Something went wrong!',
            error: error.message,
        });
    }
}




const calculateAdmissionPaymentSum = async (feeTypeId) => {
    const newAdmissionfeeTypeId = 2;
    const admissionfeeDueTypeId = 3;
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    try {
        const admissionPaymentSum = await StudentPayment.sum('amount', {
            where: { 
                payment_date: { [Op.between]: [currentMonthStart, currentMonthEnd] },
                fee_type_id: { [Op.or]: [newAdmissionfeeTypeId, admissionfeeDueTypeId] } // Include both feeTypeId 2 and 3
            }
        }) || 0;

        return admissionPaymentSum;
    } catch (error) {
        console.error('Error calculating admission payment sum:', error);
        throw error;
    }
};


  
module.exports.getUserDashboardData = getUserDashboardData;
