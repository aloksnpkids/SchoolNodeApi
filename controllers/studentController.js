const {School, User, Student} = require('../database/models/index.model');
//const { faker } = require('@faker-js/faker');
const {Op} = require('sequelize');

 

async function getStudentList(req, res) {
    try {
        const { page = 1, limit = 10, search, grade_id, parent_id, school_id } = req.query;
        const offset = (page - 1) * limit;

        // Build the filter conditions dynamically
        const whereCondition = {};
        if (search) whereCondition.name = { [Op.like]: `%${search}%` };
        if (grade_id) whereCondition.grade_id = grade_id;
        if (parent_id) whereCondition.parent_id = parent_id;
        if (school_id) whereCondition.school_id = school_id;

        // Fetch students with pagination and filtering
        const { count, rows: students } = await Student.findAndCountAll({
            where: whereCondition,
            attributes: ['id', 'name', 'date_of_birth', 'grade_id', 'parent_id', 'school_id', 'address', 'note'],
            limit: parseInt(limit),
            offset: parseInt(offset),
        });
        return res.status(200).json({
            message: 'Student data fetched successfully!',
            students: students,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            totalRecords: count,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Something went wrong!',
            error: error.message,
        });
    }
}

  


module.exports.getStudentList = getStudentList;