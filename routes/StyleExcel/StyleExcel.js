var fs = require('fs');
var XLSX = require('XLSX');
var EditJson = require('./EditJson');

var StyleExcel = {
    upload : function (req,res){
        // 엑셀 업로드하면 json으로 변환해서 저장하는 것
        const workbook = XLSX.readFile('public/excel/style.xlsx');
        var json_data = {}
        let i = workbook.SheetNames.length;
        while (i--) {
            const sheetname = workbook.SheetNames[i];
            json_data[sheetname] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetname]);
        }
        fs.writeFileSync('routes/StyleExcel/parse_style.json', JSON.stringify(json_data), 'utf-8');
        EditJson.edit_brandexcel(req,res);
    }
};
module.exports = StyleExcel;