mui.init({
	swipeBack:true,
	pullRefresh: {
		container: "#pullrefresh", 
		down : {
	      style:'circle',//必选，下拉刷新样式，目前支持原生5+ ‘circle’ 样式
	      color:'#2BD009', //可选，默认“#2BD009” 下拉刷新控件颜色
	      height: 50,//可选,默认50.触发下拉刷新拖动距离
	      auto: false,//可选,默认false.首次加载自动上拉刷新一次
	      range:'100px', //可选 默认100px,控件可下拉拖拽的范围
	      offset:'0px',
	      callback : pulldownRefresh
	    },
	    up : {
	      style:'circle',//必选，上拉加载样式，目前支持原生5+ ‘circle’ 样式
	      color:'#2BD009', //可选，默认“#2BD009” 下拉刷新控件颜色
	      height: '50px',//可选,默认50.触发下拉刷新拖动距离
	      auto: false,//可选,默认false.首次加载自动上拉刷新一次
	      contentrefresh : "正在加载...",//可选，正在加载状态时，上拉加载控件上显示的标题内容
	      contentnomore:'没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容
	      range:'100px', //可选 默认100px,控件可下拉拖拽的范围
		  offset:'0px', //可选 默认0px,下拉刷新控件的起始位置
	      callback :pullupRefresh //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据
	    }
	}
});

mui('.mui-scroll-wrapper').scroll({
	deceleration: 0.0003 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
});

var pageSet = {//分页设置
	pageNum: 1,
	pageSize: 5,
	totalPage: 10,
}

var mainVM = new Vue({
	el:"#mainVM",
	data:{
		news:[],
		createTime:'',
		nowIndex:0,
		shangyeList:[],
		wenhuaList:[],
		xinwenList:[],
		tiyuList:[],
		yuleList:[],
		id:1,
	},
	methods :{
        tab : function(id,isPullUp){//资讯列表展示
        	if(this.id != id){
        		pageSet.pageNum = 1;
        	};
        	this.id = id;
        	document.getElementsByClassName("mui-scroll")[0].style.transform='translate3d(0,0,0)';
        	document.getElementById(id).style.color = "#007AFF";
        	document.getElementById(id).style.fontSize = "0.17rem";
        	$('#'+id).siblings().css("color","#000");
        	$('#'+id).siblings().css("font-size","0.16rem");
        	sessionStorage.setItem('id',this.id);
			getMainInfo(this.id,false);
		},
    },
	created:function(){},
	mounted:function(){
		init();
	}
})

function pulldownRefresh(){//下拉刷新
	pageSet.pageNum = 1;
	getMainInfo(mainVM.id,false);
}

function pullupRefresh(){//上拉加载
	pageSet.pageNum ++;
	getMainInfo(mainVM.id,true);
}


//加载数据
function getMainInfo(id,isPullUp){//资讯列表展示
	getPostData("pm.news.classify",{
		'method' : "pm.news.classify",
		"sign" : '',
		"pageNum" : pageSet.pageNum,
		'pageSize': pageSet.pageSize,
		"newstype_id" : sessionStorage.getItem('id')||id,
	},function(data, isSuccess){
		var res = data.data;
		if(isSuccess){
			if(data.data){
				document.getElementById("loading").style.display="none";
			}
			var newsList = res.news;
			mui.each(newsList,function(index,val){
				val.createTime = getLocalTime(val.createTime);
				if((val.new_model == 1)||(val.new_model == 2)){
					val.imgUrl = val.imgUrl.split(",");
					val.conent = val.conent.replace(/<.*?>/ig,"").replace(/(\\n)*(\\t)*/ig,"").replace(/\\n*/ig,"").replace(/"/ig,"");
				}
			});
			//上拉加载
			if(isPullUp){
				//如果没有数据了
				if(newsList.length < 1){
					mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
				//如果有数据 正常加载
				}else{
					mainVM.news = mainVM.news.concat(res.news);
					mui('#pullrefresh').pullRefresh().endPullupToRefresh();
					mui('#pullrefresh').pullRefresh().refresh(true);
					console.log(mainVM.news);
					sessionStorage.setItem('news',JSON.stringify(mainVM.news));
				}
			}else{//下拉刷新
				mainVM.news = res.news;
				if(mainVM.news.length < 1){
					document.getElementsByClassName('mui-pull')[1].style.display = 'none';
				}else{
					document.getElementsByClassName('mui-pull')[1].style.display = 'block';
				}
				mui('#pullrefresh').pullRefresh().endPulldownToRefresh(true);
				mui('#pullrefresh').pullRefresh().refresh(true);
			}
		}
	})
};



//页面初始化函数
function init(){
	window.addEventListener("pageshow", function() {
		function is_weixin(){
		 	var ua = navigator.userAgent.toLowerCase();
			if (ua.match(/MicroMessenger/i) == "micromessenger") {//如果在微信浏览器端
				if(sessionStorage.getItem("reload4")){
					location.reload();
					sessionStorage.removeItem("reload4")
				}
			} else {
				sessionStorage.removeItem("reload4")
			 	return false;
			}
		}
		is_weixin();
		var pageSet = {//分页设置
			pageNum: 1,
			pageSize: 5,
			totalPage: 10,
		};
		if(sessionStorage.getItem('id')){
			var id=sessionStorage.getItem('id');
			document.getElementsByClassName("mui-scroll")[0].style.transform='translate3d(0,0,0)';
        	document.getElementById(id).style.color = "#007AFF";
        	document.getElementById(id).style.fontSize = "0.17rem";
        	$('#'+id).siblings().css("color","#000");
        	$('#'+id).siblings().css("font-size","0.16rem");
			getMainInfo(id,false);
		}else{
			getMainInfo(1,false);
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
	
	mui.plusReady(function(){//安卓
	    plus.webview.currentWebview().setStyle({width:'100%',height:'100%'});
	});
	
	mui('body').on('tap','ul.informationList>li',function(){
		var newsListId = this.id;
		createWin(null,'infoDetails.html',{newsListId:newsListId});
	});
}


//时间转换函数
function getLocalTime(nS) {
	return new Date(parseInt(nS)).toLocaleString().replace(/(\/)|年|月/g, "-").replace(/日|( GMT\+8)|上午|下午/g, "").replace(/\d+:\d+:\d+/g, "");
}
//2018年1月17日 GMT+8 15:32:12
//2018-1-17 下午3：32：12

