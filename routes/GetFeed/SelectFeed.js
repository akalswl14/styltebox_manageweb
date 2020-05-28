var fs = require('fs')

function date_ascending(a, b) {
    var dateA = new Date(a).getTime();
    var dateB = new Date(b).getTime();
    return dateA < dateB ? 1 : -1;
};

var selectfeed = {
    getembed: function (req, res) {
        QueryBrandList = req.query.brand;
        const DataBuffer = fs.readFileSync('public/json/CrawlingFeed.json');
        var JsonData = JSON.parse(DataBuffer.toString());
        KeyList = Object.keys(JsonData);
        var data = { feeddata: '' };
        var ejsdata = '';
        var DataList = [];
        var DateList = [];
        var EachEjs_forDate = []
        function renderData() {
            data.feeddata = ejsdata;
            res.render('GetFeed/ShowEmbedFeed.html', data);
        }
        function EndEjsData(callback) {
            for (i = 0; i < DateList.length; i++) {
                EachEjs_forDate[i] += '</div>'
                ejsdata += EachEjs_forDate[i]
            }
            callback();
        }
        function AddEjsData(callback) {
            for (i = 0; i < DataList.length; i++) {
                var feedid = DataList[i];
                var DownloadNum = JsonData[feedid].DownloadNum;
                var ContentsNum = JsonData[feedid].ContentsNum;
                var date = JsonData[feedid].Date;
                var idx = DateList.indexOf(date);
                var embedurl = ''
                if (feedid[feedid.length - 1] == '/') {
                    embedurl = feedid + 'embed'
                } else {
                    embedurl = feedid + '/embed'
                }
                tmp = '<div class="EachEmbed">'
                    + '<iframe src="https://www.instagram.com/p/'
                    + embedurl + '" frameborder="0" scrolling="no"allowtransparency="true"></iframe>'
                    + '<div class="SelectArea"><div class="DownloadNum">다운로드 : '
                    + DownloadNum + '</div>'
                    + '<div class="SelectImage">'
                    + '<div class="EachCheck">'
                    + '<label>All<input type="checkbox" name="chkall" value="1" class="chkbox" onclick="check_all_feed(this.parentNode.parentNode.parentNode,this)"></label></div>';
                for (j = 1; j <= ContentsNum; j++) {
                    tmp += '<div class="EachCheck"><label>'
                        + '#' + j
                        + '<input type="checkbox" name="' + feedid + '" value="' + j + '" class="chkbox"></label></div>'
                }
                tmp += '</div></div></div>'
                EachEjs_forDate[idx] += tmp
            }
            callback();
        }
        function MakeEachDateBase(callback) {
            for (i = 0; i < DateList.length; i++) {
                tmp_ejs = '<h3>' + DateList[i] + '</h3> <div class="row">';
                EachEjs_forDate.push(tmp_ejs);
            }
            callback();
        }
        function GetDateList(callback) {
            for (var key in JsonData) {
                var date = JsonData[key].Date;
                if (QueryBrandList.includes(JsonData[key].brand) == false) {
                    continue;
                }
                if (QueryBrandList.length > 1 && JsonData[key].DownloadNum > 0) {
                    continue;
                }
                DataList.push(key);
                if (DateList.includes(date) == false) {
                    DateList.push(date)
                }
                console.log(DateList);
            }
            DateList.sort(date_ascending);
            callback();
        }
        GetDateList(function () {
            MakeEachDateBase(function () {
                AddEjsData(function () {
                    EndEjsData(function () {
                        renderData();
                    });
                });
            });
        });
    }
};
module.exports = selectfeed;