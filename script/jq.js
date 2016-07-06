$(document).ready(function() {
    // 导航上的鼠标移入或者点击就出现下面的小框框
    //个人消息
    $("#message").click(function() {
        $(".msg-box").css("display", "block");
    }).blur(function() {
        $(".msg-box").css("display", "none");
    });
    //个人账户,本来想封装这一堆，但是函数没有写正确。。
    $("#client").mouseover(function() {
            $(".client").css("display", "block");
        }).mouseout(function() {
            $(".client").css("display", "none");
        })
        //设置
    $("#sett").mouseover(function() {
            $(".sett").css("display", "block");
        }).mouseout(function() {
            $(".sett").css("display", "none");
        })
        //更多产品，加了稀释，但是会闪，不加好像会好一点。
        // var timeOutId;
        // $(".special").mouseover(function() {
        //     timeOutId = setTimeout(function() {
        //         $(".sec").css("display", "block");
        //     }, 200)
        // }).mouseout(function() {
        //     clearTimeout(timeOutId);
        //     $(".sec").css("display", "none");
        // })

    $(".special").mouseover(function() {
        $(".sec").css("display", "block");
    }).mouseout(function() {
        $(".sec").css("display", "none");
    });
    // 换肤的js
    $("#themeChange").click(function() {
        $("#theme").slideDown(500);
    });
    $("#uptohide").click(function() {
        $("#theme").slideUp(500);
    });
    $(".container").click(function(event) {
            $("#theme").slideUp(500);
        }).on('click', '.header', function(event) {
            event.stopPropagation();
        })
        // 想实现点击出了＃theme之外的其他所有地方都可以实现slideup（）；用.not()也不行，用:not()也不行。
        //后来把要弹出的div放到了最外层，然后阻止的事header的冒泡。就可以了。
    $(".theme_title ul>li").each(function(index) {
        $(this).click(function() {
            $("li.theme_title_active").removeClass("theme_title_active");
            $(this).addClass("theme_title_active");
            $(".theme_content .theme_active").removeClass("theme_active");
            $(".theme_content>ul").eq(index).addClass("theme_active")
        })
    })
    $(".theme_style>li").click(function() {
            var theme = $(this).css("background-color");
            $(".container").css("background-color", theme);
        })
        // 此处是页面下部分的tab切换的内容,这句不起作用
        // $("#sub-content").load("a.html");

    $(".first-sub-menu li").each(function(index) {
        $(this).click(function() {
            $("li.submenu_active").removeClass("submenu_active");
            $(this).addClass("submenu_active");
            $("#sub_wrap .sub_content_active").removeClass("sub_content_active");
            // 本来用的#sub_wrap div作为选择器，结果效果没出来，就加了个子代选择器然后就好了！！！
            $("#sub_wrap>div").eq(index).addClass("sub_content_active");
        });
    });

    // 我的收藏的js样式
    $(".title_content_left").click(function() {
        if ($(".title_content_left .left_arrow em").hasClass("unfold")) {
            $(".title_content_left .left_arrow em").removeClass("unfold").addClass("fold");
            $(".block_content").slideUp(200);
        } else {
            $(".title_content_left .left_arrow em").removeClass("fold").addClass("unfold");
            $(".block_content").slideDown(200);
        }
    })
    $(".myblock").mouseenter(function() {
        $(".title_content_right").css("display", "block");
    }).mouseleave(function() {
        $(".title_content_right").css("display", "none");
    })


});

//这个函数无效，尽管传进去的是带引号的参数也没有用。
// function styleChange(id,class){
// 	alert(id+class);
// 	$(id).mouseover(function(){
// 		$(class).css("display","block");
// 	}).mouseout(function(){
// 		$(class).css("display","none");
// 	})
// }