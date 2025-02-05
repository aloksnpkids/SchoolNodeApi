const multer = require('multer');
const path = require('path');
const fs = require('fs');

module.exports = class MulterTrait {
    constructor() {}

    static uploadLocalFields(folderPath, fields) {
        const uploadDir = path.join(__dirname, `../uploads/${folderPath}`);

        // Ensure the directory exists
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, uploadDir);
            },
            filename: function (req, file, cb) {
                cb(null, Date.now() + '-' + file.originalname);
            }
        });

        return multer({ 
            storage: storage, 
            limits: { fileSize: 25000000 } 
        }).fields(fields);
    }
};
