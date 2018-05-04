var userInfo=JSON.parse(localStorage.getItem(app.userlocalKey));
var mineInfo = JSON.parse(localStorage.getItem('renzheng'));
var local;
//console.log(mineInfo);

var ua = navigator.userAgent.toLowerCase();
console.log(ua);
if(sessionStorage.getItem("reload1")){
	location.reload();
	sessionStorage.removeItem("reload1");
}

//头条

function AutoScroll(obj) {
	$(obj).find("ul").animate({
		marginTop: "-0.14rem"
	}, 500, function() {
		$(this).css({
			marginTop: "0px"
		}).find("li:first").appendTo(this);
	});
}

function initRollingNotice(){
	$(document).ready(function(){
		setInterval('AutoScroll("#rollingNotice")',3000);
	});
};
	
var mainVM = new Vue({
	el:"#mainVM",
	data:{
		ladv:[],
		mediaList:[],
		Z_mediaList:[],
		mingrenList:[],
		service_label:{},
		mediaListArr:[],
		searchMsg:'',
		lr:[],
		lm:[],
		searType:false,
		mineInfo:mineInfo,
		news:[],
		redInfo:'',
		zmtId:'',
	},
	watch:{
		
	},
	methods:{
		searchMsg1: function(e) {
			var keyCode =window.event?e.keyCode:e.which;
			// console.log(e)
			if(keyCode == 13){
				var type =2;
				createWin(null,"meiti/mrList.html",{searchMsg:mainVM.searchMsg,type:type});
			}
		}
	},
	created:function(){},
	mounted:function(){
		initRollingNotice();
		init();
	}
});

function getMainInfo(){
	//消息提示小红点
	getPostData('pm.main.news.info',{
		"method":'pm.main.news.info',
		"memberId":userInfo.id
	},function(data,isSuccess){
		if(isSuccess){
			mainVM.redInfo=data.data.info;
//			console.log(mainVM.redInfo)//0无消息  非0有消息
		}
	});
	
	getPostData("main.obtainResources", {
		'method' : "main.obtainResources",
		"memberId":userInfo?userInfo.id:''
	},function(data, isSuccess){
		 console.log(data)
		if(isSuccess){
			mainVM.zmtId=data.data.mediaId;
			mainVM.ladv = data.data.ladv;
			console.log(mainVM.ladv)
			mainVM.mediaList = data.data.mediaList;
			mainVM.Z_mediaList=[];
			if(data.data.z_mediaList){
				for(var i=0;i<data.data.z_mediaList.length;i++){
					if(i<3){
						data.data.z_mediaList[i].keyword=data.data.z_mediaList[i].keyword.split(',');
						// console.log(data.data.z_mediaList[i]);
						mainVM.Z_mediaList.push(data.data.z_mediaList[i])
					}
				}
			}
//			mainVM.Z_mediaList = data.data.z_mediaList;
			mainVM.mingrenList = data.data.mingrenList;
			mainVM.news = data.data.news;
			mainVM.mediaListArr=[];
			var size = 3;
			for(var i = 0; i < mainVM.mediaList.length; i = i + size) {
				mainVM.mediaListArr.push(mainVM.mediaList.slice(i, i + size));
			};
			console.log(mainVM.mediaListArr);
			mui.each(data.data.mediaList,function(index,val){
				val.service_label=val.service_label.split(",");
			});
			// mui.each(data.data.z_mediaList,function(index,val){
			// 	val.service_label=val.service_label.split(",");
			// });
			mainVM.$nextTick(function(){
				mui("#slider").slider({
					interval: 5000
				});
				mui(".mui-slider.noInterval").slider({
					interval:0
				});
			});
		}
	});
	
}

	

function init(){
	window.addEventListener("pageshow", function() {
		getMainInfo();
	});
	
	mui.init({
		swipeBack: false
	});
	//老师儿活动
	mui('body').on('tap','a.ladvLink',function(e){
		var that=this;
		
		if(that.name==1){
			getPostData('pm.resource.mingren',{
				"method":'pm.resource.mingren',
				"aid":that.id
			},function(data,isSuccess){
				console.log(that.name,that.id,that.href);
				console.log(data);
				if(that.href!=''){
					window.location.href=that.href;
				}else if(data.code==000){
					createWin(null,"meiti/teacher.html",{id:that.id});
				}
			});
		}
		
	});

	
	(function($){
		$(".mui-scroll-wrapper").scroll({
			deceleration: 0.0005,
			bounce: false,//滚动条是否有弹力默认是true
			indicators: false, //是否显示滚动条,默认是true
		});
	})(mui);
	
	mui('body').on('tap','.mediaList',function(e){
		var type = this.name;
		createWin(null,"meiti/mrList.html",{type:type});
	});
	
	mui('body').on('tap','#toCircle',function(e){
		createWin(null,"meiti/personal.html");
	});
	mui('body').on('tap','ul.zmrUl li',function(e){
		var mrListId = this.id;
		createWin(null,'meiti/mrtg.html',{mrListId:mrListId})
	});
	mui('body').on('tap','ul#rollingNotice li',function(e){
		var mrListId = this.id;
		createWin(null,'information/infoDetails.html',{mrListId:mrListId})
	});
	mui('body').on('tap','ul.zmtDivui li',function(e){
		var mrListId = this.id;
		// console.log(mrListId);
		createWin(null,'meiti/mrtg.html',{mrListId:mrListId})
	});
	mui('body').on('tap','ul.searchUl li',function(e){
		var mrListId = this.id;
		createWin(null,'meiti/mrtg.html',{mrListId:mrListId})
	});
	mui('body').on('tap','ul.zqzDivui li',function(e){
		var personalId = this.id;
		createWin(null,'meiti/personalMedia.html',{personalId:personalId})
	});
	mui('body').on('tap','ul.lmUl li',function(e){
		var personalId = this.id;
		createWin(null,'meiti/personalMedia.html',{personalId:personalId})
	});
	mui('body').on('tap','a.mainJump',function(){
		var type = this.name;
		createWin(null,"meiti/mrList.html",{type:type});
	});
	mui('body').on('tap','a.wxy',function(){
		var type = this.name;
		createWin(null,"task/taskSquare.html",{wxy:"wxy"});
	});
	mui('body').on('tap','a.mainJump2',function(){
		createWin(null,"meiti/personal.html",null);
	})
}

if(!(userInfo == null)){
	mui('body').on('tap','#messageHints',function(){
		createWin(null,'mine/message.html',{id:userInfo.id});
	});
	mui('body').on('tap','#joinMedia',function(){
		console.log(mainVM.zmtId,mineInfo.media);
		if(mineInfo.media == '0'){//未申请
			createWin(null,'renzheng/shenfen.html',{id:userInfo.id});
		}else if(mineInfo.media == '1'){//审核中
			createWin(null, 'mine/review.html', {personalId:mainVM.zmtId,id:1});
		}else if(mineInfo.media == '2'){//审核通过
			createWin(null,'meiti/personalMedia.html',{personalId:mainVM.zmtId,form:'homePage'});
		}else if(mineInfo.media == '3'){//审核不通过
			createWin(null, 'mine/review.html', {personalId:mainVM.zmtId,id:3});
		}
	})
}else{
	createWin(null,'login/login.html',null);
}
