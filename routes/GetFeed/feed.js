var express = require('express');
var router = express.Router();

/**
* BaseUrl : web.js router에 선언한 BaseUrl을 표시. request url을 쉽게 파악하기 위함
*  : /getfeed
*/

var crawling = require('./crawling');
var CheckUpdate = require('./CheckUpdate');
var UpdateData = require('./UpdateData');
var SelectFeed = require('./SelectFeed');
var MakeDownload = require('./MakeDownloadJson');

router.get('/',function(req,res){
    CheckUpdate.checkdate(req,res);
    // res.render('GetFeed/TodayFeed.html');
});

router.post('/',function(req,res){
    if (req.body.act_button == "modify reviewstatus"){
        UpdateData.update_reviewstatus(req,res);
    }else if(req.body.act_button == "modify comments"){
        UpdateData.update_comments(req,res);
    }else{
        console.log(req.body);
        if (typeof(req.body.chkbox)=='string'){
            brandnum = 1;
            brandList = new Array(req.body.chkbox)
        }else{
            brandList = req.body.chkbox;
            brandnum = brandList.length;
        }
        queryData = ''
        for(i=0;i<brandnum;i++){
            queryData += 'brand[]='+brandList[i];
            if(i<brandnum-1){
                queryData +='&'
            }
        }
        res.redirect('/getfeed/selectfeed?'+queryData);
    }
});

router.get('/selectfeed',function(req,res){
    SelectFeed.getembed(req,res);
});

router.post('/selectfeed',function(req,res){
    console.log(req.body);
    MakeDownload.makejson(req,res);
});
module.exports = router;