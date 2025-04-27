const multer = require('multer')
const fs = require('fs')
const path = require('path')

const storages = multer.diskStorage({
    destination: (req, file, cb) => {
        let fileDestination = 'public/uploads/'

        // check if directry is exsts

        if (!fs.existsSync(fileDestination)) {
            fs.mkdirSync(fileDestination, { recursive: true })

            cb(null, fileDestination)

        }
        else {
            cb(null, fileDestination)
        }
    },

    filename: (req, file, cb) => {
        let filename = path.basename(file.originalname, path.extname(file.originalname))

        let ext = path.extname(file.originalname)
        cb(null, filename + "_" + Date.now() + ext)
    }
})

let imageFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|svg|jfif|JPG|PNG|JPEG|JFIF|SVG|csv)$/)) {
        return cb(new Error('you can upload image file only'), false)
    }
    else {
        cb(null, true)
    }
}

let upload = multer({
    storage: storages,
    fileFilter: imageFilter,
    limit: {
        fileSize: 2000000
    }
})
module.exports = upload