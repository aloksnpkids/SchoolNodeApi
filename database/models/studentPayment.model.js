'use strict';
const { Model } = require('sequelize');
const Joi = require('joi');

module.exports = (sequelize, DataTypes) => {
    class StudentPayment extends Model {
        static associate(models) {
            StudentPayment.belongsTo(models.Student, {
                foreignKey: 'student_id',
                as: 'Student',
            });
            StudentPayment.belongsTo(models.FeeType, {
                foreignKey: 'fee_type_id',
                as: 'FeeType',
            });
        }

        static studentPaymentValidate(Validate) {
            const schema = Joi.object({
                student_id: Joi.number().integer().required().messages({
                    'number.base': '"student_id" should be a number.',
                    'number.integer': '"student_id" should be an integer.',
                    'any.required': '"student_id" is required.',
                }),
                fee_type_id: Joi.number().integer().required().messages({
                    'number.base': '"fee_type_id" should be a number.',
                    'number.integer': '"fee_type_id" should be an integer.',
                    'any.required': '"fee_type_id" is required.',
                }),
                amount: Joi.number().precision(2).required().messages({
                    'number.base': '"amount" should be a number.',
                    'number.precision': '"amount" should have up to 2 decimal places.',
                    'any.required': '"amount" is required.',
                }),
                payment_date: Joi.date().iso().required().messages({
                    'date.base': '"payment_date" should be a valid date.',
                    'date.iso': '"payment_date" should be in ISO 8601 format.',
                    'any.required': '"payment_date" is required.',
                })
            });
            return schema.validate(Validate, { abortEarly: false, allowUnknown: true, stripUnknown: true });
        }
    }

    StudentPayment.init({
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        student_id: { type: DataTypes.INTEGER, allowNull: false },
        fee_type_id: { type: DataTypes.INTEGER, allowNull: false },
        amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        payment_date: { type: DataTypes.DATE, allowNull: false },
        payment_note: { type: DataTypes.STRING, allowNull: true },
        receipt_number:{ type: DataTypes.INTEGER, allowNull: true},
        deletedAt: { type: DataTypes.DATE, allowNull: true }
    }, {
        sequelize,
        paranoid: true,
        modelName: 'StudentPayment',
    });
    //StudentPayment.sync({alter:true}) 
    return StudentPayment;
};
