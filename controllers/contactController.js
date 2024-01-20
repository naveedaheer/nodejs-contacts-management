const { Op, where } = require('sequelize');
const db = require('../models')
const contactDb = db.contacts

const addContact = async (req, res) => {
    await contactDb.create(req.body)
    res.status(200).send("Contact Created successfully!")
}

const getAllContacts = async (req, res) => {
    const { firstName, lastName, pageNumber, pageSize } = req.query;
    let whereCondition = {}
    if (firstName && lastName) {
        whereCondition = {
            firstName,
            lastName,
        };
    } else if (firstName || lastName) {
        whereCondition = {
            [Op.or]: [
                { firstName },
                { lastName }
            ].filter(condition => condition[Object.keys(condition)[0]] !== undefined)
        };
    }
    else {
        whereCondition = {}
    }
    const offset = (pageNumber - 1) * pageSize;
    const data = await contactDb.findAll({
        where: whereCondition,
        limit: parseInt(pageSize),
        offset: parseInt(offset),
    }).catch((err) => {
        console.log(err)
    })
    res.status(200).send(data);
}

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