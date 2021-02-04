const { Schema, model, Types} = require('mongoose')


const schema = new Schema({
    src:String,
    size:Number,
    format:String,
    messageId:{
        type:Types.ObjectId, 
        ref:"Messages", 
        required:true
    },
    ownerId:{
        type:Types.ObjectId, 
        ref:"Users", 
        required:true
    },
    dialogId:{
        type:Types.ObjectId, 
        ref:"Dialogs", 
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
})
module.exports = model('UploadFiles', schema)