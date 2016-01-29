/**
 * Created by lijuanZhang on 2015/12/25.
 */
var PagesSql = require("./sqlStatement/pagesSql");
//var log =  require("../util/log");
var pages = {}
pages.getPages = function (params, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            console.log('[CONN PAGES ERROR] - ', err.message);
            return callback(err);
        }
        var sql = PagesSql.getPages;
        var params = [params.pageName];
        connection.query(sql, params, function (err, result) {
            if (err) {
                console.log('[QUERY pages ERROR] - ', err.message);
                return callback(err, null);
            }
            connection.release();
            callback('success', result);
        });
    });
}

//console.log((new Date()).getTime())
var testObj = {txAttachedOfferQryBox: "inist"};
var autoSaveValues = {
    $txAttachedOfferQryBoxValue: "init",
    //获取前一个输入值
    saveValueOfTag: function (tagId) {
        var tag = "$" + tagId + "Value";
        var tagValue = testObj[tagId];
        //this[tag] = tagValue;
        autoSaveValues[tag]
    },
    getPreValueOfTag: function (tagId) {
        var tagValueName = "$" + tagId + "Value";

        if (this[tagValueName]) {
            return this[tagValueName];
        }
        else {
            return "";
        }
    }
};

autoSaveValues.saveValueOfTag("txAttachedOfferQryBox");
console.log(autoSaveValues)
console.log("getValue:", autoSaveValues.getPreValueOfTag("txAttachedOfferQryBox"), ":", autoSaveValues.$txAttachedOfferQryBoxValue)
