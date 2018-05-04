var type = getExtraDataByKey('type');
var searchMsg = getExtraDataByKey('searchMsg');
function is_weixin(){
 	var ua = navigator.userAgent.toLowerCase();
	if (ua.match(/MicroMessenger/i) == "micromessenger") {//如果在微信浏览器端
		document.getElementById('back').style.display="none";
		document.getElementById('Tcenter').style.marginLeft="0.5rem";
	} else {
	 	return false;
	}
}
is_weixin();

if(searchMsg != null){
	secrch()
}

//MUI上拉下拉组件初始化
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
	      contentrefresh:"上拉加载",
	      callback :pullupRefresh //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
	    }
	}
});

//分页设置
var pageSet = { 
	pageNum: 1,
	pageSize: 5,
	totalPage: 10,
}

var mrListVM = new Vue({
	el:'#mrListVM',
	data:{
		allmingrenList:[],
		service_label:{},
		page:0,
		newstypeList:[],
		newsTypeId:'',
		classnewsList:[],
		type:type,
		searchListlr:[],
		searchListlm:[]
	},
	methods:{},
	created:function(){},
	mounted:function(){
		init();
		setTimeout(function(){
			getMainInfo(false);
		},0)
	}
})


//上拉加载函数
function pullupRefresh() {
	pageSet.pageNum ++;
	getMainInfo(true);
}


//下拉刷新函数
function pulldownRefresh() {
	pageSet.pageNum = 1;
	getMainInfo(false);
}


//我也不知道什么函数
function secrch(){
	getPostData("pm.main.sosuo",{
		'method':'pm.main.sosuo',
		'name':searchMsg
	},function(data,isSuccess){
		mui.each(data.data.sosuoInfo.lr,function(index,val){
			val.service_label=val.service_label.split(",");
			// console.log(val);
		});
		if(isSuccess){
			if(data.data.sosuoInfo.lr){
				mrListVM.searchListlr = data.data.sosuoInfo.lr;
			}else if(data.data.sosuoInfo.lm){
				mrListVM.searchListlm = data.data.sosuoInfo.lm;
			}
		}
	});
}

//加载数据
function getMainInfo(isPullUp){
	var id = mrListVM.newsTypeId == '' ? 1 : mrListVM.newsTypeId;
	getPostData("class.obtainResources", {
		'method' : "class.obtainResources",
		"sign":'',
		"pageNum":pageSet.pageNum,
		"pageSize":pageSet.pageSize,
		"cat_type":type,
		'newsTypeId': id
		},function(data,isSuccess){
			var res = data.data;
			// console.log(res.classnewsList);
			mui.each(res['classnewsList'],function(index,val){
				val.service_label = val.service_label.split(",");
			});
			//如果是上拉加载
			if(isPullUp){
				if(res.classnewsList.length < 1){
					mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);	
					mui('#pullrefresh').pullRefresh().refresh();
				}else{
					mrListVM.allmingrenList = mrListVM.allmingrenList.concat(res['classnewsList']);
					mui('#pullrefresh').pullRefresh().endPullupToRefresh();	
					mui('#pullrefresh').pullRefresh().refresh(true);
				}
			//如果是下拉刷新
			}else{
				mrListVM.allmingrenList = res['classnewsList'];
				mui('#pullrefresh').pullRefresh().endPulldownToRefresh(true);
				mui('#pullrefresh').pullRefresh().refresh(true);
			}
		}
	)

	getPostData('newstype.select',{
		'method' : "newstype.select",
		"sign":'',
	},function(data,isSuccess){
		if(isSuccess){
			// console.log(data.data.newstypeList);
			mrListVM.newstypeList = data.data.newstypeList.reverse();
		}
	})
}


//初始化页面
function init(){
	mui.init({
		swipeBack: false
	});
	(function($){
		$(".mui-scroll-wrapper").scroll({
			deceleration: 0.0005,
			bounce: true,//滚动条是否有弹力默认是true
			indicators: false, //是否显示滚动条,默认是true
		});
	})(mui);
}


//点击分类中的下拉选项
mui('body').on('tap','.taxonomy',function(){
	var id = this.id;
	mrListVM.newsTypeId = id;
	console.log(mrListVM.newsTypeId)
	getPostData("class.obtainResources", {
		'method' : "class.obtainResources",
		"pageNum":1,
		"pageSize":pageSet.pageSize,
		"cat_type":type,
		'newsTypeId':mrListVM.newsTypeId
		},function(data,isSuccess){
			console.log(data)
			document.getElementsByClassName("mui-scroll")[0].style.transform='translate3d(0,0,0)';
			if(isSuccess){
				if(data.data.classnewsList.length < 1) {
					mrListVM.allmingrenList = data.data.classnewsList;
					document.getElementsByClassName('mui-pull')[1].style.display = "none";
				}else{
					document.getElementsByClassName('mui-pull')[1].style.display = "block";
					mui.each(data.data.classnewsList,function(index,val){
						val.service_label = val.service_label.split(",");
					});
					mrListVM.allmingrenList = data.data.classnewsList;
				}
				
				mui('#classIfication1').popover('toggle');
			}
		}
	);
});



mui('body').on('tap','li.mtList',function(){
	var mrListId = this.id;
	createWin(null,'mrtg.html',{mrListId:mrListId});
})