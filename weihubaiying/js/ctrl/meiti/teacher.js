//var id = getExtraDataByKey('id');
var id = GetQueryString('id');
function is_weixin() {
 	var ua = navigator.userAgent.toLowerCase();
	if (ua.match(/MicroMessenger/i) == "micromessenger") {//如果在微信浏览器端
		document.getElementById('back').style.display="none";
	} else {
		return false;
	}
}
is_weixin();



var mainVM = new Vue({
	el:"#mainVM",
	data:{
		activity:[],
		type:'',
		shareImg:'http://ou3hks27l.bkt.clouddn.com/image/005A8LxCgy1ficis0towej30c80lqq3v68a04569ecf94e37a54406ff9275a413.jpg'
	},
	watch:{
		
	},
	methods:{},
	created:function(){},
	mounted:function(){
		getMainInfo();
	}	
})

//获取数据
function getMainInfo(){
	getPostData("pm.resource.mingren", {
		'method' : "pm.resource.mingren",
		"aid":id,
	},function(data, isSuccess){
		console.log(data)
		if(isSuccess){
			if(data.code == '000'){
				mainVM.type=data.data.type;
				mainVM.activity = data.data.activity;
			}
		}
	});

	(function($){
		$(".mui-scroll-wrapper").scroll({
			deceleration: 0.0005,
			bounce: false,//滚动条是否有弹力默认是true
			indicators: false, //是否显示滚动条,默认是true
		});
	})(mui);
}


//点击进入详情页
mui('body').on('tap','li',function(){
	var teacherid = this.id;
	if(mainVM.type==0){
		createWin(null,'../meiti/mrtg.html',{mrListId:teacherid});
	}
	if(mainVM.type==1){
		createWin(null,'../meiti/teacherTG.html',{mrListId:teacherid});
	}
	
});
//appid:wx951b8f4a18a2d9d4   公众号的唯一标识  
//secret:af51ac8a46de189b7413920e797855ea   密钥
/*wx.config({
    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。  
    appId: 'wx951b8f4a18a2d9d4', // 必填，公众号的唯一标识  
    timestamp: '生成签名的时间戳 ', // 必填，生成签名的时间戳  
    nonceStr: '生成签名的随机串 ', // 必填，生成签名的随机串  
    signature: '微呼百应签名',// 必填，签名，见附录1  
    jsApiList: [  
        'checkJsApi',  
        'onMenuShareTimeline',  
        'onMenuShareAppMessage',  
        'onMenuShareQQ',  
        'onMenuShareWeibo',  
        'chooseWXPay'  
    ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2  
});  
    wx.ready(function () {
        wx.onMenuShareTimeline({
            title: '分享标题测试', // 分享标题  '--{$info.name}'
            link: window.location.href, // 分享链接,将当前登录用户转为puid,以便于发展下线  
            imgUrl: 'http://ou3hks27l.bkt.clouddn.com/image/005A8LxCgy1ficis0towej30c80lqq3v68a04569ecf94e37a54406ff9275a413.jpg', // 分享图标  
            success: function () {  
                // 用户确认分享后执行的回调函数  
                alert('分享成功');  
            },  
            cancel: function () { 
            	alert('取消分享');
                // 用户取消分享后执行的回调函数  
            }  
        });  
        wx.error(function(res){  
            // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。  
            console.log("errorMSG:"+res);  
        }); 
    }); */