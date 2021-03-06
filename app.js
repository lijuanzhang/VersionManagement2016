var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var task = require('./routes/task');
var taskDialog = require('./routes/taskDialog');
var leaderModel = require('./routes/leaderModel');
var superModel = require('./routes/superModel');
var adminModel = require('./routes/adminModel');
var app = express();
var session = require('express-session');
var partials = require('express-partials');
//var multiparty=require('connect-multiparty');
var file = require('./routes/file');
var taskTest = require('./routes/taskTest');
var excel = require("./routes/excel");
var svn = require("./routes/svn");
var requirement = require("./routes/requirement");
var log = require("./util/log");
var scripts = require("./routes/index")


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(partials());

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));


//这里传入了一个密钥加session id
app.use(cookieParser());
app.use(cookieParser('wengsr'));


//使用靠就这个中间件
app.use(session({secret: 'wengsr'}));//开启session


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
// 返回成功和失败的信息
app.use(function (err, req, res, next) {
    //console.log("进入成功失败信息处理中间件");
    //声明变量
    var err = req.session.error;
    var msg = req.session.success;
    //删除会话中原有属性
    delete req.session.error;
    delete req.session.success;
    //将错误和正确信息存放到动态视图助手变量中。
    res.locals.message = '';
    if (err) res.locals.message = '<div id="errTip" class="alert alert-danger alert-dismissible" style="text-align: center" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><strong>' + err + '</strong></div>';
    if (msg) res.locals.message = '<div id="successTip" class="alert alert-success alert-dismissible" style="text-align: center" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><strong>' + msg + '</strong></div>';
    //console.log('err='+err);
    //console.log('msg='+msg);
    //console.log('outMsg=' + res.locals.message);
    next();
});
// 把user设置成动态视图助手
app.use(function (req, res, next) {
    //console.log("进入设置动态视图助手中间件");
    res.locals.user = req.session.user;
    res.locals.menus = req.session.menus;
    res.locals.tasks = req.session.tasks;
    res.locals.taskCount = req.session.taskCount;
    next();
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.use('/', routes);
app.use('/users', users);
app.use('/task', task);
app.use('/taskDialog', taskDialog);
app.use('/file', file);
app.use('/leaderModel', leaderModel);
app.use('/superModel', superModel);
app.use('/admin', adminModel);
app.use('/taskTest', taskTest);
app.use("/excel", excel);
app.use("/svn", svn);
app.use("/requirement", requirement);
app.use("/req", requirement);
app.use("/scripts", scripts);
app.use("/script", scripts);
//app.use(test);
module.exports = app;
