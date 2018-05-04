function is_weixin() {
 	var ua = navigator.userAgent.toLowerCase();
	if (ua.match(/MicroMessenger/i) == "micromessenger") {//如果在微信浏览器端
		document.getElementById('back').style.display="none";
		document.getElementById('center').style.marginLeft=0;
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
	      height: 50,//可选,默认50.触发下拉刷新拖动距离,
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
//分页
var pageSet = { 
	pageNum: 1,
	pageSize: 8,
	totalPage: 0,
}

var mainVM = new Vue({
	el:"#mainVM",
	data:{
		media_own:[]
	},
	methods:{},
	created:function(){},
	mounted:function(){
		getMainInfo(false);
	}	
})


//上拉加载
function pullupRefresh() {
	pageSet.pageNum ++;
	getMainInfo(true);
}


//下拉刷新
function pulldownRefresh() {
	pageSet.pageNum = 1;
	getMainInfo(false);
}


//获取数据
function getMainInfo(isPullUp){
	getPostData("pm.media.ownmedia", {
		'method' : "pm.media.ownmedia",
		"sign":'',
		"type":'1',
		"pageNum":pageSet.pageNum,
		"pageSize":pageSet.pageSize,
	},function(data, isSuccess){
		if(isSuccess){
			if(data.code == '000'){
				var res = data.data;
				//如果是上拉加载
				if(isPullUp){
					if(res.media_own.length >= 1){
						for(var i = 0;i < res.media_own.length;i ++){
							mainVM.media_own.push(res.media_own[i]);
						}
						mui('#pullrefresh').pullRefresh().endPullupToRefresh();
						mui('#pullrefresh').pullRefresh().refresh();
					}else{
						mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
					}
				}else{//如果是下拉刷新
					mainVM.media_own = res.media_own;
					mui('#pullrefresh').pullRefresh().endPulldownToRefresh(true);
					mui('#pullrefresh').pullRefresh().refresh(true);
				}
			}else{
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
				mui('#pullrefresh').pullRefresh().refresh();
			}
		}
	});
}


//点击进入详情页
mui('body').on('tap','li',function(){
	var personalId = this.id;
	createWin(null,'personalMedia.html',{personalId:personalId});
})
