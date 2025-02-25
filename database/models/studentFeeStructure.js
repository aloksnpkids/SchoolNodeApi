'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class StudentFeeStructure extends Model {
        static associate(models) {
            StudentFeeStructure.belongsTo(models.Student, {
                foreignKey: 'student_id',
                as: 'Student',
            });
            StudentFeeStructure.belongsTo(models.Grade, {
                foreignKey: 'grade_id',
                as: 'Grade',
            });
        }
    }

    StudentFeeStructure.init({
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        student_id: { type: DataTypes.INTEGER, allowNull: false },
        grade_id: { type: DataTypes.INTEGER, allowNull: false },
        monthly_fee: { type: DataTypes.INTEGER, allowNull: false }, // Actual fee student pays
        session_start_month: { type: DataTypes.INTEGER, allowNull: false }, // 1 = Jan, 2 = Feb, etc.
        session_end_month: { type: DataTypes.INTEGER, allowNull: false }, 
        session_start_year: { type: DataTypes.INTEGER, allowNull: false }, // Instead of "2024-2025"
        session_end_year: { type: DataTypes.INTEGER, allowNull: false },  
        concession_note: { type: DataTypes.STRING, allowNull: true }, // Optional reason for concession
        is_active: { type: DataTypes.BOOLEAN, defaultValue: true }, // To mark active fee structure
    }, {
        sequelize,
        modelName: 'StudentFeeStructure',
    });
    
    //StudentFeeStructure.sync({alter:true})
    return StudentFeeStructure;
};
