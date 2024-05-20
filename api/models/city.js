const mongoose = require('mongoose')

const CitySchema = mongoose.Schema({
    name: {
        type:String,
        required:true,
        matches: /[א-ת ]*/
    }
})

module.exports = mongoose.model("City", CitySchema)