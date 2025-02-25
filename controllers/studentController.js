const errorBag = require('../helpers/common');
const {School, User, Student, Grade, StudentFeeStructure} = require('../database/models/index.model');
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
                    attributes: ["id", "grade_name"],
                    as: "Grade",
                },
                {
                    model: StudentFeeStructure,
                    attributes: [
                        "id",
                        "monthly_fee",
                        "session_start_month",
                        "session_end_month",
                        "session_start_year",
                        "session_end_year",
                        "concession_note",
                    ],
                    as: "StudentFeeStructure",
                    where: { is_active: true }, // Only include active fee structures
                    required: false, // Ensures students without an active fee structure are still included
                },
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [["id", "DESC"]],
        });

        return res.status(200).json({
            message: "Student data fetched successfully!",
            students: students,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            totalRecords: count,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Something went wrong!",
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


/**
 * Add a new Student Fee Structure
 */
async function addStudentFeeStructure(req, res) {
    try {
        const { student_id, grade_id, monthly_fee, session_start_month, session_end_month, session_start_year, session_end_year, concession_note } = req.body;

        if (!student_id || !grade_id || !monthly_fee || !session_start_month || !session_end_month || !session_start_year || !session_end_year) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Insert the new fee structure
        const studentFee = await StudentFeeStructure.create({
            student_id,
            grade_id,
            monthly_fee,
            session_start_month,
            session_end_month,
            session_start_year,
            session_end_year,
            concession_note
        });

        return res.status(201).json({ message: "Student fee structure added successfully", data: studentFee });
    } catch (error) {
        console.error("Error adding student fee structure:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * Update an existing Student Fee Structure
 */
async function updateStudentFeeStructure (req, res) {
    try {
        const { id } = req.params;
        const { monthly_fee, session_start_month, session_end_month, session_start_year, session_end_year, concession_note } = req.body;

        // Check if record exists
        const studentFee = await StudentFeeStructure.findByPk(id);
        if (!studentFee) {
            return res.status(404).json({ message: "Student fee structure not found" });
        }

        // Update fields
        await studentFee.update({
            monthly_fee,
            session_start_month,
            session_end_month,
            session_start_year,
            session_end_year,
            concession_note
        });

        return res.status(200).json({ message: "Student fee structure updated successfully", data: studentFee });
    } catch (error) {
        console.error("Error updating student fee structure:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


/**
 * Get Student Fee Structure List (With Pagination)
 */
async function getStudentFeeStructureList(req, res) {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        // Fetch all student fee structures with pagination
        const { count, rows: studentFees } = await StudentFeeStructure.findAndCountAll({
            include: [
                {
                    model: Student,
                    attributes: ['id', 'name'],
                    as: 'Student'
                },
                {
                    model: Grade,
                    attributes: ['id', 'grade_name'],
                    as: 'Grade'
                }
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['session_start_year', 'DESC']]
        });

        return res.status(200).json({
            message: 'Student Fee Structure list fetched successfully!',
            studentFees,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            totalRecords: count
        });
    } catch (error) {
        console.error("Error fetching student fee structure list:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

/**
 * Get Active Student Fee Structure (Only One Entry)
 */
async function getCurrentStudentFee(req, res) {
    try {
        const { student_id } = req.query;
        if (!student_id) {
            return res.status(400).json({ message: "Student ID is required!" });
        }

        // Fetch the active fee structure for the student
        const studentFee = await StudentFeeStructure.findOne({
            where: {
                student_id,
                is_active: true // Fetching only the active fee structure
            },
            include: [
                {
                    model: Student,
                    attributes: ['id', 'name'],
                    as: 'Student'
                },
                {
                    model: Grade,
                    attributes: ['id', 'grade_name'],
                    as: 'Grade'
                }
            ]
        });

        if (!studentFee) {
            return res.status(404).json({ message: "No active fee structure found for this student!" });
        }

        return res.status(200).json({
            message: 'Active student fee structure fetched successfully!',
            studentFee
        });
    } catch (error) {
        console.error("Error fetching active student fee structure:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}



module.exports.getStudentList = getStudentList;
module.exports.addStudent = addStudent;
module.exports.getStudentById = getStudentById;
module.exports.updateStudent = updateStudent;
module.exports.addStudentFeeStructure = addStudentFeeStructure;
module.exports.updateStudentFeeStructure = updateStudentFeeStructure;
module.exports.getStudentFeeStructureList = getStudentFeeStructureList;
module.exports.getCurrentStudentFee = getCurrentStudentFee;