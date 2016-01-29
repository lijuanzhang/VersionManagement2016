/**
 * Created by lijuanZhang on 2015/8/31.
 */

var CookiesUtil = require("../util/cookiesUtil");
var Util = require("../util/util");
var PermissionDao = require("../modular/permissionDao");
var permissionAdmin = {
    getPermissions: function (req, res, callback) {
        var user = CookiesUtil.getCookieUser(req, res);
        var userId = user.userId;
        PermissionDao.getPermissions(userId, function (msg, result) {

        });
    },
    hasPermissionByName: function (req, res, permissionName) {
        var user = req.cookies.user.permission;
    },
    //根据用户信息的查询时候有某项权限
    hasPermissionById: function (req, res, permissionId) {
        var permission = req.cookies.user.permission;
        var permissionArr = permission.split(",");
        permissionId = String(permissionId);
        if (permissionArr.indexOf(permissionId) > -1) {
            return true;
        }
        else {
            return false;
        }
    },
    addPermission: function (req, res, permissionId, callback) {
        if (this.hasPermissionById(req, res, permissionId)) {
            return true;
        }
        else {
            var permission = req.cookies.user.permission;
            if (permission != "") {
                permission += "," + permissionId;
            }
            else {
                permission = permissionId;
            }
            req.cookies.user.permission = permission;
            req.session.user.permission = permission
            var user = req.cookie.user;
            UserDao.updateUser([{permission: permission}, {userId: user.userId}], callback);
        }
    },
    //根据权限获取菜单
    getMenus: function (params, callback) {
        var userId = params.userId;
        PermissionDao.getMenus({userId: userId}, callback);
    },
    getButtons: function (params, callback) {
        PermissionDao.getButtons(params, function (msg, buttons) {
            if (msg == "success") {
                var buttonObj = Util.getDaoResultToObject(buttons, "btnName");
                callback("success", buttonObj);
            }
            else {
                callback("err");
            }
        });
    }
}

module.exports = permissionAdmin;

