const mongoose = require('mongoose')

const apartmentSchema = mongoose.Schema({
    name: {
        type:String
    },
    description: {
        type:String,
        require:true
    },
    img: {
        type:String
    },
    city: {
        type: mongoose.Types.ObjectId,
        ref: 'City',
        required: true
    },
    address: {
        type:String,
        required: true
    },
    numBeds: {
        type:Number,
        required:true
    },
    additions: {
        type:String
    },
    price: {
        type:Number,
        required: true
    },
    advertiser: {
        type:mongoose.Types.ObjectId,
        ref:'Advertiser',
        required:true
    },
    category: {
        type:mongoose.Types.ObjectId,
        ref:'Category',
        required:true
    }

})

module.exports = mongoose.model('Apartment', apartmentSchema)