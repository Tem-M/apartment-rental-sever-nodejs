const Advertiser = require("../models/advertiser")
const User = require("../models/user")
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = {
    signUp: (req, res) => {
        const {email, password, phone, phone2} = req.body
        Advertiser.find({ email: { $eq: email } }).then(results => {
            if(!results || results.length > 0) {
                return res.status(400).send({message:"email already exists"})
            }
            else{
                User.find({email: {$eq:email}}).then(
                    results => {
                        if(!results || results.length > 0) {
                            return res.status(400).send({message:"email already exists"})
                        }
                    }
                ).catch(
                    err => {
                        console.log("err in advertiser signUp find duplicate email in user: " + err.message)
                        return res.status(500).send({error: err.message})
                    }
                )
            }
        }).catch(
            err => {
                console.log("err in advertiser signUp find duplicate email in advertiser: " + err.message)
                return res.status(500).send({error: err.message})
            }
        )
        
        Advertiser.find({phone: {$eq: phone , $eq: phone2}}).then(results => {
            if(!results || results.length > 0) {
                return res.status(400).send({message:"phone already exists"})
            }
        }).catch(
            err => {
                console.log("error in adveriser signup find duplicate phone: " + err.message)
                return res.status(500).send({error: err.message})
            }
        )

        
        bcrypt.hash(password, Number(process.env.HASH), (err, hash)=>{
            if(err){
                return res.status(500).send({error:"couldn't create user"})
            }
            else if(hash){
                const newAdvertiser = new Advertiser({email, password:hash, phone, phone2})
                
                newAdvertiser.save()
                .then(
                    a=> {
                        const token = jwt.sign({_id:a._id}, process.env.SECRET, { expiresIn: '24h' })
                        return res.status(200).send({_id:a._id, email:a.email, token:token, isAdvertiser:true})
                    }
                )
                .catch(
                    err => {
                        console.log("error in saving new advertiser: " + err.message)
                        return res.status(500).send({error:err.message})
                    }
                )
            }
        }
        )
    },

    
}