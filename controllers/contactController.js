const db = require('../models')
const contactDb = db.contacts

const addContact = async (req, res) => {
    await contactDb.create(req.body)
    res.status(200).send("Contact Created successfully!")
}

const getContact = async (req, res) => {
    const { firstName, lastName } = req.body;
    const getContact = await contactDb.findOne({
        where: {
            [Op.or]: [
                { firstName },
                { lastName },
            ],
        }
    })
    res.status(200).send(getContact)
}

const updateContact = async (req, res) => {
    const findContact = await contactDb.findOne({ where: { phoneNumber: req.body.phoneNumber } })
    if (findContact) {
        const updateContact = await contactDb.update(req.body)
        res.status(200).send(updateContact)
    }
    else {
        res.send(400).send("Contact not found")
    }
}

const deleteContact = async (req, res) => {
    await contactDb.destroy({ where: { phoneNumber: req.body.phoneNumber } })
    res.status(200).send("Deleted successfully")
}

module.exports = {
    addContact,
    getContact,
    deleteContact,
    updateContact,
}