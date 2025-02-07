const errorBag = require('../helpers/common');
const { StudentPayment, Student, FeeType } = require('../database/models/index.model');
const _ = require('lodash');

async function addPayment(req, res) {
    console.log('req.body', req.body);
    
    const { error } = StudentPayment.studentPaymentValidate(req.body);
    if (error) return res.status(422).send(errorBag(error));

    try {
        const allowedFields = [
            'student_id',
            'fee_type_id',
            'amount',
            'payment_date',
            'payment_note',
            'receipt_number'
        ];
        const paymentData = _.pick(req.body, allowedFields);

        const payment = await StudentPayment.create(paymentData);

        return res.status(201).json({
            message: 'Payment added successfully!',
            payment,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Something went wrong!',
            error: error.message,
        });
    }
}

async function getPaymentList(req, res) {
    try {
        const { page = 1, limit = 10, student_id, fee_type_id, start_date, end_date } = req.query;
        const offset = (page - 1) * limit;
        
        const whereCondition = {};
        if (student_id) whereCondition.student_id = student_id;
        if (fee_type_id) whereCondition.fee_type_id = fee_type_id;
        if (start_date && end_date) {
            whereCondition.payment_date = {
                [Op.between]: [new Date(start_date), new Date(end_date)]
            };
        }

        const { count, rows: payments } = await StudentPayment.findAndCountAll({
            where: whereCondition,
            include: [
                {
                    model: Student,
                    attributes: ['id', 'name'],
                    as: 'Student'
                },
                {
                    model: FeeType,
                    attributes: ['id', 'name'],
                    as: 'FeeType'
                }
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['id', 'DESC']],
        });

        return res.status(200).json({
            message: 'Payments fetched successfully!',
            payments,
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

async function getPaymentById(req, res) {
    try {
        const { id } = req.params;

        const payment = await StudentPayment.findByPk(id, {
            include: [
                {
                    model: Student,
                    attributes: ['id', 'name'],
                    as: 'Student'
                },
                {
                    model: FeeType,
                    attributes: ['id', 'name', 'description'],
                    as: 'FeeType'
                }
            ]
        });

        if (!payment) {
            return res.status(404).json({
                message: 'Payment not found!',
            });
        }

        return res.status(200).json({
            message: 'Payment details fetched successfully!',
            payment,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Something went wrong!',
            error: error.message,
        });
    }
}

async function updatePayment(req, res) {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Payment ID is required!' });

    const { error } = StudentPayment.studentPaymentValidate(req.body);
    if (error) return res.status(422).send(errorBag(error));

    try {
        const allowedFields = [
            'student_id',
            'fee_type_id',
            'amount',
            'payment_date',
            'payment_note',
            'receipt_number'
        ];
        const paymentData = _.pick(req.body, allowedFields);

        const payment = await StudentPayment.findByPk(id);
        if (!payment) return res.status(404).json({ message: 'Payment not found!' });

        await payment.update(paymentData);

        return res.status(200).json({
            message: 'Payment updated successfully!',
            payment,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Something went wrong!',
            error: error.message,
        });
    }
}

module.exports = {
    addPayment,
    getPaymentList,
    getPaymentById,
    updatePayment
};