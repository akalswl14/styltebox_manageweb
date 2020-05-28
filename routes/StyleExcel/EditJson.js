var fs = require('fs');
var crawling = require('../GetFeed/crawling');

var EditJson = {
    edit_brandexcel: function (req, res) {
        var DataBuffer = fs.readFileSync('public/json/parse_style.json');
        var ExcelJsonData = JSON.parse(DataBuffer.toString());
        DataBuffer = fs.readFileSync('public/json/style.json');
        var JsonData = JSON.parse(DataBuffer.toString());

        SheetNameList = Object.keys(ExcelJsonData)
        for (var EachSheet in SheetNameList){
            console.log('sheetname:'+EachSheet);
            var SheetData = ExcelJsonData[EachSheet];
            for(var i in SheetData){
                console.log("sheetData is :")
                console.log(SheetData[i])
            }
        }
    }
}
module.exports = EditJson;