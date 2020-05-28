var fs = require('fs')
var GetTodayData = require('./GetTodayData');

var date = new Date();
var year = date.getFullYear();
var month = new String(date.getMonth() + 1);
var day = new String(date.getDate());

// 한자리수일 경우 0을 채워준다. 
if (month.length == 1) {
    month = "0" + month;
}
if (day.length == 1) {
    day = "0" + day;
}
TodayDate = year + '-' + month + '-' + day;

var UpdateData = {
    update_date: function (req, res) {
        var json_data = { 'lastupdatedate': TodayDate }
        fs.writeFileSync('public/json/LastUpdateDate.json', JSON.stringify(json_data), 'utf-8');
        GetTodayData.renderdata(req, res);
    },
    update_date_toYesterday:function(req,res){
        var selectDate = TodayDate.split("-");
        var changeDate = new Date();
        changeDate.setFullYear(selectDate[0], selectDate[1]-1, selectDate[2]-1);
        var y = changeDate.getFullYear();
        var m = changeDate.getMonth() + 1;
        var d = changeDate.getDate();
        if(m < 10)    { m = "0" + m; }
        if(d < 10)    { d = "0" + d; }
        var YesterdayDate = y + "-" + m + "-" + d;
        var json_data = { 'lastupdatedate': YesterdayDate }
        fs.writeFileSync('public/json/LastUpdateDate.json', JSON.stringify(json_data), 'utf-8');
        res.redirect('/getfeed');
    },
    update_reviewstatus: function (req, res) {
        BrandList = req.body.chkbox;
        const DataBuffer = fs.readFileSync('public/json/brand.json');
        var JsonData = JSON.parse(DataBuffer.toString());
        if (typeof (BrandList) === 'string') {
            CurrentStatus = JsonData[BrandList].ReviewStatus;
            if (CurrentStatus == "Y") {
                JsonData[BrandList].ReviewStatus = "N"
            } else {
                JsonData[BrandList].ReviewStatus = "Y"
            }
        } else {
            for (i = 0; i < BrandList.length; i++) {
                CurrentStatus = JsonData[BrandList[i]].ReviewStatus;
                if (CurrentStatus == "Y") {
                    JsonData[BrandList[i]].ReviewStatus = "N"
                } else {
                    JsonData[BrandList[i]].ReviewStatus = "Y"
                }
            }
        }
        fs.writeFileSync('public/json/brand.json', JSON.stringify(JsonData), 'utf-8');
        GetTodayData.renderdata(req, res);
    },
    update_comments: function (req, res) {
        // console.log(req.body);
        input_comments = req.body.input_comments;
        BrandList = req.body.chkbox;
        const DataBuffer = fs.readFileSync('public/json/brand.json');
        var JsonData = JSON.parse(DataBuffer.toString());
        if (typeof (BrandList) === 'string') {
            JsonData[BrandList].Comment = input_comments;
        } else {
            for (i = 0; i < BrandList.length; i++) {
                JsonData[BrandList[i]].Comment = input_comments;
            }
        }
        fs.writeFileSync('public/json/brand.json', JSON.stringify(JsonData), 'utf-8');
        GetTodayData.renderdata(req, res);
    }
};
module.exports = UpdateData;