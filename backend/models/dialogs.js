const { Schema, model, Types} = require('mongoose')


const schema = new Schema({
   owner:{
      type:Types.ObjectId,
      ref:'Users',
      default:null,
   },
   members:[{
      type:Types.ObjectId,
      ref:'Users',
      default:null
   }],
   lastMessage:{
      type:Types.ObjectId,
      ref:'Messages',
      default:null
   },
   privateChat:{
      type:Boolean,
      default:false
   },
   chat:{
      type:Boolean,
      default:false,
   },
   openChat:{
      type:Boolean,
      default:false,
   },
   channel:{
      type:Boolean,
      default:false,
   }, 
   dialogName:{
      type:String,
      default:''
   },
   dialogAvatar:{
      type:String,
      default:''
   },
   dialogFollowers:{
      type:Number,
      default:0
   }
})



module.exports = model('Dialogs', schema)
