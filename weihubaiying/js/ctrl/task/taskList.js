var id = getExtraDataByKey('id')||GetQueryString('id');
//var userInfo=JSON.parse(localStorage.getItem(app.userlocalKey));

function is_weixin() {
 	var ua = navigator.userAgent.toLowerCase();
	if (ua.match(/MicroMessenger/i) == "micromessenger") {//如果在微信浏览器端
		document.getElementById('back').style.display="none";
		document.getElementById('center').style.marginLeft="0.1rem";
		document.getElementById('taskListHead').style.display="block";
		document.getElementById('listBox').style.top="0.43rem";
	} else {
	 	return false;
	}
}
is_weixin();

mui.init({
	swipeBack:true,
	pullRefresh: {
		container: "#pullrefresh", 
		down : {
	      style:'circle',//必选，下拉刷新样式，目前支持原生5+ ‘circle’ 样式
	      color:'#2BD009', //可选，默认“#2BD009” 下拉刷新控件颜色
	      height:50,//可选,默认50.触发下拉刷新拖动距离,
	      auto: false,//可选,默认false.首次加载自动上拉刷新一次
	      callback :pulldownRefresh
	    },
	    up : {
	      style:'circle',//必选，下拉刷新样式，目前支持原生5+ ‘circle’ 样式
	      color:'#2BD009', //可选，默认“#2BD009” 下拉刷新控件颜色
	      height:50,//可选,默认50.触发下拉刷新拖动距离,
	      auto: false,//可选,默认false.首次加载自动上拉刷新一次
	      callback :pullupRefresh //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
	    }
	}
});



var pageSet = { //分页设置
	pageNum: 1,
	pageSize: 5,
	totalPage: 0
}


var mainVM = new Vue({
	el:'#mainVM',
	data:{
		task_own:[],
		description:'',
		taskState:[{
			id:'whole',
			name:'全部',
			url: '#wholeList',
			default: true,
			status:'3',
			extras: {
			}
		},{
			id:'jxzList',
			name:'进行中',
			url: '#jxzList',
			status:'0',
			extras: {
			}
		},{
			id:'jxzList',
			name:'待审核',
			url: '#jxzList',
			status:'1',
			extras: {
			}
		},{
			id:'yjsList',
			name:'已结束',
			url: '#jxzList',
			status:'2',
			extras: {
			}
		}
		],
		currentPage:'whole'
	},
	methods:{},
	mounted:function(){
		loadDom(3);
	}
});



//下拉刷新函数
function pulldownRefresh(){
	pageSet.pageNum = 1;
	taskList(false);
};



//上拉加载函数
function pullupRefresh(){
	pageSet.pageNum ++;
	taskList(true);
};

//加载页面函数
function taskList(isPullUp){
	var status = localStorage.getItem('status');
	getPostData('pm.task.own',{
		'method' : 'pm.task.own',
		'status' : status,
		'memberId' : id,
		'pageSize' : pageSet.pageSize,
		'pageNum' : pageSet.pageNum,
	},function(data,isSuccess){
		if(isSuccess){
			//如果是上拉加载
			if(isPullUp){
				//如果当前页有数据
				if(data.data != undefined){
					mainVM.task_own = mainVM.task_own.concat(data.data.task_own);
					mui('#pullrefresh').pullRefresh().endPullupToRefresh();
					// mui('#pullrefresh').pullRefresh().refresh(true);
				//如果当前页没有了数据
				}else{
					mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
					// mui('#pullrefresh').pullRefresh().refresh();
				}
			//如果是下拉刷新
			}else{
				if(data.data != undefined){
					mainVM.task_own = data.data.task_own;
					/*if(mainVM.task_own.length<1){
						document.getElementsByClassName('mui-pull')[0].style.display = 'none';
					}else{
						document.getElementsByClassName('mui-pull')[0].style.display = 'block';
					}*/
					mui('#pullrefresh').pullRefresh().endPulldownToRefresh(true);
					mui('#pullrefresh').pullRefresh().refresh(true);
				}else{
					if(mainVM.task_own.length<1){
						document.getElementsByClassName('mui-pull')[1].style.display = 'none';
					}else{
						document.getElementsByClassName('mui-pull')[1].style.display = 'block';
					}
					mui('#pullrefresh').pullRefresh().endPulldownToRefresh(true);
					mui('#pullrefresh').pullRefresh().refresh();
				}
			}
		}
	})
};


function loadDom(status) {
	localStorage.setItem('status',status);
	getPostData('pm.task.own',{
		'method' : 'pm.task.own',
		'status' : status,
		'memberId' : id,
		'pageSize' : pageSet.pageSize,
		'pageNum' : pageSet.pageNum,
	},function(data,isSuccess){
		// console.log(status);
		if(data.data != undefined){
			mainVM.description = "";
			taskList(false);
		}else{
			mainVM.task_own = [];
			mainVM.description = data.description;
		}
	})
}

//点击切换顶部选项卡
mui('body').on('tap','#taskStateList a',function(isPullUp){
	var status = this.dataset.status;
	pageSet.pageNum = 1;
	loadDom(status);
});

mui('body').on('tap','.back',function(){
	sessionStorage.setItem("reload",1)
	mui.back();
});

mui('body').on('tap','.taskList li.success',function(){
	var id = this.id;
	createWin(null,'taskListDetails.html',{taskId:id})
});

mui('body').on('tap','.taskList li.end',function(){
	mui.confirm('您的任务未在规定时间内提交，请到任务广场重新领取！','提示', ['取消', '确认'], function(e) {
		if (e.index == 1) {
			sessionStorage.setItem('indexPage','taskSquare')
			createWin(null, '../index.html',null);
		} 
	});
});
