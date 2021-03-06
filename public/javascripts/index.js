/**
 * Created by wengs_000 on 2014/11/6 0006.
 */

/**
 * 隐藏提示条
 */
function hideTip() {
    $('#diaErrTip').hide();
    $('#diaSuccessTip').hide();
}

/**
 * 按钮的打开模态窗口方法
 * @param btnName
 * @param url
 * @param formName
 */
function showModelDialog(btnName, url, formName) {
    var findBtn = '#' + btnName;
    var findFormName = '#' + formName;
    //$(findBtn).click(function(){
    $('[id=' + btnName + ']').click(function () {
        $('#divModel').load(url, function () {
            hideTip();
            $('#btnSubmit').click(function () {
                $(findFormName).submit();
            });
        });
        $('#divModelDialog').modal();
    });
}

/**
 * 注册点击变更单后根据当前所处环节弹出的对话框
 */
function regTaskLink() {
    var stepName;
    var url;
    var btnForm;
    for (var i = 1; i < 7; i++) {
        switch (i) {
            //case 1 : url = '/taskDialog/submitApply'; stepName = 'btnSubmitApply'; break;
            case 1 :
                url = '/taskDialog/modifyTask';
                stepName = 'btnModifyTask';
                break;
            case 2 :
                url = '/taskDialog/extractFile';
                stepName = 'btnExtractFile';
                break;
            case 3 :
                url = '/taskDialog/submitFile';
                stepName = 'btnSubmitFile';
                break;
            case 4 :
                url = '/taskDialog/planCheck';
                stepName = 'btnPlanCheck';
                break;
            case 5 :
                url = '/taskDialog/check';
                stepName = 'btnCheck';
                break;
            case 6 :
                url = '/taskDialog/submit';
                stepName = 'btnSubmit';
                break;
        }
        var stepId = "[step=taskProcessStepId_" + i + "]";
        var stepId2 = "[step=2taskProcessStepId_" + i + "]";
        $(stepId).each(function () {
            $(this).attr('step', stepName);
            var taskTagId = $(this).attr('id');
            var taskId = $(this).attr('taskid');
            var taskCreater = $(this).attr('taskcreater');
            var dealerName = $(this).attr('dealerName');
            var createName = $(this).attr('createName');
            var realUrl = url + "/" + taskId + "/" + taskCreater + "/" + dealerName + "/" + createName;
            btnForm = stepName.replace('btn', 'form');
            showModelDialog(taskTagId, realUrl, btnForm);
        });
    }
}
/**
 * 查看已上库的变更单的文件清单
 */
function regTaskFileList() {
    var stepId = "[forFiles=ForFiles]";
    //var stepId2 = "[step=2taskProcessStepId_9]";
    var url = '/users/showFileList',
        stepName = 'btnSubmit';
    $(stepId).each(function () {
        $(this).attr('step', stepName);
        var taskTagId = $(this).attr('id');
        var taskId = $(this).attr('taskid');
        var taskCreater = $(this).attr('taskcreater');
        var dealerName = $(this).attr('dealerName');
        var createName = $(this).attr('createName');
        var realUrl = url + "/" + taskId + "/" + createName;
        btnForm = stepName.replace('btn', 'form');
        showModelDialog(taskTagId, realUrl, btnForm);
    });
}
/**
 * 测试环节
 */
function regTaskTestDialog() {
    var stepId = "[step=taskProcessStepId_8]";
    //var url = '/users/showFileList',
    var url = '/taskDialog/testing',
        stepName = 'testing';
    $(stepId).each(function () {
        $(this).attr('step', stepName);
        var taskTagId = $(this).attr('id');
        var taskId = $(this).attr('taskid');
        var taskCreater = $(this).attr('taskcreater');
        var dealerName = $(this).attr('dealerName');
        var createName = $(this).attr('createName');
        var realUrl = url + "/" + taskId + "/" + taskCreater + "/" + dealerName + "/" + createName;
        btnForm = stepName.replace('btn', 'form');
        showModelDialog(taskTagId, realUrl, btnForm);
    });
}
/**
 * 测试环节
 */
function regTaskComfirminDialog() {
    var stepId = "[step=taskProcessStepId_10]";
    //var url = '/users/showFileList',
    var url = '/taskDialog/comfirming',
        stepName = 'testing';
    $(stepId).each(function () {
        $(this).attr('step', stepName);
        var taskTagId = $(this).attr('id');
        var taskId = $(this).attr('taskid');
        var taskCreater = $(this).attr('taskcreater');
        var dealerName = $(this).attr('dealerName');
        var createName = $(this).attr('createName');
        var realUrl = url + "/" + taskId + "/" + taskCreater + "/" + dealerName + "/" + createName;
        btnForm = stepName.replace('btn', 'form');
        showModelDialog(taskTagId, realUrl, btnForm);
    });
}
/**
 * 上开发库环节
 */
function regTaskDevReposityDialog() {
    var stepId = "[step=taskProcessStepId_12]";
    var url = '/taskDialog/submitToDev',
        stepName = 'submitToDev';
    $(stepId).each(function () {
        $(this).attr('step', stepName);
        var taskTagId = $(this).attr('id');
        var taskId = $(this).attr('taskid');
        var taskCreater = $(this).attr('taskcreater');
        var dealerName = $(this).attr('dealerName');
        var createName = $(this).attr('createName');
        var realUrl = url + "/" + taskId + "/" + taskCreater + "/" + dealerName + "/" + createName;
        btnForm = stepName.replace('btn', 'form');
        showModelDialog(taskTagId, realUrl, btnForm);
    });
}

/**
 * 打开脚本状态查询
 */
function regScriptPageDialog() {
    var stepId = "[ scriptType=taskProcessStepId]";
    var url = '/btnTaskCreater/';
    $(stepId).each(function () {
        $(this).attr('step', stepName);
        var taskTagId = $(this).attr('id');
        var taskId = $(this).attr('taskid');
        var taskCreater = $(this).attr('taskcreater');
        var dealerName = $(this).attr('dealerName');
        var createName = $(this).attr('createName');
        var realUrl = url + "/" + taskId + "/" + taskCreater + "/" + dealerName + "/" + createName;
        btnForm = stepName.replace('btn', 'form');
        showModelDialog(taskTagId, realUrl, btnForm);
    });
}
/**
 * 记录当前被选中的taskid
 * @param taskId
 */
function setTaskId(taskId) {
    $('#selectedTaskId').val(taskId);
}
/**
 * 查看配置和脚本
 */
function regShowScriptDialog() {
    var stepId = "[script=script]";
    //var url = '/users/showFileList',
    var btnName = "btnScript";
    var url = '/script/scriptPage';
    $(stepId).each(function () {
        var taskTagId = $(this).attr('id');
        var scriptId = $(this).attr('scriptId');
        var realUrl = url + "/" + scriptId;
        btnForm = btnName.replace('btn', 'form');
        showModelDialog(taskTagId, realUrl, btnForm);
    });
}
/**
 * 变更单记录数为0时候的处理
 */
function dealZeroTask() {
    $('#noTaskNotice').hide();
    if ($('#recCount').attr('recCount') == 0) {
        $('#taskDiv').hide();
        $('#noTaskNotice').show();
    }
}


jQuery(document).ready(function () {
    //点击“申请变更单”打开模态窗口
    showModelDialog("btnSubmitApply", "/task/addTaskPage", 'formAddTask');
    showModelDialog("btnSubmitBug", "/task/addBugTaskPage", 'formAddTask');
    //点击“查找变更单”打开模态窗口
    showModelDialog("btnFindTasks", "/task/findTaskPage", 'formFindTasks');
    showModelDialog("btnExportLocalChangeAttaPage", "/admin/exportLocalChangeAttaPage", 'formExportXls');
    //点击“查找所有变更单”打开模态窗口
    showModelDialog("btnFindAllTasks", "/task/findAllTaskPage", 'formFindAllTasks');
    //测试主管“查找所有与测试相关的变更单”
    showModelDialog("btnFindAllTestTasks", "/taskTest/findAllTestTasksPage", 'formFindAllTestTasks');
    showModelDialog("btnFindTestTasks", "/taskTest/findTestTasksPage", 'formFindTestTasks');
    showModelDialog("btnFindAllTasksForBoss", "/task/findAllTasksForBossPage", 'formAllTasksForBoss');
    showModelDialog("btnExportTasks", "/excel/exportTasks", 'formExportXls');
    showModelDialog("btnExportCountTasks", "/excel/exportCountTasks", 'formCountXls');
    showModelDialog("btnAllScript", "/scripts/findScriptPage", 'formFindAllScript');
    regTaskLink();
    regTaskFileList();
    regTaskTestDialog();
    regTaskComfirminDialog();
    regTaskDevReposityDialog();//上开发库
    regShowScriptDialog();//查看配置或脚本变更单
    //隐藏页面上方提示条
    setTimeout(function () {
        $('#errTip').slideUp(1000);
        setTimeout(function () {
            $('#errTip').remove()
        }, 2000)
    }, 2000);
    setTimeout(function () {
        $('#successTip').slideUp(1000);
        setTimeout(function () {
            $('#successTip').remove()
        }, 2000)
    }, 1000);
    //首页流程效果
    $("#SubmitApply").popover({placement: 'left'});
    $("#SubmitFile").popover({placement: 'right'});
    $("#PlanCheck").popover({placement: 'right'});
    $("#Check").popover({placement: 'bottom'});
    $("#Submit").popover({placement: 'left'});
    //变更单记录为0时候的处理
    dealZeroTask();
    //查看变更单历史
    var btnHistory = $('[btnType=taskHistory]');
    btnHistory.click(function () {
        var clickTaskId = $(this).attr('taskId');//点击了哪个变更单的查看历史按钮
        var taskHistoryUrl = '/task/history/' + clickTaskId;
        $('#divModel').load(taskHistoryUrl, function () {
//            $('#btnSubmit').click(function () {
//                $(findFormName).submit();
//            });
        });
        $('#divModelDialog').modal();
    });


    $("[deleteName=deleteTask]").each(function () {
        $("this").bind("mousedown", (function (e) {
            alert($(e.target).attr("id"));
        }));
        var imageMenuData = [[
            {
                text: "放弃变更单",
                func: function () {
                    //alert($('#task_250'));
                    var id = $(this).attr("id");
                    $('#del' + id).modal();
                }
            }
        ]];
        $(this).smartMenu(imageMenuData, {name: 'myMenu'});
    });

    $("[attachment =attachment]").each(function () {
        //debugger
        var attachmentDom = $(this).attr("id");
        var attachmentId = $(this).attr("attachmentId");
        var realUrl = "/admin/commitChangeRarPage/" + attachmentId;
        showModelDialog(attachmentDom, realUrl, "formCommitRar");
    });
});

