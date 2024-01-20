const { Op } = require('sequelize');
const db = require('../models');
const contactDb = db.contacts;

const handleErrors = (res, status, message) => {
    console.error(message);
    res.status(status).send({ error: message });
};

const getSequelizeOptions = (pageNumber, pageSize, whereCondition) => ({
    where: whereCondition,
    limit: parseInt(pageSize),
    offset: (parseInt(pageNumber) - 1) * parseInt(pageSize),
});

const sendSuccessResponse = (res, data, pageInfo) => {
    res.status(200).send({
        data,
        pageInfo,
    });
};

const sendSuccessMessage = (res, message) => {
    res.status(200).send({
        message,
    });
};

const addContact = async (req, res) => {
    try {
        await contactDb.create(req.body);
        sendSuccessMessage(res, 'Contact created successfully!');
    } catch (err) {
        handleErrors(res, 500, 'Internal Server Error');
    }
};

const getAllContacts = async (req, res) => {
    try {
        const { firstName, lastName, pageNumber, pageSize } = req.query;

        // Basic validation for pageNumber and pageSize
        if (!pageNumber || !pageSize) {
            return handleErrors(res, 400, 'Invalid pageNumber or pageSize');
        }

        let whereCondition = {};

        if (firstName) {
            whereCondition.firstName = {
                [Op.iLike]: `%${firstName}%`,
            };
        }

        if (lastName) {
            whereCondition.lastName = {
                [Op.iLike]: `%${lastName}%`,
            };
        }

        const data = await contactDb.findAll(getSequelizeOptions(pageNumber, pageSize, whereCondition));
        const totalContacts = await contactDb.count({ where: whereCondition });

        const totalPages = Math.ceil(totalContacts / parseInt(pageSize));

        sendSuccessResponse(res, data, {
            pageSize: parseInt(pageSize),
            currentPage: parseInt(pageNumber),
            totalContacts,
            totalPages,
        });
    } catch (err) {
        handleErrors(res, 500, 'Internal Server Error');
    }
};

const updateContact = async (req, res) => {
    try {
        const id = req.params.id;
        await contactDb.update(req.body, { where: { id } });
        sendSuccessMessage(res, 'Contact updated successfully!');
    } catch (err) {
        handleErrors(res, 500, 'Internal Server Error');
    }
};

const deleteContact = async (req, res) => {
    try {
        const id = req.params.id;
        await contactDb.destroy({ where: { id } });
        sendSuccessMessage(res, 'Contact deleted successfully!');
    } catch (err) {
        handleErrors(res, 500, 'Internal Server Error');
    }
};

const getContact = async (req, res) => {
    try {
        const id = req.params.id;
        const contact = await contactDb.findOne({ where: { id } });
        sendSuccessResponse(res, contact, null);
    } catch (err) {
        handleErrors(res, 500, 'Internal Server Error');
    }
};

module.exports = {
    addContact,
    getContact,
    getAllContacts,
    deleteContact,
    updateContact,
};
