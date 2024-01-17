const contact = require('../controllers/contactController')
const router = require('express').Router()

router.post('/', contact.addContact)

router.get('/:id', contact.getContact)

router.get('/', contact.getAllContacts)

router.put('/:id', contact.updateContact)

router.delete('/:id', contact.deleteContact)

module.exports = router