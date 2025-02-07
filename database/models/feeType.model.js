'use strict';
const { Model } = require('sequelize');
const Joi = require('joi');

module.exports = (sequelize, DataTypes) => {
    class FeeType extends Model {
        static associate(models) {
            FeeType.hasMany(models.StudentPayment, {
                foreignKey: 'fee_type_id',
                as: 'StudentPayments',
            });
        }

        static feeTypeValidate(Validate) {
            const schema = Joi.object({
                name: Joi.string().max(100).required().messages({
                    'string.base': '"name" should be a string.',
                    'string.max': '"name" should have a maximum length of 100.',
                    'any.required': '"name" is required.',
                }),
                description: Joi.string().max(500).optional().messages({
                    'string.base': '"description" should be a string.',
                    'string.max': '"description" should have a maximum length of 500.',
                })
            });
            return schema.validate(Validate, { abortEarly: false, allowUnknown: true, stripUnknown: true });
        }
    }

    FeeType.init({
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.TEXT, allowNull: true },
        deletedAt: { type: DataTypes.DATE, allowNull: true }
    }, {
        sequelize,
        paranoid: true,
        modelName: 'FeeType',
    });
    //FeeType.sync({alter:true}) 
    return FeeType;
};
