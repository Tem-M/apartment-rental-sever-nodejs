const mongoose = require('mongoose')

const AdvertiserSchema = mongoose.Schema({
    email: {
        type:String,
        required:true,
        //unique:true,
        match:/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    },
    password: {
        type:String,
        required:true
    },
    phone: {
        type:String,
        required:true,
        match:/^(?![ -])(?!.*[- ]$)(?!.*[- ]{2})[0-9- ]+$/
    },
    phone2: {
        type:String,
        match:/^(?![ -])(?!.*[- ]$)(?!.*[- ]{2})[0-9- ]+$/
    }
})

module.exports = mongoose.model('Advertiser', AdvertiserSchema)