'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class LeaveRequest extends Model {
        static associate(models) {
            LeaveRequest.belongsTo(models.Student, { foreignKey: 'student_id' });
        }
    }

    LeaveRequest.init({
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
        from_date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        to_date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        reason: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('pending', 'approved', 'rejected'),
            allowNull: false,
            defaultValue: 'pending'
        },
        deletedAt: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        sequelize,
        paranoid: true,
        modelName: 'LeaveRequest',
    });

    return LeaveRequest;
};
