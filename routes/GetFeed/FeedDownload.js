const {PythonShell} = require('python-shell');

let options ={
    pythonPath: '/usr/local/bin/python3'
}

var downloadcrawling = {
    runcrawling : function (req,res){
        PythonShell.run('routes/GetFeed/insta_crawling/TextDownloader.py', null, function (err, results) {
            if (err) throw err;
            console.log('finished');
            console.log('results: %j', results);
            res.redirect('/')
        });
    }
};
module.exports = downloadcrawling;