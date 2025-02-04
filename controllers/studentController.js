const {School, User, Student} = require('../database/models/index.model');
const {Op} = require('sequelize');
const _ = require('lodash');




async function addStudent(req, res) {
    try {
        const allowedFields = ['name', 'date_of_birth', 'grade_id', 'parent_id', 'school_id', 'address', 'note'];
        const studentData = _.pick(req.body, allowedFields);

        // Validate required fields
        if (!studentData.name || !studentData.date_of_birth || !studentData.school_id) {
            return res.status(400).json({
                message: 'Name, Date of Birth, and School ID are required fields!',
            });
        }

        const student = await Student.create(studentData);

        return res.status(201).json({
            message: 'Student added successfully!',
            student,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Something went wrong!',
            error: error.message,
        });
    }
}

 

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
            order: [['id', 'DESC']],
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
module.exports.addStudent = addStudent;