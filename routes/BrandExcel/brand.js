var express = require('express');
var router = express.Router();
var multer = require('multer');
const path = require("path");

let storage = multer.diskStorage({
    destination: function(req, file ,callback){
        callback(null, "public/excel/")
    },
    filename: function(req, file, callback){
        let extension = path.extname(file.originalname);
        callback(null, 'brand' + extension);
    }
});

let upload = multer({ storage: storage});

/**
* BaseUrl : web.js router에 선언한 BaseUrl을 표시. request url을 쉽게 파악하기 위함
*  : /brandexcel
*/

var BrandExcel = require('./BrandExcel');

router.get('/',function(req,res){
    res.render('BrandExcel/BrandExcel.html');
});

router.post('/',upload.single('myfile'),function(req,res){
    let file = req.file
    let result = {
        originalName : file.originalname,
        size : file.size,
    }
    BrandExcel.upload(req,res);
});

module.exports = router;