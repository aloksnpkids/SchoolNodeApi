'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Holiday extends Model {
        static associate(models) {
            Holiday.belongsTo(models.HolidayType, { foreignKey: 'holiday_type_id' });
        }
    }

    Holiday.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        holiday_type_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'HolidayTypes',
                key: 'id'
            }
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        deletedAt: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        sequelize,
        paranoid: true,
        modelName: 'Holiday',
    });

    return Holiday;
};
