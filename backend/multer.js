const multer = require('multer')
const { extname, resolve } = require('path')
const crypto = require('crypto')

module.exports = {
    dest: resolve(__dirname,'uploads'),
    storage: multer.diskStorage({
        destination: (req,file,cb) => {
            cb(null,resolve(__dirname,'uploads'))
        },
            filename: (req,file,cb) => {
                crypto.randomBytes(16,(err,hash) => {
                    if(err) cb(err);
                    const filename = `${hash.toString('hex')}-${file.originalname}`;
                    cb(null,filename)
                })
            }
    })
};
