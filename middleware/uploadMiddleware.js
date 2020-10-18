const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    //configuration object
    destination:(req, file, cb) => {
        cb(null, 'public/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // max file size 5MB accept
    },
    fileFilter: (req, file, cb) => {
        const types = /jpeg|jpg|png/
        const extName = types.test(path.extname(file.originalname).toLowerCase())
        const mimeType = types.test(file.mimetype)

        if(extName && mimeType){
            cb(null, true);
        }else{
            cb(new Error('Only Suppoert Images'));
        }
    }
});

module.exports = upload;