const errorBag = require('../helpers/common');
const {School, User, Student, Grade} = require('../database/models/index.model');
const {Op} = require('sequelize');
const _ = require('lodash');




async function addStudent(req, res) {
    console.log('req.body', req.body);
    
    const { error } = Student.studentValidate(req.body);
    if (error) return res.status(422).send(errorBag(error));

    try {
        const allowedFields = [
            'name',
            'date_of_birth',
            'grade_id',
            'parent_id',
            'school_id',
            'address',
            'note',
            'father_name',
            'mother_name',
            'contact_number',
            'father_mobile',
            'mother_mobile',
        ];
        const studentData = _.pick(req.body, allowedFields);

        // Check if an image file is uploaded and store its path
        if (req.files && req.files.image) {
            studentData.image = `/uploads/student/images/${req.files.image[0].filename}`;
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
        const { page = 1, limit = 10, search, grade_id, parent_id, school_id, student_id } = req.query;
        const offset = (page - 1) * limit;
        // Build the filter conditions dynamically
        const whereCondition = {};
        if (search) whereCondition.name = { [Op.like]: `%${search}%` };
        if (grade_id) whereCondition.grade_id = grade_id;
        if (parent_id) whereCondition.parent_id = parent_id;
        if (school_id) whereCondition.school_id = school_id;
        if (student_id) whereCondition.id = student_id;
        // Fetch students with pagination and filtering
        const { count, rows: students } = await Student.findAndCountAll({
            where: whereCondition,
            include: [
                {
                    model: Grade, 
                    attributes: ['id', 'grade_name'],
                    as:'Grade' 
                },],
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

async function getStudentById(req, res) {
    try {
        const { id } = req.params;

        // Fetch the student by ID, including the related Grade
        const student = await Student.findOne({
            where: { id },
            include: [
                {
                    model: Grade,
                    attributes: ['id', 'grade_name'],
                    as: 'Grade',
                },
            ],
        });

        if (!student) {
            return res.status(404).json({
                message: 'Student not found!',
            });
        }

        return res.status(200).json({
            message: 'Student data fetched successfully!',
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


async function updateStudent(req, res) {
    console.log('req.body', req.body);
    
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Student ID is required!' });

    const { error } = Student.studentValidate(req.body);
    if (error) return res.status(422).send(errorBag(error));

    try {
        const allowedFields = [
            'name',
            'date_of_birth',
            'grade_id',
            'parent_id',
            'school_id',
            'address',
            'note',
            'father_name',
            'mother_name',
            'contact_number',
            'father_mobile',
            'mother_mobile',
        ];
        const studentData = _.pick(req.body, allowedFields);

        // Check if an image file is uploaded and update its path
        if (req.files && req.files.image) {
            studentData.image = `/uploads/student/images/${req.files.image[0].filename}`;
        }

        const student = await Student.findByPk(id);
        if (!student) return res.status(404).json({ message: 'Student not found!' });

        await student.update(studentData);

        return res.status(200).json({
            message: 'Student updated successfully!',
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



module.exports.getStudentList = getStudentList;
module.exports.addStudent = addStudent;
module.exports.getStudentById = getStudentById;
module.exports.updateStudent = updateStudent;