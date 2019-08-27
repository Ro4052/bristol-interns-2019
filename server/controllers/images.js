const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const auth = require('../middlewares/auth');
const fs = require('fs');

const dir = './src/images/uploads/';

router.post("/upload", auth, (req, res) => {
    fs.readdir(dir, (err, files) => {
        const storage = multer.diskStorage({
            destination: "./src/images/uploads/",
            filename: (req, file, cb) => {
               cb(null,`card (${files.length+1})` + path.extname(file.originalname));
            }
        });
         
        const upload = multer({
            storage: storage,
            limits:{fileSize: 1000000},
        }).single("myImage");
         
        upload(req, res, err => {
            if(!err)
                return res.send(200).end();
        });
    });
});

module.exports = router;
