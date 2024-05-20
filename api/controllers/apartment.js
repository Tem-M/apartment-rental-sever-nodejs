const apartment = require("../models/apartment")
const Apartment = require("../models/apartment")
const mongoose = require('mongoose')
const user = require("./user")

module.exports = {
    getAll: (req, res) => {
        Apartment.find()
            .then(apartments => {
                res.status(200).send(apartments)
            })
            .catch(error => {
                console.log("apartment getAll: " + error.message)
                res.status(500).send({ error: error.message })
            })
    },

    getById: (req, res) => {
        const apartment = req.params.apartment
        if (!apartment) {
            return res.status(401).send({ message: "missing apartment _id" })
        }

        Apartment.findById(apartment).populate({ path: 'advertiser', strictPopulate: false })
            .populate({ path: 'category', strictPopulate: false })
            .populate({ path: 'city', strictPopulate: false })
            .then(
                re => {
                    return res.status(200).send(re)
                }
            )
            .catch(err => {
                console.log(`apartment getById Apartment.findById(${apartment}) failed!: ` + err.message + "\nmight be cause by getCities or getCategories")
                return res.status(401).send({ error: err.message })

            })

    },

    create: (req, res) => {
        const { name, description, category, city, address, numBeds, price, userId } = req.body
        const img = req.file ? req.file.path.replace('\\', '/') : 'uploads/6306486.jpg'

        if (!description || !address || !numBeds || !price || !userId || !category || !city) {
            return res.status(400).send({ message: "missing required information" })
        }

        if (price <= 0 || numBeds <= 0 || description.length == 0 || address.length == 0) {
            return res.status(400).send({ message: "invalid information" })
        }
        const newApartment = new Apartment({
            name,
            description,
            img,
            category: new mongoose.Types.ObjectId(category),
            city: new mongoose.Types.ObjectId(city),
            address,
            numBeds,
            price,
            advertiser: userId
        })

        newApartment.save()
            .then(apartment => {
                res.status(200).send({ message: `apartment ${apartment.apartment} added succesfully` })
            })
            .catch(err => {
                console.log("apartment create newApartment.save() failed: " + err.message)
                res.status(500).send({ error: err.message })
            })

    },

    remove: (req, res) => {
        const apt = req.params.apartment
        if (!apt) {
            return res.status(400).send({ message: "missing id" })
        }

        Apartment.findByIdAndDelete(apt)
            .then((apartment) => {
                res.status(200).send(apartment)
            })
            .catch(err => {
                console.log(`apartment remove findByIdAndDelete(${apt}) failed: ` + err.message)
                res.status(500).send({ error: err.message })
            })

    },

    update: (req, res) => {
        const apt = req.params.apartment
        if (!apt) {
            return res.status(400).send({ message: "missing id" })
        }
        else {
            if (req.file) {
                req.body.img = req.file.path.replace('\\', '/')
            }
            console.log(req.body)
            Apartment.findByIdAndUpdate(apt, req.body, { new: true })
                .then(
                    (apartment) => {
                        return res.status(200).send(apartment)
                    }
                )
                .catch(
                    err => {
                        console.log(`apartment update findByIdAndUpdate(${apt}) failed: ` + err.message)
                        return res.status(500).send({ error: err.message })
                    }
                )
        }

    },

    getAllAdv: (req, res) => {
        const userId = req.body.userId
        console.log(userId)
        Apartment.find({ advertiser: { $eq: userId } })
            .populate({ path: 'advertiser', strictPopulate: false })
            .populate({ path: 'category', strictPopulate: false })
            .populate({ path: 'city', strictPopulate: false })
            .then(apartments => {
                res.status(200).send(apartments)
            })
            .catch(err => {
                console.log(`apartment getAllAdv find({advertiser: {$eq: ${userId}}) failed: ` + err.message)
                res.status(500).send({ error: error.message })
            })
    },

    getByCategory: (req, res) => {
        const category = req.params.category
        if (category) {
            Apartment.find({ category: { $eq: category } }).then(
                apartments => {
                    return res.status(200).send(apartments)
                }
            ).catch(
                err => {
                    console.log(`apartment getByCategory find({category: {$eq: ${category}}) failed: ` + err.message)
                    return res.status(401).send([])
                }
            )
        }
        else {
            return res.status(401).send([])
        }
    },

    getByCity: (req, res) => {
        const cityCode = req.params.city
        if (cityCode) {
            Apartment.find({ city: { $eq: new mongoose.Types.ObjectId(cityCode) } }).then(
                apartments => {
                    return res.status(200).send(apartments)
                }
            ).catch(
                err => {
                    console.log(`apartment getByCity find({city: {$eq: ${cityCode}}) failed: ` + err.message)
                    return res.status(401).send([])
                }
            )
        }
        else {
            return res.status(401).send([])
        }
    },

    getByMoreThanNumBeds: (req, res) => {
        const numBeds = parseInt(req.params.numBeds)
        if (numBeds) {
            Apartment.find({ numBeds: { $gt: numBeds } }).then(
                apartments => {
                    return res.status(200).send(apartments)
                }
            ).catch(
                err => {
                    console.log(`apartment getByMoreThanNumBeds find({numBeds: {$gt: ${numBeds}}) failed: ` + err.message)
                    return res.status(401).send([])
                }
            )
        }
        else {
            return res.status(401).send([])
        }
    },

    getByLessThanNumBeds: (req, res) => {
        const numBeds = parseInt(req.params.numBeds)
        if (numBeds) {
            Apartment.find({ numBeds: { $lt: numBeds } }).then(
                apartments => {
                    return res.status(200).send(apartments)
                }
            ).catch(
                err => {
                   
                    console.log(`apartment getByLessThanNumBeds find({numBeds: {$lt: ${numBeds}}) failed: ` + err.message)
                    return res.status(401).send([])
                }
            )
        }
        else {
            return res.status(401).send([])
        }
    },

    getByNumBeds: (req, res) => {
        const numBeds = parseInt(req.params.numBeds)
        if (numBeds) {
            Apartment.find({ numBeds: { $eq: numBeds } }).then(
                apartments => {
                    return res.status(200).send(apartments)
                }
            ).catch(
                err => {
                    console.log(`apartment getByNumBeds find({numBeds: {$eq: ${numBeds}}) failed: ` + err.message)
                    return res.status(401).send([])
                }
            )
        }
        else {
            return res.status(401).send([])
        }
    },

    getByPriceRange: (req, res) => {
        const min = parseFloat(req.params.min)
        const max = parseFloat(req.params.max)
        Apartment.find({ price: { $gte: min, $lte: max } }).then(
            apartments => {
                console.log(apartments)
                return res.status(200).send(apartments)
            }
        ).catch(
                err => {
                    console.log(`apartment getByPriceRange find({ price: { $gte: ${min}, $lte: ${max} } }) failed: ` + err.message)
                    return res.status(500).send(err.message)
                }
            )
    }
    
}