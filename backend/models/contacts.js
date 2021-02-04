const {Schema, Types, model} = require('mongoose')

const schema = new Schema({
    owner:{
        type:Types.ObjectId,
        ref:'Users',
        required:true,
    },
    contact:{
        type:Types.ObjectId,
        ref:'Users',
        required:true,
    },
})

module.exports = model('Contacts', schema)