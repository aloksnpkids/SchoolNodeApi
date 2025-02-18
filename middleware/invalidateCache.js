const redisClient = require('../config/redisClient'); // Assuming you've set up Redis in a separate file

const invalidateCache = async (req, res, next) => {
    try {
        // Define cache keys to clear (Modify based on your caching strategy)
        const cacheKeys = [
            'dashboard_data', 
            'student_list', 
            // Add more keys as needed
        ];

        // Delete cache keys
        for (const key of cacheKeys) {
            await redisClient.del(key);
        }

        console.log('Cache invalidated for:', cacheKeys);
    } catch (error) {
        console.error('Error invalidating cache:', error);
    }

    next(); // Proceed to the next middleware/controller
};

module.exports = invalidateCache;
