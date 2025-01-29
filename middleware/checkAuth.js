const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = async function (req, res, next) {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({
            status: false,
            code: 401,
            message: "Unauthenticated user"
        });
    }

    try {
        const decoded = await jwt.verify(token, config.get('JWT_PRIVATE_KEY'));
        req.user = decoded;
        next();
    } catch (err) {
        console.log(err);
        return res.status(401).json({
            status: false,
            code: 401,
            message: "Your session has timed out. Please log in again.",
        });
    }
}