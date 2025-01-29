// Import dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const config = require('config');
const v1Routes = require('./routes/index.route'); // Import routes

// Check for required environment variables
if (!config.get('JWT_PRIVATE_KEY')) {
    console.error('FATAL ERROR: JWT_PRIVATE_KEY is not defined');
    process.exit(1);
}

// Create Express app
const app = express();

// Add security headers with Helmet
app.use(helmet());

// Enable CORS with specific settings
app.use(cors({
    origin: '*',
    preflightContinue: true,
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
        'Origin', 'X-Requested-With', 'content-disposition',
        'Content-Type', 'Accept', 'Authorization', 'x-auth-token',
        'x-time-zone', 'x-hmac-token'
    ]
}));

// Use body-parser middleware for parsing requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use cookie-parser to handle cookies
app.use(cookieParser());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve images from a specific folder
app.use('/public/', express.static('./public/Images'));

// Enable logging in development environment
if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    console.log('Morgan enabled...');
}

// Set up Swagger
require('./swagger-setup')(app); // This line to include Swagger

// Set up API routes
app.use(v1Routes);

// Global error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.code || 500).json({
        status: false,
        code: err.code || 500,
        message: err.message || 'Something went wrong',
    });
});

// Export the `app` instance
module.exports = app;
