const {PythonShell} = require('python-shell');
var UpdateData = require('./UpdateData');

// var options = {

//     pythonPath: '/Users/carly/opt/anaconda3/bin/python',
//     ScriptPath: 'routes/GetFeed/insta_crawling'

// };

var crawling = {
    runcrawling : function (req,res){
        PythonShell.run('routes/GetFeed/insta_crawling/EmbedDownloader.py', null, function (err, results) {
            if (err) throw err;
            console.log('finished');
            console.log('results: %j', results);
            UpdateData.update_date(req,res);
        });
    }
};
module.exports = crawling;