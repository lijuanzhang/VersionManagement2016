/**
 * Created by lijuanZhang on 2015/8/26.
 */
var Root = require("./Root");
var DBRec = require("../sqlStatement/DBRec")
var User = function (user) {
    Root.call(this, user);
    DBRec.call(this, "User");
}

