/**
 * Created by lijuanZhang on 2015/9/23.
 */
var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var fs = require('fs'); //移动文件需要的包
var TaskAtta = require('../modular/taskAtta');
var UPLOAD_FOLDER = './attachment';
var ReqAtta = require("../modular/reqAttaDao");
var process = require('process');
var OLDDIR = process.cwd() + "/temp/newAndOld/";
var SVNOLDDIR = process.cwd() + "/old/";
var CMPOld = "/old2/";
var url = require('url');


/**
 * 文件上传成功失败信息返回
 * @param res
 * @param isSuccess
 * @param msg
 */
function fileUpReturnInfo(res, isSuccess, msg, reportAttaName, reportAttaUri, uploadFiles) {
    res.writeHead(200, {"Content-Type": "text/html"});
    res.write('<div><input type="hidden" id="fileUpIsSuccess" value="' + isSuccess + '"/></div>');
    res.write('<div><input type="hidden" id="fileUpReturnInfo" value="' + msg + '"/></div>');
    res.write('<div><input type="hidden" id="reportAttaName" value="' + reportAttaName + '"/></div>');
    res.write('<div><input type="hidden" id="reportAttaUri" value="' + reportAttaUri + '"/></div>');
    //res.write('<div><input type="hidden" id="uploadFiles" value ="'+uploadFiles+'"  allFiles="'+uploadFiles+'"/></div>');
    if (uploadFiles != undefined) {
        res.write('<div><input type="hidden" id="uploadFiles" value =' + uploadFiles + '  allFiles=' + uploadFiles + ' ></div>');
    }
    res.end("<p>这是个文件上传的回传信息</p>");
}


/**
 * 保存附件信息到数据库
 * @param req
 * @param taskId
 * @param processStepId
 * @param fileName
 * @param fileUri
 * @param callback
 */
function saveReqAtta(req, params, callback) {
    ReqAtta.saveAtta(params, function (msg, insertId) {
        if ('success' != msg) {
            req.session.error = "保存附件信息时发生错误,请记录并联系管理员";
            return callback("err");
        }
        callback("success", insertId);
    });
}
//将任意类型转换成字符串
var objectToString = function (obj) {
    switch (typeof(obj)) {
        case 'object':
            var ret = [];
            if (obj instanceof Array) {
                for (var i = 0, len = obj.length; i < len; i++) {
                    ret.push(objectToString(obj[i]));
                }
                return '[' + ret.join(',') + ']';
            }
            else if (obj instanceof RegExp) {
                return obj.toString();
            }
            else {
                for (var a in obj) {
                    ret.push("\"" + a + "\"" + ':' + objectToString(obj[a]));
                }
                return '{' + ret.join(',') + '}';
            }
        case 'function':
            return 'function() {}';
        case 'number':
            return obj.toString();
        case 'string':
            return "\"" + obj.replace(/(\\|\")/g, "\\$1").replace(/\n|\r|\t/g, function (a) {
                    return ("\n" == a) ? "\\n" : ("\r" == a) ? "\\r" : ("\t" == a) ? "\\t" : "";
                }) + "\"";
        case 'boolean':
            return obj.toString();
        default:
            return obj.toString();
    }
}
var uploadFile = function (req, res, form, fileds, files, i, uploadFilesInfo) {
    var extName = '';  //后缀名
    var reportName = files[i].name;
    var reportUri = files[i].path;
    switch (files[i].type) {
        case 'application/x-zip-compressed':
            extName = 'zip';
            break;
        case 'application/octet-stream':
            extName = 'rar';
            break;
        case 'application/vnd.ms-excel':
            extName = 'xls';
            break;
        case 'application/msword':
            extName = 'doc';
            break;
        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
            extName = 'xlsx';
            break;
    }

    if (extName == '') {
        fileUpReturnInfo(res, "false", "不支持上传该格式文件", '', '');
        return;
    }
    //拼凑文件名
    var newDate = new Date();
    var year = newDate.getFullYear().toString();
    var month = (newDate.getMonth() + 1).toString();
    if (month < 10) {
        month = '0' + month;
    }
    var day = newDate.getDate().toString();
    var nowDate = year + month + day;
    var avatarName = nowDate + Math.random().toString().substr(3, 5) + '.' + extName;
    //console.log("files:",files);
    var newPath = form.uploadDir + avatarName;
    reportUri = newPath;
    //  console.log(newPath);
    fs.renameSync(files[i].path, newPath);  //重命名
    var params = {
        reqId: fileds.reqId,
        processStepId: fileds.processStepId,
        fileName: reportName,
        fileUri: reportUri,
        reqProcessStepId: fileds.reqProcessStepId
    };
    saveReqAtta(req, params, function (msg, insertId) {
        if (msg == 'success') {
            var newArr = {attachmentId: insertId, fileName: params.fileName, fileUri: params.fileUri}
            uploadFilesInfo.push(newArr);
            i++;
            if (i == files.length) {
                var uploadFilesInfoString = objectToString(uploadFilesInfo);
                console.log("uploadFilesInfo:", uploadFilesInfoString);
                fileUpReturnInfo(res, "true", "文件上传成功", "", "", uploadFilesInfoString);
            }
            //递归上传文件
            else {
                uploadFile(req, res, form, fileds, files, i, uploadFilesInfo);
            }
        } else {
            var fileUri = "sss";
            fileUpReturnInfo(res, "false", "文件记录数据库时出错", '', '');
        }
    });
}

var FileUp = {}
/**
 * 文件上传的处理逻辑
 * @param req
 * @param res
 * @param secFolder 二级目录路径
 */
FileUp.fileUp = function (req, res, secFolder) {
    var form = new formidable.IncomingForm({multiples: true});   //创建上传表单
    form.encoding = 'utf-8';		//设置编辑
    form.uploadDir = UPLOAD_FOLDER + secFolder;	 //设置上传目录
    form.keepExtensions = true;	 //保留后缀
    form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小
    form.parse(req, function (err, fields, files) {
        //获取页面上隐藏域中的值和文件的名称和路径
        //console.log("fileUp,fields:",fields);
        //console.log("files:",files);
        var taskId = fields.reqId;
        var processStepId = fields.processStepId;
        if (err) {
            fileUpReturnInfo(res, "false", err, '', '');
            return;
        }

        var uploadFilesInfo = [];
        var filesArr = [];
        if (!(files.fulAvatar instanceof  Array)) {
            filesArr.push(files.fulAvatar);
            files = filesArr;
        }
        else {
            filesArr = files.fulAvatar;
        }
//        var fileNum = files.length+1;
        uploadFile(req, res, form, fields, filesArr, 0, uploadFilesInfo);
    });
}

module.exports = FileUp;
