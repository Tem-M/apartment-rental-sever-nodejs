const mongoose = require('mongoose')
const City = require('../models/city')
const Apartment = require('../models/apartment')

module.exports = {
    getAll: (req, res) => {
        City.find().then(
            re => {
                res.status(200).send(re)
            }
        )
        .catch(
            err => {
                console.log("city getall failed: " + err.message)
                res.status(500).send({ error: err.message })
            }
        )
    },

    create: (req, res) => {
        const name = req.body.name
        City.find({ name: { $eq: name } }).then(
            re => {
                if (!re || re.length == 0) {
                    const c = new City({
                        name
                    })
                    c.save().then(
                        r => {
                            res.status(200).send(r)
                        }
                    )
                    .catch(
                        err => {
                            console.log("city create save failed: " + err.message)
                            res.status(500).send({ error: err.message })
                        }
                    )
                }
                else {
                    res.status(401).send({ message: 'city already exists' })
                }
            }
        )
        .catch(
            err => {
                console.log("city create find duplicate cities failed: " + err.message)
                res.status(500).send(err.message)
            }
        )
    },

    getCitiesWithApartments: async (req, res) => {

        Apartment.find()
            .populate('city')
            .then(apartments => {
                const citiesWithApartments = apartments.map(apartment => ({
                    _id : apartment.city._id,
                    name : apartment.city.name
                }))
                return res.status(200).json(citiesWithApartments)
            })
            .catch(error => {
                console.error('get cities with apartments failed:', error.message)
                return res.status(500).json({ error: error.message })
            })
    }
}