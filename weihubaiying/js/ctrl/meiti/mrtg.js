var userInfo=JSON.parse(localStorage.getItem(app.userlocalKey));
//var mrListId = getExtraDataByKey('mrListId');
var mineInfo = JSON.parse(localStorage.getItem('renzheng'));
var subtime = localStorage.getItem('tjsj');
var frequency = 0;
var currentTime =  new Date().getTime() - subtime;

var mrListId = GetQueryString('mrListId');
//console.log(mrListId);

function is_weixin() {
 	var ua = navigator.userAgent.toLowerCase();
	if (ua.match(/MicroMessenger/i) == "micromessenger") {//如果在微信浏览器端
		document.getElementById('header').style.display="none";
	} else {
	 	return false;
	}
}
is_weixin();

if(!userInfo){
	document.getElementById('mrtgdiv').style.marginBottom=0;
}


var mainVM = new Vue({
	el:"#mainVM",
	data:{
		dynamic:[],
		resources:'',
		service_label:[],
		mineInfo:mineInfo,
		imgList:[]
	},
	methods:{},
	mounted:function(){
		tg_details();
	}
});

function shareSuccess(){
	mui.toast("分享成功");
};

function shareError(msg){
	mui.toast(msg);
};

function tg_details(){//媒体,名人详情展示
	mui.init({
		swipeBack: false
	});
	
	(function($){
		$(".mui-scroll-wrapper").scroll({
			deceleration: 0.0005,
			bounce: false,//滚动条是否有弹力默认是true
			indicators: false, //是否显示滚动条,默认是true
		});
	})(mui);
	
	mui('body').on('tap','.back',function(){
		sessionStorage.setItem("reload1",1);
		mui.back();
	});
	
	//分享
	mui("#header").on('tap', '#share-i', function(){
		window.jsObj.shareTitleContentImgUrlWebUrl(mainVM.resources.nickName,mainVM.resources.content,encodeURI(mainVM.resources.headUrl),window.location.href+"&userInfo="+encodeURIComponent(JSON.stringify(userInfo)));
		console.log(mainVM.resources.headUrl,encodeURI(mainVM.resources.headUrl));
	});
	
	var ShareURL = "";
		//绑定所有分享按钮所在A标签的鼠标移入事件，从而获取动态ID
	$(function(){
		$(".bdsharebuttonbox a").mouseover(function(){
			console.log(this);
			ShareURL = $(this).attr("data-url");
		});
	});
	
	function SetShareUrl(cmd, config) {
		if(ShareURL) {
			config.bdUrl = ShareURL;
		}
		return config;
	}
	
	//插件的配置部分，注意要记得设置onBeforeClick事件，主要用于获取动态的文章ID
	window._bd_share_config = {
		"common": {
			onBeforeClick: SetShareUrl,
			"bdSnsKey": {},
			"bdText": "",
			"bdMini": "2",
			"bdMiniList": false,
			"bdPic": "http://www.datouwang.com/uploads/pic/jiaoben/2017/jiaoben826_s.jpg",
			"bdStyle": "0",
			"bdSize": "24"
		},
		"share": {}
	};
	
	//插件的JS加载部分
		with(document) 0[(getElementsByTagName('head')[0] || body)
			.appendChild(createElement('script'))
			.src = 'http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion=' +
			~(-new Date() / 36e5)];
	
	getPostData("pm.media.details", {
		'method' : "pm.media.details",
		"sign":'',
		"id":mrListId
	},function(data,isSuccess){
		if(data.code=="000"){
			console.log(data)
			data.data.resources.conent.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (match, capture) {
				mainVM.imgList.push(capture);
			});
			data.data.resources.conent=data.data.resources.conent.replace(/<.*?>/ig,"").replace(/(\\n)*(\\t)*/ig,"").replace(/\\n*/ig,"").replace(/"/ig,"")
			mainVM.resources = data.data.resources;
			var labelList = (data.data.resources.service_label).split(',');
			mainVM.service_label = labelList;
			var dtList = data.data.dynamic;
			mui.each(dtList,function(index,val){
				val.createTime=getLocalTime(val.createTime);
				if((val.new_model==1)||(val.new_model==2)){
					val.conent=val.conent.replace(/<.*?>/ig,"").replace(/(\\n)*(\\t)*/ig,"").replace(/\\n*/ig,"").replace(/"/ig,"");
					val.imgUrl=val.imgUrl.split(",");
				}
			});
			mainVM.dynamic = dtList;
		}else{
			mui.toast(data.description)
		}
	});
	
	//找他合作动态效果
	//打开窗口
    $('.cd-popup-trigger2').on('click', function(event){
        event.preventDefault();
        $('.cd-popup2').addClass('is-visible2');
    });
    //关闭窗口
    $('.cd-popup2').on('click', function(event){
        if( $(event.target).is('.cd-popup-close') || $(event.target).is('.cd-popup2') ) {
            event.preventDefault();
            $(this).removeClass('is-visible2');
        }
    });
    $('#cooperation').on('tap','li',function(){
    	if($(this).hasClass('action')){
       		$(this).removeClass('action')
       	}else{
       		$(this).addClass('action')
       	}
    });
   $('.sure').on('click',function(){
   		$('.item').removeClass('action')
   })
	
};

mui('body').on('tap','#mxdt ul li',function(){
	var id = this.id;
	createWin(null,'../information/infoDetails.html',{newsListId:id})
});

//找他合作
function coop(){
	if(!(userInfo == '')){
			if(mui('#cooperation li.action').length == 0){
			mui.toast('请选择合作项目！');
			}else{
				var b = [];
				var hzList = mui('#cooperation li.action');
				for(var i=0;i<hzList.length;i++){
					b.push(hzList[i].innerHTML);
				}
				service_item = JSON.stringify(b);
				getPostData('pm.order.add',{
				 	'method':'pm.order.add',
				 	'sign':'',
				 	'memberId':userInfo.id,
				 	'resourcesId':mrListId,
				 	'service_item':service_item
				},function(data,isSuccess){
					console.log(data);
					if(isSuccess){
						mui.toast(data.description);
						var submitTime= new Date().getTime();
						cunchu(submitTime);
					}else{
						mui.toast('提交失败！')
					}
				})
			}
	}else{
		mui.confirm('您还未登录，请登录。', '', ['取消', '去登录'], function(e) {
			if (e.index == 1) {
				createWin('login', 'login/login.html', {});
			}
		})
	}
	
};
function cunchu(time){
	localStorage.setItem('tjsj',time);
}

//点击联系客服
mui('body').on('tap','#dial',function(){
	if(userInfo != ''){
		var btnArray = ['取消', '呼叫'];
		mui.confirm('', '是否拨打客服电话？', btnArray, function(e) {
	    	if (e.index == 1) {
	        	window.location.href = 'tel:'+ mineInfo.phone;
	       	}else {                        
	        }
		})
	}else{
		mui.toast('您还未登录')
	}
});

function getLocalTime(nS) {
    return new Date(parseInt(nS)).toLocaleString().replace(/\//g, "-").replace(/日 /g, "").replace(/(上午|下午)\d+:\d+:\d+/g, "");      
} 

