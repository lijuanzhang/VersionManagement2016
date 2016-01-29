/**
 * Created by lijuanZhang on 2015/8/26.
 */
var Root = require("./Root");
var DBRec = require("../sqlStatement/DBRec");
var ProjectDao = require("../modular/ProjectDao");


var Project = function () {
    DBRec.call(this, "project");
}
Project.init = function (project) {
    Root.call(this, project);
}

