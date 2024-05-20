const express = require('express')

const router = express.Router()

const {
    getAll,
    create
} = require("../controllers/category")

const {
    validTokenMatch, isAdvertiser, validAuth
} = require("../../middlewares")

router.get('', validAuth, getAll)
router.post('', validTokenMatch, isAdvertiser, create)
module.exports = router