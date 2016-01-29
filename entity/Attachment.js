/**
 * Created by lijuanzhang on 2015/8/27.
 */

var Root = require("./Root");
var DBRec = require("../sqlStatement/DBRec")
var AttaSql = require("../sqlStatement/AttaSql");
var AttaDao = require("../modular/AttaDao");
var Attachment = function (Attachment) {
    Root.call(this);
    DBRec.call(this, "Attachment");
}

