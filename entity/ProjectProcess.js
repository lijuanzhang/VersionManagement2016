/**
 * Created by lijuanZhang on 2015/8/28.
 */

var Root = require("./Root");
var DBRec = require("../sqlStatement/DBRec")
var ProjectProcess = function (ProjectProcess) {
    Root.call(this);
    DBRec.call(this, "ProjectProcess");
}