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
        session_start: { type: DataTypes.DATE, allowNull: false }, // E.g., April 1st
        session_end: { type: DataTypes.DATE, allowNull: false }, // E.g., March 31st next year
        concession_note: { type: DataTypes.STRING, allowNull: true } // Optional reason for concession
    }, {
        sequelize,
        modelName: 'StudentFeeStructure',
    });
    //StudentFeeStructure.sync({alter:true})
    return StudentFeeStructure;
};
