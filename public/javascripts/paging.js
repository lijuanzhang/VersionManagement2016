jQuery(document).ready(function () {
    var curPage = $('ul#pageUl').attr("curPage");
    $('li.pageId[value=' + curPage + ']').addClass('active');

});

