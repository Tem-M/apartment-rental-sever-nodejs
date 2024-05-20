const mongoose = require('mongoose')

const categorySchema = mongoose.Schema({
    name: {
        type:String,
        required:true,
        matches:'[א-ת ]*'
    }
})

module.exports = mongoose.model('Category', categorySchema)