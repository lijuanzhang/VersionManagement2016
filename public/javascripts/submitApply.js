var fields = ['#inputTaskName', '#inputTaskDesc', '#project', '#inputTaskNewList', '#inputTaskModList', '#delTaskList'];
var storageNames = ['inputTaskName', 'inputTaskDesc', 'project', 'inputTaskNewList', 'inputTaskModList', 'delTaskList'];
var dynFileds = ['#inputTaskDesc', '#inputTaskNewList', '#inputTaskModList', '#delTaskList'];
var dynDivs = ['#divTaskDesc', '#divTaskNewList', '#divTaskModList', '#divDelTaskList'];
var storageFlag = true;
/**
 *保存申请变更单失败时，或未提交时，已提交的变更单信息
 * @param filed 需要保存的值
 */
function storageTask(field) {
    if (window.sessionStorage) {
        for (var i in field) {
            if ($(fields[i]).val()) {
                sessionStorage.setItem(field[i], $(fields[i]).val());
            }
        }
    }
}
/**
 *填写变更单时，恢复之前未提交的变更单信息
 * @param field 需要保存的值
 */
function recoverTask(field) {
    if (window.sessionStorage) {
        for (var i in field) {
            if (sessionStorage.length > 0) {
                if (sessionStorage.getItem(field[i])) {
                    $(fields[i]).val(sessionStorage.getItem(field[i]));
                }
            }
        }
        $("#taskProject").val($("#project").find("option:selected").val());
        $("#taskProjectUri").text($("#project").find("option:selected").attr("projectUri"));
    }
}
/**
 *变跟单提交成功时，删除已保存的信息
 */
function deleteStrorage(field) {
    debugger
    if (window.sessionStorage) {
        //    for(var i in field)
        //        if(sessionStorage.field[i]) {
        //            sessionStorage.removeItem(field[i])
        //        }
        sessionStorage.clear();
    }

}
function animationExt(area) {
    var row = $(area).attr("rows");
    if (row < 15) {
        if (area == '#inputTaskModList') {
            $(area).animate({
                rows: 15
            }, 200, 'swing');
        }
        else {
            $(area).animate({
                rows: 12
            }, 200, 'swing');
        }
    }
}
function animationShr(area) {
    if ($(area).attr("rows") > 6) {
        if (area == '#inputTaskModList') {
            $(area).animate({
                rows: 6
            }, 200, 'swing');
        }
        else {
            $(area).animate({
                rows: 3
            }, 200, 'swing');
        }
    }
}
function dynInputFocus(inputName) {
    $(inputName).focus(function () {

        setTimeout(function () {
            animationExt(inputName);
        }, 300);
    });

}
function dynInputBlur(inputName) {
    $(inputName).blur(function () {
        setTimeout(function () {
            animationShr(inputName)
        }, 200);
    });
}

function disableInput() {
    $("#project").attr("disabled", "disabled");
    $("#inputTaskDesc").attr("disabled", "disabled");
    $("#inputTaskNewList").attr("disabled", "disabled");
    $("#inputTaskModList").attr("disabled", "disabled");
    $("#inputTaskName").attr("disabled", "disabled");
    $("#delTaskList").attr("disabled", "disabled");
    $("[name=taskType]").attr("disabled", "disabled");
    $("#requirement").attr("disabled", "disabled");
    $("#requirement").bsSuggest("disable");
}

function checkSubmit(fields) {
    var flag = true;
    //变更单类型校验
    if ($("input[name=taskType]:checked").val() == undefined) {
        $('#alertInfo').text("请选择【是否是需求】");
        $('#divAlert').show();
        return false;
    }
    $.each(fields, function (i, n) {
        if (i < 3) {
            if ($(fields[i]).val() == '') {
                flag = false;
                debugger
                var selector = "label[for=" + fields[i].replace('#', '') + "]";
                var text = $(selector).text();
                $('#alertInfo').text("【" + text + "】不能为空");
                $('#divAlert').show();
                return flag;
            }
        }
        //只有配置文件
        //if (($(fields[3]).val() == '')&& ($(fields[4]).val() == '')&&$(fields[5]).val() == ''){//修改清单和新增清单不能同时为空
        //    flag = false;
        //    $('#alertInfo').text("文件清单不能同时为空");
        //    $('#divAlert').show();
        //    return flag;
        //}
    });

    return flag;
}

function checkName(taskName) {
    taskName = taskName.trim();
    if (taskName === null || (taskName === "")) {
        return false;
    }
    taskName = taskName.match(/[\S]+/g).toString();
    taskName = taskName.replace("-修正", "");
    //taskName = taskName.match(/^([\u4e00-\u9fa5]|[0-9A-Za-z.])+[-][A-Z]+[-][0-9]+[-]([\u4e00-\u9fa5]|[0-9A-Za-z.])+[-|_][0-9A-Za-z]+[-|_][0-9]+$/g);
    taskName = taskName.match(/^([\u4e00-\u9fa5]|[0-9A-Za-z.])+[-][A-Z]+[-][0-9]+[-]([\u4e00-\u9fa5]|[0-9A-Za-z.])+[-|_][0-9A-Za-z]+[-|_][0-9]+$/g);
    if (taskName === null) {
        return false;
    }
    else {
        return true;
    }
}
function ajaxSubmit(params, url, subType) {
    url = '/' + url;
    $.ajax({
        data: params,
        url: url,
        dataType: 'jsonp',
        cache: false,
        timeout: 5000,
        type: subType,
        success: function (data) {
            var dataJson = $.parseJSON(data);
            var flag = dataJson.sucFlag;
            var id = dataJson.id;
            var tCode = dataJson.code;
            if ('err' == flag) {
                showTipInfo('err', dataJson.message);
            } else if ('success' == flag) {
                disableInput();
                storageFlag = false;
                $('#btnExtractFile').show();
                $('#oldAtta').show();
                $('#btnModify').show();
                $('#btnSADelete').show();
                $('#submitApply').hide();
                $('#taskId').val(id);
                $('#taskCode').text(tCode);
                //$('#divModelDialog').modal('hide');
                $('#divAlert').hide();
                showTipInfo('success', dataJson.message);
            }
            else {
                showTipInfo('err', "未知错误");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('error ' + textStatus + " " + errorThrown);
        }
    });
}
//需求列显示
function reqListShow() {
    //if($("input[name=taskType][value='1']").attr("checked") !="checked"){
    //    $("#requirement").bsSuggest(
    //    {
    //        indexId: 1, //data.value 的第几个数据，作为input输入框的内容
    //        indexKey: 1, //data.value 的第几个数据，作为input输入框的内容
    //        autoMinWidth: true, //是否自动最小宽度，设为 false 则最小宽度与下拉式菜单等齐
    //        data: {
    //            'value':JSON.parse(requirements),
    //            //'value':[{"reqId":11,"reqCode":"crm某某工程1_20151005_0002","reqName":"dds"},{"reqId":26,"reqCode":"crm某某工程1_20151012_0016","reqName":"sssds"},{"reqId":26,"reqCode":"crm某某工程1_20151012_0016","reqName":"sssds"},{"reqId":30,"reqCode":"crm某某工程1_20151013_0019","reqName":"dddsssssssswwwwwwwwwwwwwww"},{"reqId":30,"reqCode":"crm某某工程1_20151013_0019","reqName":"dddsssssssswwwwwwwwwwwwwww"}]
    //            //,
    //            'defaults':''
    //        }
    //    })
    //}
    //else{
    //    $("#reqDiv").show();
    //}
    $("input[name=taskType][value='1']").change(function () {
        $("#reqDiv").show();
    });
    $("input[name=taskType][value='0']").change(function () {
        $("#reqDiv").hide();
    });
}
function setBtnDisable(btnIds) {
    btnIds.forEach(function (btn) {
        var that = "#" + btn;
        $(that).click(function () {
            //console.log(that);
            setTimeout(function () {
                $(that).attr("disabled", true);
            }, 10);
            setTimeout(function () {
                $(that).attr("disabled", false);
            }, 200);
        })
    })
}
jQuery(document).ready(function () {
    //隐藏文件路径信息提示条
    //reqListShow();
    $('#diaInfoTip').hide();
    $('#btnExtractFile').hide();
    $('#btnModify').hide();
    $('#btnSADelete').hide();
    $('#btnConfirm').hide();
    $('#oldAtta').hide();
    //$('#divPop').hide();
    $('#divAlert').hide();
    setBtnDisable(["submitApply"]);
    //dynInputBlur();
    for (var i in dynFileds) {
        dynInputBlur(dynFileds[i])
    }
    for (var i in dynFileds) {
        dynInputFocus(dynFileds[i])
    }
    $('#submitApply').click(function () {
        var check = checkSubmit(fields);
        var nameFlag = checkName($("#inputTaskName").val());
        if (!nameFlag) {
            showTipInfo('err', '请按要求填写变更单名称:NCRM开发变更单-省份简拼-日期-任务或bug号-姓名简拼(-修正)-序号！');
            return;
        }
        var newFiles = $("#inputTaskNewList").val();
        var modFiles = $("#inputTaskModList").val();
        var delFiles = $("#delTaskList").val();
        var checkFile;
        checkFile = isFile(newFiles) && isFile(delFiles) && isFile(modFiles);
        if (!checkFile) {
            showTipInfo('err', '请检查文件路径是否正确！');
            return true;
        }
        if (check) {
            var params = {
                taskName: $("#inputTaskName").val(),
                // tasker : $(#inputTasker).val();
                taskType: $("input[name=taskType]:checked").val(),//提交申请
                taskState: "申请通过",//提交申请
                taskProject: $("#project").val(),
                taskDetails: $("#inputTaskDesc").val(),
                taskNewFiles: $("#inputTaskNewList").val(),
                taskModFiles: $("#inputTaskModList").val(),
                taskDelFiles: $("#delTaskList").val(),
                reqCode: $("#requirement").val()
            };
            url = 'task/addTask';
            ajaxSubmit(params, url, 'post');
            //showTipInfo('success', '任务已申请，且文件提取成功！');
        }
        else {
            showTipInfo('err', '请填写必填项！');
        }
    });
    $("#project").change(function () {
        $("#taskProjectUri").text($("#project").find("option:selected").attr("projectUri"));
        $("#taskProject").val($("#project").find("option:selected").val());

    });
    $('#closeModel').click(function () {
        location.reload();
    });

    $('#divModelDialog').on('hide.bs.modal', function (e) {
        if (storageFlag) {
            storageTask(storageNames);
        }
        else {
            deleteStrorage(storageNames);
        }
    });
    $('#divModelDialog').on('shown.bs.modal', function (e) {
        recoverTask(storageNames);
    });
})
