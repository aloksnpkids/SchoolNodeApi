const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const path = require('path');

module.exports = (app) => {
    const options = {
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'API Documentation',
                version: '1.0.0',
                description: 'API documentation for our application',
            },
            servers: [
                {
                    url: 'http://localhost:5001', // Update this with your server URL
                },
            ],
        },
        apis: [path.join(__dirname, './routes/**/*.js')], // Update this path to your route files
    };

    const specs = swaggerJsDoc(options);

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
    console.log('Swagger API documentation is available at /api-docs');
};
