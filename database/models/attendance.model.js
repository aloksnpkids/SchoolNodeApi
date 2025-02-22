'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Attendance extends Model {
        static associate(models) {
            Attendance.belongsTo(models.Student, { foreignKey: 'student_id' });
        }
    }

    Attendance.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        student_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Students',
                key: 'id'
            }
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('present', 'absent', 'late', 'half-day'),
            allowNull: false
        },
        remarks: {
            type: DataTypes.STRING,
            allowNull: true
        },
        deletedAt: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        sequelize,
        paranoid: true,
        modelName: 'Attendance',
    });

    return Attendance;
};
