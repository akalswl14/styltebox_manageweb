var fs = require('fs');
const puppeteer = require('puppeteer');
var XLSX = require('XLSX');
var request = require('request');
var baseUrl = 'https://www.instagram.com/';
const insta_id = 'PUT YOUR ID HERE';
const insta_pw = 'PUT YOUR PW HERE';

const init = async (req, res) => {
    var RequestJsonData = GetUrlList();
    var BrandData = GetBrandList();
    var CrawlingData = GetCrawlingFeedJson();
    var DownloadJsonData = GetDownloadDataJson();
    var FeedUrlList = Object.keys(RequestJsonData);
    var Len_UrlList = FeedUrlList.length;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    for (var i = 0; i < Len_UrlList; i++) {
        console.log('for문')
        var EachUrl = FeedUrlList[i];
        console.log(EachUrl);
        var JsonData = await Scroll(EachUrl, page);
        console.log(JsonData.hasOwnProperty(['graphql']));
        if (JsonData.hasOwnProperty(['graphql']) && JsonData['graphql'].hasOwnProperty('shortcode_media')) {
            var dir = 'public/img/crawlingimg/' + EachUrl
            try { fs.mkdirSync(dir); } catch (e) {
                if (e.code != 'EEXIST') throw e; // 존재할경우 패스처리함.
            }
            var FeedData = ParseData(EachUrl, RequestJsonData[EachUrl], JsonData);
            for (var j = 0; j < RequestJsonData[EachUrl].length; j++) {
                tmp = 'Contents_' + String(j + 1);
                CrawlingData[EachUrl]['Contents'][tmp] += 1
            }
            CrawlingData[EachUrl]['DownloadNum'] += 1
            var BrandName = CrawlingData[EachUrl]['brand']
            BrandData[BrandName]['TodayDownloadNum'] += 1
            FeedData['Brand'] = BrandName;
            DownloadJsonData[EachUrl] = FeedData;
        }
    }
    UpdateBrandJson(BrandData);
    UpdateCrawlingFeedJson(CrawlingData);
    UpdateDownloadDataJson(DownloadJsonData);
    await browser.close();
    var excelHandler = MakeExcelData(RequestJsonData)
    MakeExcel(excelHandler);
    res.redirect('/');
};
const GetUrlList = () => {
    console.log('GetUrlList')
    const DataBuffer = fs.readFileSync('public/json/DownloadRequest.json');
    var JsonData = JSON.parse(DataBuffer.toString());
    return JsonData;
};
const GetDownloadDataJson = () => {
    console.log('GetDownloadDataJson')
    const DataBuffer = fs.readFileSync('public/json/DownloadData.json');
    var JsonData = JSON.parse(DataBuffer.toString());
    return JsonData;
};
const GetBrandList = () => {
    console.log('GetBrandList')
    const DataBuffer = fs.readFileSync('public/json/brand.json');
    var JsonData = JSON.parse(DataBuffer.toString());
    return JsonData;
};
const GetCrawlingFeedJson = () => {
    console.log('GetCrawlingJson')
    const DataBuffer = fs.readFileSync('public/json/CrawlingFeed.json');
    var JsonData = JSON.parse(DataBuffer.toString());
    return JsonData;
}
const UpdateDownloadDataJson = (JsonData) => {
    console.log('UpdateDownloadDataJson')
    fs.writeFileSync('public/json/DownloadData.json', JSON.stringify(JsonData), 'utf-8');
};
const UpdateBrandJson = (JsonData) => {
    console.log('UpdateBrandList')
    fs.writeFileSync('public/json/brand.json', JSON.stringify(JsonData), 'utf-8');
}
const UpdateCrawlingFeedJson = (JsonData) => {
    console.log('UpdateCrawlingJson')
    fs.writeFileSync('public/json/CrawlingFeed.json', JSON.stringify(JsonData), 'utf-8');
}
const DateConversion = (date) => {
    var rtnDate = '';
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
    var rtnDate = year + '-' + month + '-' + day;
    return rtnDate;
}
const ParseData = (FeedId, ReqContData, JsonData) => {
    var FeedData = {}
    console.log('parsing data');
    console.log(JsonData['graphql']['shortcode_media']['owner']['username'])
    var PostTimeStamp = JsonData['graphql']['shortcode_media']['taken_at_timestamp'];
    FeedData['Date'] = DateConversion(new Date(PostTimeStamp * 1000));
    FeedData['TagList'] = ''
    FeedData['Text'] = JsonData['graphql']['shortcode_media']['edge_media_to_caption']['edges'][0]['node']['text']
    FeedData['LikeNum'] = JsonData['graphql']['shortcode_media']['edge_media_preview_like']['count']
    var is_video = JsonData['graphql']['shortcode_media']['is_video']
    var ContentsList = {}
    // igtv / 동영상 하나인 경우
    if (is_video == true) {
        var ContUrl = JsonData['graphql']['shortcode_media']['video_url'];
        ContentsList['Contents_1'] = ContUrl;
        var DownloadPath = 'public/img/crawlingimg/' + FeedId + '/' + 'Contents_1'
        DownloadOnLocal(ContUrl, DownloadPath)
    } else {
        // 사진 여러장 / 동영상 여러장 / 사진과동영상 여러장
        if (JsonData['graphql']['shortcode_media'].hasOwnProperty('edge_sidecar_to_children')) {
            Len_ContJson = JsonData['graphql']['shortcode_media']['edge_sidecar_to_children']['edges'].length;
            for (var j = 0; j < Len_ContJson; j++) {
                var cntstr = String(j + 1);
                if (ReqContData.includes(cntstr)) {
                    cntstr = 'Contents_' + String(j + 1)
                    if (JsonData['graphql']['shortcode_media']['edge_sidecar_to_children']['edges'][j]['node']['is_video']) {
                        // 동영상 일경우
                        var ContUrl = JsonData['graphql']['shortcode_media']['edge_sidecar_to_children']['edges'][j]['node']['video_url'];
                        ContentsList[cntstr] = ContUrl;
                    } else {
                        // 사진 일경우
                        var ContUrl = JsonData['graphql']['shortcode_media']['edge_sidecar_to_children']['edges'][j]['node']['display_url'];
                        ContentsList[cntstr] = ContUrl
                    }
                    var DownloadPath = 'public/img/crawlingimg/' + FeedId + '/' + cntstr
                    DownloadOnLocal(ContUrl, DownloadPath)
                }
            }
        } else {
            //사진 한장
            var ContUrl = JsonData['graphql']['shortcode_media']['display_url'];
            ContentsList['Contents_1'] = ContUrl;
            var DownloadPath = 'public/img/crawlingimg/' + FeedId + '/' + 'Contents_1'
            DownloadOnLocal(ContUrl, DownloadPath)
        }
    }
    FeedData['Contents'] = ContentsList;
    return FeedData;
}
const Scroll = async (EachUrl, page) => {
    console.log('Scroll')
    url = baseUrl + '/p/' + EachUrl + '?__a=1';
    await page.goto(url);
    await page.waitFor(5000);
    var element = await page.$('body > pre');
    if (element == null) {
        console.log('element is null!');
        console.log('로그인합니다.')
        try {
            //페이지로 가라
            await page.goto('https://www.instagram.com/accounts/login/');

            //아이디랑 비밀번호 란에 값을 넣어라
            await page.waitForSelector('input[name="username"]');
            await page.type('input[name="username"]', insta_id);
            await page.type('input[name="password"]', insta_pw);
            await page.click('button[type="submit"]');
            await page.waitFor(5000);
            await page.goto(url);
            element = await page.$('body > pre');
        } catch (error) {
            console.log('로그인 안되는 경우');
            console.log(error);
            await page.screenshot({
                fullPage: true,
                path: `public/img/crawling_screenshot/example_whynull_1.jpeg`
            })
            await page.goto(url);
            await page.waitFor(5000);
            var element = await page.$('body > pre');
            await page.screenshot({
                fullPage: true,
                path: `public/img/crawling_screenshot/example_whynull_2.jpeg`
            })
            return {}
        }
    }
    // let bodyHTML = await page.evaluate(() => document.body.innerHTML);
    // console.log(element);
    // console.log(bodyHTML);
    var json_data = await page.evaluate(element => element.textContent, element);
    json_data = JSON.parse(json_data);
    return json_data
}
const MakeExcelData = (RequestJsonData) => {
    console.log('MakeExcelData');
    var ColumnNameList = ['FeedId', 'Date', 'Brand', 'ContentsNumber', 'ContentsUrl', 'LikeNum', 'HashTagList', 'Text'];
    var DownloadJsonData = GetDownloadDataJson();
    var KeyList = Object.keys(RequestJsonData);
    var ExcelDataList = [ColumnNameList];
    for (var i = 0; i < KeyList.length; i++) {
        var EachKey = KeyList[i];
        var ContNumList = Object.keys(DownloadJsonData[EachKey]['Contents']);
        for (var j = 0; j < ContNumList.length; j++) {
            var EachContKey = ContNumList[j];
            tmpList = [];
            tmpList.push(EachKey);
            tmpList.push(DownloadJsonData[EachKey]['Date']);
            tmpList.push(DownloadJsonData[EachKey]['Brand']);
            tmpList.push(EachContKey);
            tmpList.push(DownloadJsonData[EachKey]['Contents'][EachContKey]);
            tmpList.push(DownloadJsonData[EachKey]['LikeNum']);
            tmpList.push(DownloadJsonData[EachKey]['TagList']);
            tmpList.push(DownloadJsonData[EachKey]['Text']);
            ExcelDataList.push(tmpList);
        }
    }
    var excelHandler = {
        getExcelFileName: function () {
            return 'public/excel/DownloadCrawling_nodejs.xlsx';
        },
        getSheetName: function () {
            return 'DownloadData';
        },
        getExcelData: function () {
            return ExcelDataList;
        },
        getWorksheet: function () {
            return XLSX.utils.aoa_to_sheet(this.getExcelData());
        }
    }
    return excelHandler
}
const MakeExcel = (excelHandler) => {
    console.log('MakeExcel');
    var wb = XLSX.utils.book_new();
    var newWorksheet = excelHandler.getWorksheet();
    wb.SheetNames.push(excelHandler.getSheetName());
    wb.Sheets[excelHandler.getSheetName()] = newWorksheet;
    XLSX.writeFile(wb, excelHandler.getExcelFileName());
}
const DownloadOnLocal = (url, path) => {
    if (url.indexOf('.mp4') != -1) {
        // 동영상 다운
        path += '.mp4'
    } else {
        // 사진 다운
        path += '.jpg'
    }
    request(url).pipe(fs.createWriteStream(path));
}

var downloadcrawling = {
    runcrawling: function (req, res) {
        init(req, res);
    }
};
module.exports = downloadcrawling;