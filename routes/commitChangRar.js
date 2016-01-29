/**
 * Created by Administrator on 2015/8/11.
 */
var Svn = require("../util/svnTool.js");
var fs = require("fs");
var path = require("path");
var svn = new Svn({username: 'zhanglj6', password: 'zhanglj72774'});
/**
 * 拷贝单文件
 * @param sourceDir
 * @param destDir
 * @param fileName
 */
var copyFile = function (sourceDir, destDir, fileName) {
    var sourceFile = path.join(sourceDir, fileName);
    var destPath = path.join(destDir, fileName);
    var readStream = fs.createReadStream(sourceFile);
    var writeStream = fs.createWriteStream(destPath);
    readStream.pipe(writeStream);
    console.log("复制完成");
}

var getLastPath = function (path) {
    if (path.lastIndexOf("/") > 0 && path.length > 1) {
        if (path.lastIndexOf("/") == path.length - 1) {
            path = path.substring(0, path.lastIndexOf("/"));
        }
        return {
            lastPath: path.substring(path.lastIndexOf("/") + 1, path.length),
            parentPath: path.substring(0, path.lastIndexOf("/") + 1)
        };
    }
    else {
        return {
            lastPath: path,
            parentPath: "/"
        };
    }

}
/**
 * 判断当前的路径是否存在，不存在创建svn跟本地同时创建
 * @param path 需要判断的路径
 * @param versionDir svn路径
 * @param svnMessage 创建svn的message
 * @param callback
 */
Svn.prototype.svnExists = function (path, versionDir, svnMessage, callback) {
    if (!fs.existsSync(path)) {
        var newPath = getLastPath(path);
        //var versionDir = "http://192.168.1.22:8000/svn/hxbss/testVersion/a/";
        console.log("parent:", newPath.parentPath, "lastPath:", newPath.lastPath);
        svn.mkdir(newPath.parentPath, newPath.lastPath, versionDir, svnMessage, function (msg, data) {
            if (msg == "success") {
                console.log("mkdir " + newPath.lastPath + "successful." + data);
                svn.checkout(path, versionDir + newPath.lastPath, [], function (err, data) {
                    if (!!err) {
                        console.log("取文件失败" + err);
                        return callback("err", data);
                    } else {
                        console.log("取文件成功" + data);
                        return callback("success");
                    }
                })
            }
            else {
                console.error("mkdir " + newPath.lastPath + "   err." + data);
                return callback("err", data);
            }
        });
    }
    else {
        callback("success");
    }
}

/**
 *
 * @param path
 * @param oldPath
 * @param fileName
 * @param newName
 * @param versionDir
 * @param svnMsg
 * @param callback
 */
Svn.prototype.commitChangeRar = function (path, oldPath, fileName, newName, versionDir, svnMsg, callback) {
    var localFile = path + fileName;
    svnExists(path, versionDir, svnMsg, function (e_msg, data) {
        if (e_msg == "success") {
            copyFile(oldPath, path, fileName);
            fs.renameSync(oldPath + fileName, path + newName);
            svn.commitRar(path, localFile, svnMsg, function (com_msg, data) {
                if (com_msg == "success") {
                    console.log("commit " + localFile + "successful." + data);
                    return callback("success");
                }
                else {
                    console.error("commit " + localFile + "  err." + data);
                    return callback("err");
                }
            });
        }
        else {
            return callback(e_msg, data);
        }
    });

}
