var userInfo=JSON.parse(localStorage.getItem(app.userlocalKey));
var id = getExtraDataByKey('id');
var zmtOk=localStorage.getItem("zmtOk");
var ua = navigator.userAgent.toLowerCase();
console.log(ua);
if(sessionStorage.getItem("reload2")){
	location.reload();
	sessionStorage.removeItem("reload2")
}

var homePageVM = new Vue({
	el:'#homePageVM',
	data:{
		data:'',
		userInfo:'',
		redInfo:'',
		zmtId:'',
		bankcard:'',
		id:id,
		zmtOk:zmtOk
	},
	methods:{
	},
	mounted:function(){
		homepage();
	}
});
function getMainInfo(){
	//消息提示小红点
	getPostData('pm.main.news.info',{
		"method":'pm.main.news.info',
		"memberId":userInfo.id
	},function(data,isSuccess){
		if(isSuccess){
			homePageVM.redInfo=data.data.info;
		}
	});
	
	getPostData('pm.member.get',{
		"method":'pm.member.get',
		"memberId":userInfo.id
	},function(data,isSuccess){
		console.log(data);
		if(data.data){
			homePageVM.bankcard=data.data.bankcard;
			homePageVM.zmtId=data.data.mediaId;
		}
		if(isSuccess){
			homePageVM.data = data.data;
			var mineInfo = {};
//			data.data.mobile='13345122570'
			mineInfo.phone = data.data.mobile;
			mineInfo.media = data.data.media;
			mineInfo.realName = data.data.realName;
			storage(mineInfo);
		}
	});
}

function homepage(){
	window.addEventListener("pageshow", function() {
		getMainInfo();
	});
	
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
}

$("#menu").click(function() {
    createWin(null, 'setting.html',null);
})

mui('body').on('tap','#qudenglu',function(){
	createWin(null, '../login/login.html', null);
});
//审核中
mui('body').on('tap','#review',function(){
	createWin(null, 'review.html', {personalId:homePageVM.zmtId,id:1});
});
//审核失败
mui('body').on('tap','#unreview',function(){
	createWin(null, 'review.html', {personalId:homePageVM.zmtId,id:3});
});
//审核成功
mui('body').on('tap','#reviewOk',function(){
	createWin(null, 'review.html', {personalId:homePageVM.zmtId,id:2});
});
//进入自媒体主页
mui('body').on('tap','#zmtHome',function(){
	createWin(null, '../meiti/personalMedia.html', {personalId:homePageVM.zmtId,form:'homePage'});
});

function storage(type){
	localStorage.setItem('renzheng', JSON.stringify(type));
}

//	跳转至 积分兑换
mui('body').on('tap','#goExchange',function(){
	if(!(userInfo == null)){
		if(homePageVM.data.realName == '0'){
			var btnArray = ['取消', '去认证'];
			mui.confirm('您还未进行实名认证，为了保护您的积分安全请认证。', '提示', btnArray, function(e) {
				if (e.index == 1) {
					createWin(null, 'certification.html', {id:userInfo.id});
				} 
			})
		}else{
			createWin(null, 'exchange.html', {id:userInfo.id,bankcard:homePageVM.bankcard});
		}
	}else{
		createWin(null, '../login/login.html', null);
	}
});

//	跳转至 任务页
mui('body').on('tap','#toTast',function(){
	if(!(userInfo == null)){
		createWin(null, '../task/taskList.html', {id:userInfo.id});
	}else{
		createWin(null, '../login/login.html', null);
	}
});

//	跳转至 修改信息页
mui('body').on('tap','#modify_info',function(){
	if(!(userInfo == null)){
		createWin(null, 'editData.html', {id:userInfo.id});
	}else{
		createWin(null, '../login/login.html', null);
	}
});
//	跳转至 消息页
mui('body').on('tap','#goMessage',function(){
	if(!(userInfo == null)){
		createWin(null, 'message.html', {id:userInfo.id});
	}else{
		createWin(null, '../login/login.html', null);
	}
});
//	跳转至  个人自媒体
mui('body').on('tap','#goRenzheng',function(){
	if(!(userInfo == null)){
		if(homePageVM.data.media == '0'){
			createWin(null, '../renzheng/shenfen.html', {id:userInfo.id});
		}
		
	}else{
		createWin(null, '../login/login.html', null);
	}
});
//	跳转至意见反馈
mui('body').on('tap','#goFeedback',function(){
	if(!(userInfo == null)){
		createWin(null, 'feedback.html', {id:userInfo.id});
	}else{
		createWin(null, '../login/login.html', null);
	}
});
//	 跳转至 积分记录
mui('body').on('tap','#goIntegral',function(){
	if(!(userInfo == null)){
		createWin(null, 'integralRecord.html', {id:userInfo.id});
	}else{
		createWin(null, '../login/login.html', null);
	}
});

//	跳转至实名认证
mui('body').on('tap','#realName',function(){
	if(!(userInfo == null)){
		if(homePageVM.data.realName == '0'){
			createWin(null, 'certification.html', {id:userInfo.id});
		}
	}else{
		createWin(null, '../login/login.html', null);
	}
});

/* //实现ios平台的侧滑关闭页面；
if (mui.os.plus && mui.os.ios) {
	offCanvasWrapper[0].addEventListener('shown', function(e) { //菜单显示完成事件
		plus.webview.currentWebview().setStyle({
			'popGesture': 'none'
		});
	});
	offCanvasWrapper[0].addEventListener('hidden', function(e) { //菜单关闭完成事件
		plus.webview.currentWebview().setStyle({
			'popGesture': 'close'
		});
	});
}*/