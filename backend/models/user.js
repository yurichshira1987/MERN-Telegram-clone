const {Schema, model} = require('mongoose')

const schema = new Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    },
    name:{
        type:String,
        required:true,
    },
    colorName:{
        type:String,
        default:'#4e7ea0',
    },
    password:{
        type:String,
        required:true
    },
    confirmed:{
        type:Boolean,
        default:false
    },
    avatar:{
        type:String,
        default:""
    },
    confirm_hash:String,
    last_seen: {
        type:Date,
        default:new Date()
    },
    signed:{
        type:Boolean,
        default:false
    }
})

schema.virtual('isOnline').get(function(){
    var dateNow = new Date().getTime()
    var last_seen = new Date(this.last_seen).getTime()
    return ((last_seen + 58000) > dateNow)
    
})

schema.set("toJSON", {
    virtuals: true,
});

module.exports = model('Users', schema)