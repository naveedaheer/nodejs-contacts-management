const contact = require('../controllers/contactController')
const router = require('express').Router()

router.post('/addContact', contact.addContact)

router.get('/getContact', contact.getContact)

router.get('/', contact.getAllContacts)

router.put('/updateContact', contact.updateContact)

router.delete('/deleteContact', contact.deleteContact)

module.exports = router