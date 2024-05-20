const Category = require("../models/category")
const mongoose = require('mongoose')

module.exports = {
    getAll: (req, res) => {
        Category.find().then(
            results => {
                res.status(200).send(results)
            }
        )
        .catch(
            err => {
                console.log("category get all failed: " + err.message)
                res.status(500).send({error:err.message})
            }
        )
    },

    create: (req, res) => {
        const name = req.body.name
        Category.find({name:{$eq:name}}).then(
            re=>{
                if(!re || re.length == 0) {
                    const cat = new Category({
                        name
                    })

                    cat.save().then(
                        r => {
                            return res.status(200).send(cat)
                        } 
                    )
                    .catch(
                        err=>{
                            console.log("category create save failed: " + err.message)
                            return res.status(500).send({error:err.message})
                        }
                    )
                }
                else {
                    return res.status(401).send({message:"cateogory " + name + " already exists"})
                }
            }
        )
        .catch(
            err => {
                console.log("category create find duplicates: " + err.message)
                res.status(500).send({error:err.message})
            }
        )
    }

    
}