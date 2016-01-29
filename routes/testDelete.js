/**
 * Created by Administrator on 2015/12/23.
 */

var test = {}
test.b = function () {
    console.log("I am in testDelete!");
}
var admintest = require("./admintest");
//admintest.a()

var aaa;
if (aaa == 'undefined') {
    console.log("aaa is undefined")
}
module.exports = test;