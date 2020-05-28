var fs = require('fs');

var EditJson = {
    edit_brandexcel: function (req, res) {
        var DataBuffer = fs.readFileSync('public/json/parse_brand.json');
        var ExcelJsonData = JSON.parse(DataBuffer.toString());
        DataBuffer = fs.readFileSync('public/json/brand.json');
        var JsonData = JSON.parse(DataBuffer.toString());

        SheetData = ExcelJsonData["StyleBOX Brand"]
        for(i in SheetData){
            element = SheetData[i];
            var BrandName = element.Name;
            BrandName = BrandName.replace( / /gi, '_');
            BrandName = BrandName.replace(" ","");
            var FollowerNum = element[" Followers "];
            var instaID = element.Insta;
            if(BrandName==undefined || instaID==undefined){
                continue
            }
            instaID = instaID.substring(26).split('/')[0];
            var BrandID = "";
            var BrandSite = "";
            var BrandText = "";
            if (element['ID (Key Value)'] != undefined) {
                BrandID = element['ID (Key Value)'];
            }
            if (element.site != undefined) {
                BrandSite = element.site;
            }
            if (element.Text != undefined) {
                BrandText = element.Text;
            }
            var AddressList = []
            for (i = 1; i <= 10; i++) {
                tmpKey = 'address ' + String(i)
                if (element[tmpKey] == undefined) {
                    AddressList.push("");
                } else {
                    AddressList.push(element[tmpKey]);
                }
            }
            tmp = {}
            tmp["BrandID"] = BrandID;
            tmp["instaID"] = instaID;
            tmp["FollowerNum"] = FollowerNum;
            tmp["Site"] = BrandSite;
            tmp["Text"] = BrandText;
            tmp["Address"] = AddressList;
            if(JsonData.hasOwnProperty(BrandName)&&JsonData[BrandName].hasOwnProperty('FeedNum')){
                tmp["FeedNum"] = JsonData[BrandName]['FeedNum']
            }else{
                tmp["FeedNum"] = 0;
            }
            if(JsonData.hasOwnProperty(BrandName)&&JsonData[BrandName].hasOwnProperty('NewFeedNum')){
                tmp["NewFeedNum"] = JsonData[BrandName]['NewFeedNum']
            }else{
                tmp["NewFeedNum"] = 0;
            }
            if(JsonData.hasOwnProperty(BrandName)&&JsonData[BrandName].hasOwnProperty('TodayDownloadNum')){
                tmp["TodayDownloadNum"] = JsonData[BrandName]['TodayDownloadNum']
            }else{
                tmp["TodayDownloadNum"] = 0;
            }
            if(JsonData.hasOwnProperty(BrandName)&&JsonData[BrandName].hasOwnProperty('ReviewStatus')){
                tmp["ReviewStatus"] = JsonData[BrandName]['ReviewStatus']
            }else{
                tmp["ReviewStatus"] = 0;
            }
            if(JsonData.hasOwnProperty(BrandName)&&JsonData[BrandName].hasOwnProperty('Comment')){
                tmp["Comment"] = JsonData[BrandName]['Comment']
            }else{
                tmp["Comment"] = "";
            }

            console.log(tmp)
            JsonData[BrandName] = tmp;
            // JsonData[BrandName]["BrandID"] = BrandID;
            // JsonData[BrandName]["instaID"] = instaID;
            // JsonData[BrandName]["FollowerNum"] = FollowerNum;
            // JsonData[BrandName]["Site"] = BrandSite;
            // JsonData[BrandName]["Text"] = BrandText;
            // JsonData[BrandName]["Address"] = AddressList;
            // JsonData[BrandName]["FeedNum"] = 0;
            // JsonData[BrandName]["NewFeedNum"] = 0;
            // JsonData[BrandName]['TodayDownloadNum'] = 0;
            // JsonData[BrandName]['ReviewStatus'] = "N";
            // JsonData[BrandName]['Comment'] = ''
        }

        fs.writeFileSync('public/json/brand.json', JSON.stringify(JsonData), 'utf-8');
        res.redirect('/');
    }
}
module.exports = EditJson;