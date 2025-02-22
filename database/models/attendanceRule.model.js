'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class AttendanceRule extends Model {
        static associate(models) {
            AttendanceRule.belongsTo(models.Grade, { foreignKey: 'grade_id' });
        }
    }

    AttendanceRule.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        grade_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Grades',
                key: 'id'
            }
        },
        min_attendance: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        deletedAt: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        sequelize,
        paranoid: true,
        modelName: 'AttendanceRule',
    });

    return AttendanceRule;
};
