const Advertiser = require("../models/advertiser")
const User = require("../models/user")
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = {
    signUp: (req, res) => {
        const {email, password} = req.body
        User.find({ email: { $eq: email } }).then(results => {
            if(!results || results.length > 0) {
                res.status(400).send({message:"email already exists"})
            }
            else{
                Advertiser.find({email: {$eq:email}}).then(
                    results => {
                        if(!results || results.length > 0) {
                            res.status(400).send({message:"email already exists"})
                        }
                    }
                ).catch(
                    err => {
                        console.log("user signup find duplicate email in advertiser failed: " + err.message)
                        res.status(500).send({error: err.message})
                    }
                )
            }
        }).catch(
            err => {
                console.log("user signup find duplicate email in user failed: " + err.message)
                res.status(500).send({error: err.message})
            }
        )
        
        bcrypt.hash(password, Number(process.env.HASH), (err, hash)=>{
            if(err){
                res.status(500).send({error:"couldn't create user"})
            }
            if(hash){
                const newUser = new User({email, password:hash})
                
                newUser.save()
                .then(
                    a=> {
                        const token = jwt.sign({_id:a._id}, process.env.SECRET, { expiresIn: '30d' })
                        res.status(200).send({_id:a._id, email:email, token:token, isAdvertiser:false})
                    }
                )
                .catch(
                    err => {
                        console.log("user signin new user save failed: " + err.message)
                        res.status(500).send({error:err.message})
                    }
                )
            }
        }
        )
    }

    
}