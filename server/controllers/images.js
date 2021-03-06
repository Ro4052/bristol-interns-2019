const express = require('express');
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const router = express.Router();
const auth = require('../middlewares/auth');

const db = require('../queries/db');

aws.config.update({
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    region: 'eu-west-2'
});

const s3 = new aws.S3();

const upload = multer({
    storage: multerS3({
        s3,
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
            console.error(err);
            return res.status(401).json({err});
        }
        db.addCard(req.file.etag, req.file.location)
        .then(card => res.status(200).json({ imageUrl: card.url }))
        .catch(err => res.status(409).json({ message: err.message }))
    });
});

module.exports = router;
