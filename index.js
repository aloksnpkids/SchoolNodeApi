const Database = require('./database/index');
const dbConfig = require('./config/config.json');
const config = require('config');

(async () => {
    try {
        console.log(config.get('environment'));
        const db = new Database(config.get('environment'), dbConfig);
        await db.connect();

        const app = require('./app'); // Import the `app` instance
        const PORT = process.env.PORT || 5001;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.log(err.message);
        console.error(
            'Something went wrong when initializing the server:\n',
            err.stack
        );
    }
})();
