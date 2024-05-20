const express = require('express')

const router = express.Router()

const {
    getAll,
    create,
    remove,
    update,
    getById,
    getAllAdv,
    getByCategory,
    getByCity,
    getByMinNumBeds,
    getByMaxNumBeds,
    getByPriceRange,
    getByMoreThanNumBeds,
    getByLessThanNumBeds,
    getByNumBeds,
    getCities
} = require("../controllers/apartment")

const {
    validAuth, validTokenMatch, isAdvertiser, ownsApartment, isCategory, isCity, upload, isCategoryLax, isCityLax
} = require("../../middlewares")
// const { uploaded } = require('../controllers/upload')

router.get('', getAll)
router.get('/:apartment', validAuth, getById)
router.get('/adv/:userId', validTokenMatch, isAdvertiser, getAllAdv)
router.get('/city/:city', validAuth, getByCity)
router.get('/category/:category', validAuth, getByCategory)
router.get('/minBeds/:numBeds', validAuth, getByMoreThanNumBeds)
router.get('/maxBeds/:numBeds', validAuth, getByLessThanNumBeds)
router.get('/beds/:numBeds', validAuth, getByNumBeds)
router.get('/price/:min/:max', validAuth, getByPriceRange)
router.post('', upload.single('file'), validTokenMatch, isAdvertiser, isCity, isCategory, create)
router.delete('/:apartment/:userId', validTokenMatch, isAdvertiser, ownsApartment, remove)
router.patch('/:apartment', upload.single('file'), validTokenMatch, isAdvertiser, ownsApartment, isCityLax, isCategoryLax, update)
module.exports = router