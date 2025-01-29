// import cls from 'cls-hooked';
const Sequelize = require('sequelize');
const {registerModels} = require('./models/index.model');

module.exports = class Database {
    constructor(environment, dbConfig) {
        this.environment = environment;
        this.dbConfig = dbConfig;
        this.isTestEnvironment = this.environment === 'test';
    }

    async connect() {
        // Set up the namespace for transactions
        // const namespace = cls.createNamespace('transactions-namespace');
        // Sequelize.useCLS(namespace);
        // Create the connection
        const {username, password, host, port, database, dialect} =
            this.dbConfig[this.environment];
        this.connection = new Sequelize({
            username,
            password,
            host,
            port,
            database,
            dialect,
            logging: false
            // logging: this.isTestEnvironment ? false : console.log,
        });

        // Check if we connected successfully
        await this.connection.authenticate({logging: false});

        if (!this.isTestEnvironment) {
            console.log(
                'Connection to the database has been established successfully'
            );
        }
        // Register the models
        await registerModels(this.connection, false);
        // Sync the models
        //Uncomment below code to reset db
        // await this.forceSync();
        //Uncomment below code to sync db
        //await this.sync();
    }

    async disconnect() {
        await this.connection.close();
    }

    async sync() {
        await this.connection.query('SET FOREIGN_KEY_CHECKS = 0');
        await this.connection.sync({
            logging: false,
            force: this.isTestEnvironment,
            // alter: true
        });

        await this.connection.query('SET FOREIGN_KEY_CHECKS = 1');
        if (!this.isTestEnvironment) {
            console.log('Connection synced successfully');
        }
    }

    async forceSync() {
        await this.connection.query('SET FOREIGN_KEY_CHECKS = 0');
        await this.connection.sync({force: true});
        await this.connection.query('SET FOREIGN_KEY_CHECKS = 1'); // setting the flag back for security
    }
}
