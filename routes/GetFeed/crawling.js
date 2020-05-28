var UpdateData = require('./UpdateData');
var fs = require('fs');
var baseUrl = 'https://www.instagram.com/';
const puppeteer = require('puppeteer');
const insta_id = 'PUT YOUR ID HERE';
const insta_pw = 'PUT YOUR PW HERE';

const init = async (req, res) => {
    var BrandList = GetBrandList();
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    Len_BrandList = Object.keys(BrandList).length;
    for (var i = 0; i < Len_BrandList; i++) {
        console.log('for문')
        //  브랜드 정보를 0 또는 ""로 초기화
        var eachBrand = Object.keys(BrandList)[i];
        BrandList[eachBrand]['TodayDownloadNum'] = 0
        BrandList[eachBrand]['Comment'] = ""
        // 새 게시물, 팔로워 정보, 게시물 수 정보 업데이트, url 리스트 크롤링
        console.log(eachBrand);
        var profileData = await Scroll(BrandList[eachBrand], page);
        console.log(profileData.hasOwnProperty(['graphql']));
        if (profileData.hasOwnProperty(['graphql']) && profileData['graphql'].hasOwnProperty('user')) {
            BrandList[eachBrand] = ParseData(BrandList[eachBrand], eachBrand, profileData);
        }
        UpdateBrandJson(BrandList);
    }
    await browser.close();
    UpdateData.update_date(req, res);
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
const ParseData = (brand, brandName, profileData) => {
    CrawlingData = GetCrawlingFeedJson()
    console.log('parsing data');
    dataFeedNum = brand['FeedNum']
    console.log(profileData['graphql']['user']['username'])
    var OriginalFollowerNum = profileData['graphql']['user']['edge_followed_by']['count'];
    brand['FollowerNum'] = OriginalFollowerNum;
    var OriginalPostNum = profileData['graphql']['user']['edge_owner_to_timeline_media']['count'];
    var NewFeedNum = OriginalPostNum - dataFeedNum;
    if (NewFeedNum > 12) {
        NewFeedNum = 12;
    }
    if (brand['ReviewStatus'] == 'N') {
        brand['NewFeedNum'] += NewFeedNum;
    } else {
        brand['NewFeedNum'] = NewFeedNum;
        brand['ReviewStatus'] = 'N'
    }
    brand['FeedNum'] = OriginalPostNum;
    for (var i = 0; i < NewFeedNum; i++) {
        console.log('i는 ' + i);
        var EachPostId = profileData['graphql']['user']['edge_owner_to_timeline_media']['edges'][i]['node']['shortcode'];
        var PostTimeStamp = profileData['graphql']['user']['edge_owner_to_timeline_media']['edges'][i]['node']['taken_at_timestamp'];
        var ContentsNum = 1;
        if (profileData['graphql']['user'].hasOwnProperty('edge_sidecar_to_children')) {
            ContentsNum = profileData['graphql']['user']['edge_sidecar_to_children']['edges'].length
        }
        var ContentsDict = {};
        for (var j = 0; j < ContentsNum; j++) {
            var tmp_key = 'Contents_' + j;
            ContentsDict[tmp_key] = 0
        }
        var FeedData = {};
        FeedData['Date'] = DateConversion(new Date(PostTimeStamp * 1000));
        FeedData['ContentsNum'] = ContentsNum;
        FeedData['Contents'] = ContentsDict;
        FeedData['brand'] = brandName;
        FeedData['CrawlingDate'] = DateConversion(new Date());
        FeedData['DownloadNum'] = 0;
        CrawlingData[EachPostId] = FeedData;
    }
    UpdateCrawlingFeedJson(CrawlingData);
    return brand;
}
const Scroll = async (brand, page) => {
    console.log('Scroll')
    instaId = brand['instaID']
    url = baseUrl + instaId + '?__a=1';
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
var crawling = {
    runcrawling: function (req, res) {
        init(req, res);
    }
};
module.exports = crawling;