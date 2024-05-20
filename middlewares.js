const jwt = require('jsonwebtoken')
const Advertiser = require('./api/models/advertiser')
const Apartment = require('./api/models/apartment')
const City = require('./api/models/city')
const Category = require('./api/models/category')
const user = require('./api/models/user')
const multer = require('multer')
const fs = require('fs')

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    }
    else {
        req.error = `invalid file type!`
        cb(null, false)
    }
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname.replaceAll(' ', '_'))
    }
})

module.exports = {
    upload: multer({
        // dest: 'uploads/',
        storage,
        limit: {
            fileSize: 1024 * 1024 * 2 //2mb
        },
        fileFilter
    }),

    validAuth: (req, res, next) => {
        if (!req.headers.authorization) {
            return res.status(401).send({ error: "authentication failed!" })
        }

        const headers = req.headers.authorization.split(' ')
        if (headers.length < 2) {
            return res.status(401).send({ error: "authentication failed!" })
        }

        const token = headers[1]

        jwt.verify(token, process.env.SECRET, (error, result) => {
            if (error || !result) {
                return res.status(401).send({ error: `authorization failed!` })
            }
            next()
        })
    },

    validTokenMatch: (req, res, next) => {
        console.log("checking if token match")
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        var userId
        if (req.body.userId)
            userId = req.body.userId

        else if (req.params.userId)
            userId = req.params.userId

        else if (req.query.userId)
            userId = req.query.userId

        else {
            return res.status(403).send("User id missing")
        }


        if (!token) {
            return res.status(401).json({ message: 'Authorization token is missing' });
        }
        
        else {
            jwt.verify(token, process.env.SECRET, { algorithms: ['HS256'] }, (error, result) => {
                if (error) {
                    if (error.name === 'TokenExpiredError') {
                        return res.status(401).json({ message: 'Token has expired' });
                    } else {
                        console.log('error happens when trying to verify token: ' + error.message)
                        return res.status(500).json({ message: error.message });
                    }
                }
                else if (result) {
                    if (result._id === userId) {
                        next();
                    } else {
                        return res.status(403).json({ message: 'Invalid user ID for the provided token' });
                    }
                }
            })
        }

    },

    isAdvertiser: (req, res, next) => {
        var advertiser
        if (req.body.userId) {
            advertiser = req.body.userId
        }
        else if (req.params.userId) {
            advertiser = req.params.userId
        }

        if (advertiser) {
            Advertiser.findById(advertiser).then(
                re => {
                    if (!re || re.length == 0) {
                        return res.status(401).send({ message: "invalid advertiser" })
                    }
                    else {
                        next()
                    }

                }
            )
            .catch(
                error => {
                    console.log("middlewares isAdvertiser findById failed: " + error.message)
                    return res.status(500).send({ message: error.message })
                }
            )
        }
        else {
            return res.status(401).send({ message: "invalid advertiser" })
        }

    },

    ownsApartment: (req, res, next) => {
        var userId
        if (req.body.userId) {
            userId = req.body.userId
        }
        else if (req.params.userId) {
            userId = req.params.userId
        }
        else {
            return res.status(401).send({ message: "invalid advertisor" })
        }
        var apartment
        if (req.body.apartment) {
            apartment = req.body.apartment
        }
        else if (req.params.apartment) {
            apartment = req.params.apartment
        }

        if (apartment) {
            Apartment.findById(apartment).then(
                re => {
                    if (!re || re.length == 0) {
                        return res.status(401).send({ message: "invalid apartment" })
                    }
                    else if (re.advertiser.toString() !== userId) {
                        console.log(re.advertiser)
                        return res.status(403).send({ message: "sorry, you don't own this apartment" })
                    }
                    else {
                        next()
                    }

                }
            )
            .catch(
                err => {
                    console.log("middlewares ownsApartment findById failed: " + err.message)
                    res.status(500).send({ message: error.message })
                }
            )
        }
        else {
            return res.status(401).send({ message: "invalid apartment" })
        }



    },

    isCity: (req, res, next) => {
        var city
        if (req.body.city) {
            city = req.body.city
        }
        else if (req.params.city) {
            city = req.params.city
        }
        else {
            return res.status(401).send({ message: "invalid city" })
        }

        City.findById(city).then(
            re => {
                if (!re || re.length == 0) {
                    return res.status(401).send({ message: "invalid city" })
                }
                else {
                    next()
                }
            }
        )
        .catch(
            err => {
                console.log("middlewares isCity findById failed: " + err.message)
                return res.status(500).send({ message: err.message })
            }
        )
    },

    isCityLax: (req, res, next) => {
        var city
        if (req.body.city) {
            city = req.body.city
        }
        if (req.params.city) {
            city = req.params.city
        }

        if (city) {
            City.findById(city).then(
                re => {
                    if (!re || re.length == 0) {
                        return res.status(401).send({ message: "invalid city" })
                    }
                    else {
                        next()
                    }

                }
            )
            .catch(
                err => {
                    console.log("middlewares isCityLax findById failed: " + err.message)
                    return res.status(500).send({ message: err.message })
                }
            )
        }
        else {
            next()
        }

    },

    isCategory: (req, res, next) => {
        var category
        if (req.body.category) {
            category = req.body.category
        }
        else if (req.params.category) {
            category = req.params.category
        }
        else {
            return res.status(401).send({ message: "invalid category" })
        }

        Category.findById(category).then(
            re => {
                if (!re || re.length == 0) {
                    return res.status(401).send({ message: "invalid category" })
                }
                else {
                    next()
                }

            }
        )
        .catch(
            err => {
                console.log("middlewares isCategory findById failed: " + err.message)
                return res.status(500).send({ message: err.message })
            }
        )
    },

    isCategoryLax: (req, res, next) => {
        console.log("checking if is category lax")
        var category
        if (req.body.category) {
            category = req.body.category
        }
        else if (req.params.category) {
            category = req.params.category
        }
        if (category) {
            console.log(category)
            Category.findById(category).then(
                re => {
                    if (!re || re.length == 0) {
                        return res.status(401).send({ message: "invalid category" })
                    }
                    next()
                }
            )
            .catch(
                err => {
                    console.log("middlewares isCategoryLax findById failed: " + err.message)
                    return res.status(500).send({ message: err.message })
                }
            )
        }
        else {
            next()
        }

    }
}