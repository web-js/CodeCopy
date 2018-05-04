var ua = navigator.userAgent.toLowerCase();
console.log(ua);
if((ua.indexOf('android')==-1)||!(ua.indexOf('adr')==-1)){//如果不是安卓手机
	if(sessionStorage.getItem("reload")){
		location.reload();
		sessionStorage.removeItem("reload")
	}
}
function is_weixin() {
 	var ua = navigator.userAgent.toLowerCase();
	if (ua.match(/MicroMessenger/i) == "micromessenger") {//如果在微信浏览器端
		document.getElementById('back').style.display="none";
	} else {
	 	return false;
	}
}
is_weixin();

var userId=JSON.parse(localStorage.getItem(app.userlocalKey)).id||GetQueryString('member');
var wxy = getExtraDataByKey('wxy')||GetQueryString('wxy');
//console.log(userId)


mui.init({
	swipeBack:true,
	pullRefresh: {
		container: "#pullrefresh", 
		down : {
	      style:'circle',//必选，下拉刷新样式，目前支持原生5+ ‘circle’ 样式
	      color:'#2BD009', //可选，默认“#2BD009” 下拉刷新控件颜色
	      height:50,//可选,默认50.触发下拉刷新拖动距离,
	      auto: true,//可选,默认false.首次加载自动下拉刷新一次
	      callback :pulldownRefresh
	    },
	    up : {
	      style:'circle',//必选，下拉刷新样式，目前支持原生5+ ‘circle’ 样式
	      color:'#2BD009', //可选，默认“#2BD009” 下拉刷新控件颜色
	      height:50,//可选,默认50.触发下拉刷新拖动距离,
	      auto: false,//可选,默认false.首次加载自动上拉刷新一次
	      callback :pullupRefresh//必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
	    }
	}
});

//分页设置
var pageSet = {
	pageNum: 1,
	pageSize: 4,
	totalPage: 10,
}

var taskSquareVM = new Vue({
	el:'#taskSquareVM',
	data:{
		data:'',
		SMdata:'',
		taskList:[],
		bankcard:'',
		wxy:wxy
	},
	methods:{},
	created:function(){
	
	},
	mounted:function(){
		getTaskList(false);
		homepage();
	}
});

mui('.mui-scroll-wrapper').scroll({
	deceleration: 0.0003 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
});

//下拉刷新函数
function pulldownRefresh(){
	pageSet.pageNum = 1;
	getTaskList(false);
}
//上拉加载函数
function pullupRefresh(){
	pageSet.pageNum ++;
	getTaskList(true);
}

//任务广场列表  status任务状态(1 : 已结束 2 : 未领取 3: 已领取)
function getTaskList(isPullUp){
	getPostData("pm.task.list",{
		'memberId':userId,
		'method':'pm.task.list',
		'pageNum':pageSet.pageNum,
		'pageSize':pageSet.pageSize
	},function(data,isSuccess){
		  console.log(data);
		if(isSuccess){
			taskSquareVM.bankcard=data.data.bankcard;
			// taskSquareVM.taskList = data.data.taskList;
			//如果是上拉加载
			if(isPullUp){
				if(data.data.taskList.length >= 1){
					taskSquareVM.data = data.data;
					taskSquareVM.taskList = taskSquareVM.taskList.concat(data.data.taskList);
					mui('#pullrefresh').pullRefresh().endPullupToRefresh();
					mui('#pullrefresh').pullRefresh().refresh(true);
				}else{
					mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
				}
			//下拉
			}else{
				taskSquareVM.data = data.data;
				
				taskSquareVM.taskList = data.data.taskList;
				if(taskSquareVM.taskList.length<1){
					document.getElementsByClassName('mui-pull')[1].style.display = 'none';
				}else{
					document.getElementsByClassName('mui-pull')[1].style.display = 'block';
				}
				mui('#pullrefresh').pullRefresh().endPulldownToRefresh(true);
				mui('#pullrefresh').pullRefresh().refresh(true);
			}
		}
	})
}



function homepage(){
	getPostData('pm.member.get',{
		"method":'pm.member.get',
		"memberId":userId
	},function(data,isSuccess){
		// console.log(data);
		if(isSuccess){
			taskSquareVM.SMdata = data.data;
			var mineInfo = {};
			mineInfo.phone = data.data.mobile;
			mineInfo.media = data.data.media;
			mineInfo.realName = data.data.realName;
			storage(mineInfo);
		}
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
//	详情页
	mui('body').on('tap','.taskList>li',function(e){
		alert(11)
		var id = this.id;
		createWin(null,'taskDetails.html',{id:id})
	});
	
	mui('body').on('tap','#goTaskList',function(){
		createWin(null,'taskList.html',{id:userId})
	});
	
	function storage(type){
		localStorage.setItem('renzheng', JSON.stringify(type));
	}
	
	mui.plusReady(function(){//安卓
	    plus.webview.currentWebview().setStyle({width:'100%',height:'100%'});
	});
}

mui('body').on('tap','#goConvertibility',function(){
	console.log(userId)
	if(!(userId == null)){
		if(taskSquareVM.SMdata.realName == '0'){
			var btnArray = ['取消', '去认证'];
			mui.confirm('您还未进行实名认证，为了保护您的积分安全请认证。', '提示', btnArray, function(e) {
				if (e.index == 1) {
					createWin(null, '../mine/certification.html', {id:userId});
					document.getElementsByClassName('mui-popup')[0].style.display='none';
				}else{
					document.getElementsByClassName('mui-popup')[0].style.display='none';
				}
			})
		}else{
			createWin(null, '../mine/exchange.html', {id:userId,bankcard:taskSquareVM.bankcard});
		}
	}else{
		createWin(null, '../mine/exchange.html', null);
	}
});
