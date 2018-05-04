//app端返回不刷新问题
window.addEventListener("pageshow", function() {
	if(sessionStorage.getItem("reload")){
		location.reload();
		sessionStorage.removeItem("reload")
	}
});

function is_weixin() {
 	var ua = navigator.userAgent.toLowerCase();
	if (ua.match(/MicroMessenger/i) == "micromessenger") {//如果在微信浏览器端
		document.getElementById('header').style.display="none";
		document.getElementById('content').style.marginTop=0;
	} else {
	 	return false;
	}
}
is_weixin();


function GetQueryString(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}
var userInfo=(JSON.parse(localStorage.getItem(app.userlocalKey)))||(JSON.parse(decodeURIComponent(GetQueryString(userInfo))));
console.log(sessionStorage.getItem("reload"))



var mineInfo = JSON.parse(localStorage.getItem('renzheng'));
var id = getExtraDataByKey('id');
/*var idTime=localStorage.getItem(id+"Time");
console.log(idTime);*/

var type = localStorage.getItem(id);
console.log(type);

var mainVM = new Vue({
	el:"#mainVM",
	data:{
		task:'',
		lingqu:'',
		taskStatus:'',
		status:'',
		idTime:localStorage.getItem(id+"Time")||"",
		imgList:[],
		userInfo:userInfo
	},
	methods:{
		
	},
	mounted:function(){
		tg_details()
		init();
		
//	var arr = ($('#smallImg')[0].src);
//	console.log(arr);
	}
});

//获取任务详情  status任务状态( 0: 未结束 1 : 已结束 )
function tg_details(){
	getPostData("pm.task.get", {
		'method' : "pm.task.get",
		"sign":'',
		"taskId":id,
		"memberId":userInfo?userInfo.id:''
	},function(data,isSuccess){
		console.log(data);
		if(data.data.taskStatus){//只有已结束的时候才会有taskStatus
			mainVM.taskStatus=data.data.taskStatus;
		}
		mainVM.status=data.data.stauts;
		if(isSuccess){
			if(data.data){
				data.data.task.task_guidance.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (match, capture) {
				mainVM.imgList.push(capture);
			});
			data.data.task.task_guidance=data.data.task.task_guidance.replace(/<.*?>/ig,"").replace(/(\\n)*(\\t)*/ig,"").replace(/\\n*/ig,"").replace(/"/ig,"");
				data.data.task.content=data.data.task.content.replace(/<.*?>/ig,"").replace(/(\\n)*(\\t)*/ig,"").replace(/\\n*/ig,"").replace(/"/ig,"");
				mainVM.task = data.data.task;
				mainVM.lingqu=data.data.lingqu;
				
			}
			

		}
	})
}
function shareSuccess(){
	mui.toast("分享成功");
	/*getGetData({
		method: "pm.task.share",
		taskId: taskId,
		memberId: memberId,
	}, function(res) {
		mui.toast(res.description);
	})*/
};

function shareError(msg){
	mui.toast(msg);
};

function init() {
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
	
	mui("#header").on('tap', '.back', function(){
		sessionStorage.removeItem('reload');
		createWin(null,'../index.html',null);
	});
	
	setTimeout(function(){
		var smallImgList=document.getElementsByClassName('smallImg');
		
		for(var i=0;i<smallImgList.length;i++){
			smallImgList[i].onclick=function(){
				document.getElementById('bigImg').style.display='block';
				document.getElementById('bigImg').src=this.src;
			}
		}
	},1000);
	
	document.getElementById('bigImg').onclick=function(){
		document.getElementById('bigImg').style.display='none';
	}
	
	mui("#header").on('tap', '#share-i', function(){
		window.jsObj.shareTitleContentImgUrlWebUrl(mainVM.task.name,mainVM.task.content,mainVM.task.imgUrl,window.location.href+"&userInfo="+encodeURIComponent(JSON.stringify(userInfo)));
	});
	
	//全局变量，动态的文章ID
		var ShareURL = "";
		//绑定所有分享按钮所在A标签的鼠标移入事件，从而获取动态ID
		/*$(function() {
			$(".bdsharebuttonbox a").mouseover(function(){
				console.log(this)
				ShareURL = $(this).attr("data-url");
			});
		});*/
		/* 
		 * 动态设置百度分享URL的函数,具体参数
		 * cmd为分享目标id,此id指的是插件中分析按钮的ID
		 *，我们自己的文章ID要通过全局变量获取
		 * config为当前设置，返回值为更新后的设置。
		 */
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

}

//领取任务
//var taskReceive = document.getElementById('taskReceive');
function receive(){
	if(mineInfo.media =='0'||mineInfo.media =='3'){
		console.log(100)
		var btnArray = ['取消', '去认证'];
			mui.confirm('您还未认证，请认证。', '提示', btnArray, function(e) {
				console.log(200);
				if (e.index == 1) {
					createWin(null, '../renzheng/shenfen.html', {id:userInfo.id});
				} 
			})
	}else if(mineInfo.media =='1'){
		var btnArray = ['确定'];
		mui.confirm('您的认证资料正在审核中，通过后才能领取任务。', '提示', btnArray, function(e) {
		})
	}else{
		getPostData("pm.task.add", {
			'method' : "pm.task.add",
			"sign":'',
			"taskId":id,
			'memberId':userInfo?userInfo.id:''
		},function(data,isSuccess){
			console.log(data);
			if(isSuccess){
				mui.toast('任务领取成功');
				/*if(taskReceive){
					taskReceive.classList.remove("mui-hidden");
				}*/
//				var notFinished = document.getElementById('notFinished');
//				notFinished.classList.add('mui-hidden');
				storage(id,'receive');
				location.reload();
			}
		})
	}
}
var notFinished = document.getElementById('notFinished');

function taskOver(){
	mui.toast('任务已结束');
};

//放弃任务
function giveUp(){
	console.log(mainVM.status)
	if(mainVM.status==0){
		getPostData("pm.task.out",{
			'method':'pm.task.out',
			"sign":'',
			"taskId":id,
			'memberId':userInfo?userInfo.id:''
		},function(data,isSuccess){
			console.log(data);
			if(isSuccess){
				mui.toast('任务已放弃');
				/*if(mainVM.idTime==0){
					mui.toast('任务时间已过，请重新领取');
				}else{
					
				}*/
//				taskReceive.classList.add("mui-hidden");
//				document.getElementById('notFinished').style.display='block';
				storage(id,'giveup');
				location.reload();
			}
		});
	}else{
		mui.toast("任务已提交，不能放弃任务");
	}
	/**/
};

mui("#mainVM").on("tap",".already",function(){
	createWin(null,'taskListDetails.html',{taskId:id});
});

//存储任务状态
function storage(taskid,type){
	localStorage.setItem(taskid,type);
}
