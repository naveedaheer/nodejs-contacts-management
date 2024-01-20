const { Op } = require('sequelize');
const db = require('../models');
const contactDb = db.contacts;

const addContact = async (req, res) => {
    await contactDb.create(req.body)
    res.status(200).send("Contact Created successfully!")
}

const handleErrors = (res, status, message) => {
    console.error(message);
    res.status(status).send({ error: message });
};

const getSequelizeOptions = (pageNumber, pageSize, whereCondition) => ({
    where: whereCondition,
    limit: parseInt(pageSize),
    offset: (parseInt(pageNumber) - 1) * parseInt(pageSize),
});

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

        res.status(200).send({
            data,
            pageInfo: {
                pageSize: parseInt(pageSize),
                currentPage: parseInt(pageNumber),
                totalContacts,
                totalPages,
            },
        });
    } catch (err) {
        handleErrors(res, 500, 'Internal Server Error');
    }
};

const updateContact = async (req, res) => {
    const id = req.params.id
    const updateContact = await contactDb.update(req.body, { where: { id } })
    res.status(200).send(updateContact)
}

const deleteContact = async (req, res) => {
    console.log(req)
    const id = req.params.id
    await contactDb.destroy({ where: { id } })
    res.status(200).send("Deleted successfully")
}

const getContact = async (req, res) => {
    const id = req.params.id
    const getAllContacts = await contactDb.findOne({ where: { id } })
    res.status(200).send(getAllContacts)
}

module.exports = {
    addContact,
    getContact,
    getAllContacts,
    deleteContact,
    updateContact,
}