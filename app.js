var express = require('express');
var bodyParser = require('body-parser');
var indexRouter = require('./routes/index');
var BrandExcelRouter = require('./routes/BrandExcel/brand');
var StyleExcelRouter = require('./routes/StyleExcel/style');
var GetFeedRouter = require('./routes/GetFeed/feed');

var app = express();

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/', indexRouter);
app.use('/brandexcel', BrandExcelRouter);
app.use('/styleexcel', StyleExcelRouter);
app.use('/getfeed', GetFeedRouter);

app.set('views', __dirname + '/views');
app.set('view engine','ejs');

app.engine('html', require('ejs').renderFile);

// app.get('/', function (req, res) {
//   res.send('Hello World!');
// });
// app.get('/login', function (req, res) {
//   res.send('Hello World!');
// });
app.listen(3000,function(){
  console.log('Connected 3000 port!')
});