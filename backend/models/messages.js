const { Schema, model, Types } = require('mongoose')




const schema = new Schema({
    text:{type:String, default:null},
    date:{type:Date, default:Date.now},
    readed:{type:Boolean, default:false},
    audio:{type:String, default:null},
    attachments:[{ type:Types.ObjectId, ref:'UploadFiles' }],
    dialogId:{type:Types.ObjectId, ref:'Dialogs', required:true},
    ownerId:{type:Types.ObjectId, ref:'Users', required:true}, 
     changed:{type:Boolean, default:false} 
   
},
// {
//     //timestamps: true,
//     //usePushEach: true,   
// }
)


module.exports = model('Messages', schema)
