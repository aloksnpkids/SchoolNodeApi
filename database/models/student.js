'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Student extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here

        }
    }

    Student.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        date_of_birth: {
            type: DataTypes.DATE,
            allowNull: false
        },
        grade_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        parent_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        school_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        note: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        deletedAt: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        sequelize,
        paranoid: true, // Enable soft deletes
        modelName: 'Student',
    });

    //Student.sync({alter:true}) // Uncomment this line if you want to sync the model with the database

    return Student;
};