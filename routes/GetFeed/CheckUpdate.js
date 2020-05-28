var fs = require('fs')
var GetTodayData = require('./GetTodayData')
var crawling = require('./crawling')

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
TodayDate = year +'-'+ month +'-'+ day;

var checkupdate = {
    checkdate: function (req, res) {
        var par = JSON.parse(fs.readFileSync('public/json/LastUpdateDate.json', 'utf8'));
        console.log(TodayDate)
        console.log(par['lastupdatedate'])
        if (par['lastupdatedate'] == TodayDate) {
            GetTodayData.renderdata(req, res);
        } else {
            console.log('날짜가 일치하지 않아 크롤링시작함.');
            crawling.runcrawling(req, res);
        }
    }
};
module.exports = checkupdate;