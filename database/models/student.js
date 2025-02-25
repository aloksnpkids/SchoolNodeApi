'use strict';
const {
    Model
} = require('sequelize');
const Joi = require('joi');
module.exports = (sequelize, DataTypes) => {
    class Student extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Student.belongsTo(models.Grade, {
                foreignKey: 'grade_id', 
                as: 'Grade', 
            });

            Student.hasOne(models.StudentFeeStructure, {
                foreignKey: "student_id",
                as: "StudentFeeStructure",
            });

        }

        static studentValidate(Validate) {
            const schema = Joi.object({
                name: Joi.string()
                    .min(2)
                    .max(100)
                    .required()
                    .messages({
                        'string.min': '"name" should have a minimum length of 2',
                        'string.max': '"name" should have a maximum length of 100',
                        'string.base': '"name" should be a type of string.',
                        'string.empty': '"name" field must contain a value.',
                        'any.required': '"name" is a required field.',
                    }),
                date_of_birth: Joi.date().iso().required().messages({
                    'date.base': '"date_of_birth" should be a valid date.',
                    'date.iso': '"date_of_birth" should be in ISO 8601 format (YYYY-MM-DD).',
                    'any.required': '"date_of_birth" is a required field.',
                }),
                grade_id: Joi.number().integer().optional().messages({
                    'number.base': '"grade_id" should be a type of number.',
                    'number.integer': '"grade_id" should be an integer.',
                }),
                parent_id: Joi.number().integer().optional().messages({
                    'number.base': '"parent_id" should be a type of number.',
                    'number.integer': '"parent_id" should be an integer.',
                }),
                school_id: Joi.number().integer().required().messages({
                    'number.base': '"school_id" should be a type of number.',
                    'number.integer': '"school_id" should be an integer.',
                    'any.required': '"school_id" is a required field.',
                }),
                address: Joi.string().max(255).optional().messages({
                    'string.base': '"address" should be a type of string.',
                    'string.max': '"address" should have a maximum length of 255.',
                }),
                note: Joi.string().max(500).optional().messages({
                    'string.base': '"note" should be a type of string.',
                    'string.max': '"note" should have a maximum length of 500.',
                }),
            });
        
            return schema.validate(Validate, {
                abortEarly: false,
                allowUnknown: true,
                stripUnknown: true,
            });
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
        father_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        mother_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        contact_number: {
            type: DataTypes.STRING,
            allowNull: false
        },
        father_mobile: {
            type: DataTypes.STRING,
            allowNull: true
        },
        mother_mobile: {
            type: DataTypes.STRING,
            allowNull: true
        },

        image: {
            type: DataTypes.STRING,
            allowNull: true
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