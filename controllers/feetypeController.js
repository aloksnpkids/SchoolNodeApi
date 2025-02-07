const { FeeType } = require('../database/models/index.model');
const Joi = require('joi');
const _ = require('lodash');
const errorBag = require('../helpers/common');

async function createFeeType(req, res) {
    const { error } = FeeType.feeTypeValidate(req.body);
    if (error) return res.status(422).send(errorBag(error));

    try {
        const allowedFields = ['name', 'description'];
        const feeTypeData = _.pick(req.body, allowedFields);

        const feeType = await FeeType.create(feeTypeData);

        return res.status(201).json({
            message: 'Fee type created successfully!',
            feeType,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Something went wrong!',
            error: error.message,
        });
    }
}

async function getFeeTypeList(req, res) {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const { count, rows: feeTypes } = await FeeType.findAndCountAll({
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['name', 'ASC']],
        });

        return res.status(200).json({
            message: 'Fee types fetched successfully!',
            feeTypes,
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

async function getFeeTypeById(req, res) {
    try {
        const { id } = req.params;

        const feeType = await FeeType.findByPk(id);

        if (!feeType) {
            return res.status(404).json({
                message: 'Fee type not found!',
            });
        }

        return res.status(200).json({
            message: 'Fee type details fetched successfully!',
            feeType,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Something went wrong!',
            error: error.message,
        });
    }
}

async function updateFeeType(req, res) {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Fee type ID is required!' });

    const { error } = FeeType.feeTypeValidate(req.body);
    if (error) return res.status(422).send(errorBag(error));

    try {
        const allowedFields = ['name', 'description'];
        const feeTypeData = _.pick(req.body, allowedFields);

        const feeType = await FeeType.findByPk(id);
        if (!feeType) return res.status(404).json({ message: 'Fee type not found!' });

        await feeType.update(feeTypeData);

        return res.status(200).json({
            message: 'Fee type updated successfully!',
            feeType,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Something went wrong!',
            error: error.message,
        });
    }
}

async function deleteFeeType(req, res) {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Fee type ID is required!' });

    try {
        const feeType = await FeeType.findByPk(id);
        if (!feeType) return res.status(404).json({ message: 'Fee type not found!' });

        await feeType.destroy();

        return res.status(200).json({
            message: 'Fee type deleted successfully!',
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
    createFeeType,
    getFeeTypeList,
    getFeeTypeById,
    updateFeeType,
    deleteFeeType,
};