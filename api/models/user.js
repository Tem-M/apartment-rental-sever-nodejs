const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    email: {
        type:String,
        required:true,
        //unique:true,
        match:/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    },
    password: {
        type:String,
        required:true
    }
    
})

module.exports = mongoose.model('User', UserSchema)