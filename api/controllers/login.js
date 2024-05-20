
const  Advertiser = require("../models/advertiser")
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require("../models/user")
const Apartment = require("../models/apartment")

module.exports = {

    signIn: (req, res) => {
        const {email, password} = req.body
        Advertiser.find({ email: { $eq: email } }).then(results => {
            if(!results || results.length == 0) {
                User.find({email: {$eq:email}}).then(results => {
                    if(results.length == 0) {
                        res.status(400).send({message:"email doesn't exist"})
                    }
                    else {
                        bcrypt.compare(password, results[0].password, (err, re) => {
                            if(err){
                                return res.status(500).send({message:"invalid information"})
                            }
                            if(re) {
                                const token = jwt.sign({_id:results[0]._id}, process.env.SECRET, { expiresIn: '30d' })
                                return res.status(200).send({_id:results[0]._id, email:email, token:token, isAdvertiser:false})
                            }
                        }) 
                    }
                })
            }
            
            else {
                bcrypt.compare(password, results[0].password, (err, re) => {
                    if(err){
                        return res.status(401).send({message:"invalid information"})
                    }
                    if(re) {
                        const token = jwt.sign({_id:results[0]._id}, process.env.SECRET, { expiresIn: '24h' })
                        Apartment.find({advertiser: {$eq:results[0]._id}}).then(
                            apartments => {
                                return res.status(200).send({_id:results[0]._id, email:results[0].email, phone:results[0].phone, phone2:results[0].phone2, token:token, isAdvertiser:true, apartments:apartments})
                            }
                        )
                        .catch(
                            err => {
                                console.log("sigin return user info with token (find()) failed: " + err.message)
                                return res.status(500).send({message:err.message})
                            }
                        )
                        
                    }
                })
            }
    
        }).catch(
            err => {
                console.log("signin find email failed: " + err.message)
                res.status(500).send({error: err.message})
            }
        )  
    }

    
}

