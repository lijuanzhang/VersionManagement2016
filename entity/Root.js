/**
 * Created by lijuanZhang on 2015/8/26.
 */
function Root(root) {
    for (var p in root) {
        this[p] = root[p];
    }
    this.getProperty = function (pro) {
        return this[pro];
    }
    this.setProperty = function (pro, val) {
        return this[pro] = val;
    }
}


module.exports = Root;