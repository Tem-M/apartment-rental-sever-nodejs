const express = require('express')

const router = express.Router()

const {
    getAll,
    create,
    getCitiesWithApartments
} = require('../controllers/city')

const {
    validTokenMatch,
    isAdvertiser,
    validAuth
} = require("../../middlewares")

router.get('/', validAuth, getAll)
router.post('/', validTokenMatch, isAdvertiser, create)
router.get('/apt', validAuth, getCitiesWithApartments)

module.exports = router