const express = require('express');
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const router = express.Router();
const auth = require('../middlewares/auth');

let db;

if (process.env.NODE_ENV === 'testing') {
    db = require('../queries/testdb');
} else {
    db = require('../queries/db');
}

aws.config.update({
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    region: 'eu-west-2'
});

const s3 = new aws.S3();

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'telltales',
        acl: 'public-read',
        metadata: (req, file, cb) => {
            cb(null, { fieldName: 'TESTING_META_DATA!' });
        },
        key: (req, file, cb) => {
            cb(null, Date.now().toString());
        }
    })
});

const singleUpload = upload.single('image');

router.post("/upload", auth, (req, res) => {    
    singleUpload(req, res, err => {
        if(err) {
            console.log(err);
            return res.status(401).json({err});
        }
        db.addCard(req.file.etag, req.file.location)
        .then((card) => {
            return res.status(200).json({ 'imageUrl': card.url });
        })
        .catch(err => {
            res.status(err.code).json({ message: err.message });
        })
    });
});

module.exports = router;
