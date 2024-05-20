const express = require('express')

const router = express.Router()

const {
    signUp
} = require("../controllers/advertiser")

router.post('/signup', signUp)
module.exports = router