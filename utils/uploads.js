const multer = require('multer')

const fileFilter = (request, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error('wrong type :)'), false)
  }
  callback(null, true)
}

const upload = multer({ dest: 'uploads/', fileFilter })

module.exports = {
 upload
}