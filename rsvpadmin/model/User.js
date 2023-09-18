const mongoose = require('mongoose');

const userSchema = {
    Email: "string",
    Status: {
        type: String,
        default: 'NA'
    },
    Name: "string",
    firstname: "string", 
    surname: "string", 
    city: "string", 
    opdiv: "string", 
    jobtitle: "string", 
    email: "string", 
    mob: "number", 
    gender: "string", 
    smoking: "string", 
    preferences: "string", 
    dietreq: "string", 
    physcon: "string" 

}

module.exports = mongoose.model('User', userSchema);