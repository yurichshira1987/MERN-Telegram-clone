const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const Users = require('../models/user')
const config = require('../utils/config.json')

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtKey
}

module.exports = passport => {
    passport.use(
        new JwtStrategy(options, async (payload, done)=>{
            try{   
                const user = await Users.findById(payload.userId)     
    
                if(user && user.confirmed) {
                    done(null, user)
                    user.last_seen = new Date()
                    await user.save()
                }else{
                    done(null, false)
                }
            }catch(e){
                console.log(e)
            }
        })
    )
}