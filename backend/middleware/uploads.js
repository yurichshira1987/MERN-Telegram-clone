const multer = require('multer')

const storage = multer.diskStorage({
    destination(req, file, cb){
        if(file.mimetype === 'audio/mp3' )
            cb(null, 'uploads/audio/')
        else if(file.mimetype === 'video/mp4')
            cb(null, 'uploads/video/')
        else 
            cb(null, 'uploads/image/')       
    },
    filename(req, file, cb){
        try{
            const date = new Date().getTime()
            if(file.mimetype === 'audio/mp3'){
                cb(null, `${date}.mp3` )
            }else{
                cb(null, `${date}-${file.originalname}`)
            }
        }catch(e){
            console.log(e)
        }
    }
})

const filterFile = (req, file, cb) =>{
    try{
        if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' ){
            cb(null, true)
        }else{
            cb(null, false)
        }
    }catch(e){
        console.log(e)
    }
}
const limits = {
    fileSize: 1024 * 1024 * 5
}


module.exports = multer({
    storage,
})