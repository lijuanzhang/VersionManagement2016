var pool = require('../util/connPool.js').getPool();

//var queues = require('mysql-queues');
////const DEBUG = true;
//var async = require('async');

/**
 * 查找当前fileList中有哪些文件正在被其他变更单所占用
 * @param taskId
 * @param callback
 */
var testFileUsed = function (fileList, projectId, taskId, callback) {
    var users = [];

    pool.getConnection(function (err, connection) {
        if (err) {
            console.log('[CONN FILELIST ERROR] - ', err.message);
            return callback("err");
        }
        var flag = false;
        var sql = 'select t.taskName, u.userId, u.realName, fl.fileUri from filelist fl' +
            '   join tasks t on fl.taskId = t.taskId  ' +
            '  JOIN taskprocessstep tps on t.taskid = tps.taskid and tps.processStepId = t.processStepId and tps.turnNum =(' +
            '   SELECT max(turnNum) from taskprocessstep where taskId = t.taskId)' +
            '   join user u on tps.dealer=u.userId' +
            '    and fl.commit=0 and  fl.fileUri in (select fileUri from fileList where taskId=?)';
        var params = [taskId];
        connection.query(sql, params, function (err, result) {
            if (err) {
                console.log('[QUERY FILELIST ERROR] - ', err.message);
                return callback(err, null);
            }
            //console.log("'user:", result);
            if (result.length > 0) {
                users = result;
            }
            //console.log("testFiled release!");
            connection.release();
            return callback('success', users);
        });
    });


}
//connection.release();
module.exports = testFileUsed;