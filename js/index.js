// 外层闪烁
setInterval(() => {
    $('.wheel-light li:nth-child(2n) i').css('background','#fff7e8')
    $('.wheel-light li:nth-child(2n+1) i').css('background','#e37815')
}, 500);
setInterval(() => {
    $('.wheel-light li:nth-child(2n) i').css('background','#e37815')
    $('.wheel-light li:nth-child(2n+1) i').css('background','#fff7e8')
}, 1000);

//是否在旋转 ;
let isStatr = false; 
const brn = document.getElementById("button");
const wheel = document.getElementById("wheel");
const twinkle = document.getElementById("twinkle");
let prize_info = {};
// onload和onready的使用时机,JS中什么时候项服务器请求数据合适？什么时候更改页面信息合适？
$(document).ready(function () {
    // 从后台获取奖品信息
    axios.post('https://qc1hz1.fn.thelarkcloud.com/prizeinfo')
        .then(function (res) {
            prize_info = res.data.response;
            console.log("奖品信息：",prize_info);
            prize_info.forEach((item,index)=>{
                // 是奖品则显示奖品名字
                if(item.isprize){
                    $(`#data${index+1}`).text(item.prize_name);
                }
            })
        });
    //绑定点击事件
    brn.onclick = function () {
        if (!isStatr) {
            isStatr = true;
            // 后台返回数据：中奖消息和奖品index
            axios.post('https://qc1hz1.fn.thelarkcloud.com/takePrize')
                .then(function (res) {
                    $(".prize-info").text(res.data.msg);
                    operation(res.data.prize_index);
                });
        } else {
            return;
            // return false
        }
    }
    //关闭遮罩层、弹出的中奖弹窗
    $(".close").click(function () {
        $(".mask").hide();
        $(".show-prize").hide();
    });
});

// 旋转到指定位置
function operation(index) {
    $("#wheel").stopRotate();
    $("#wheel").rotate({
        angle:0,
        animateTo:-index*60+3600,
        duration:5000,
        // 回调方法
        callback:function (){ 
            // 闪烁动画
            twinkle.style.animation = "twinkle 0.8s";
            setTimeout(() => {
                //遮罩层+弹出中奖窗口
                $(".mask").show();
                $(".show-prize").show();
                isStatr = false;
                //删除闪烁动画,以便下次闪烁
                twinkle.style.animation = "none";
            }, 1200);
            isStatr = false;
        }
    });
    
}