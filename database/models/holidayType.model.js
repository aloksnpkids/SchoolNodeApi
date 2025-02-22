'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class HolidayType extends Model {
        static associate(models) {
            HolidayType.hasMany(models.Holiday, { foreignKey: 'holiday_type_id' });
        }
    }

    HolidayType.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        deletedAt: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        sequelize,
        paranoid: true,
        modelName: 'HolidayType',
    });

    return HolidayType;
};
