//var personalId = getExtraDataByKey('personalId');
var personalId = GetQueryString('personalId');
//console.log(personalId)
var form = getExtraDataByKey('form');


function is_weixin() {
 	var ua = navigator.userAgent.toLowerCase();
	if (ua.match(/MicroMessenger/i) == "micromessenger") {//如果在微信浏览器端
		document.getElementById('back').style.display="none";
		document.getElementById('center').style.marginLeft="0rem";
		document.getElementById('per_header').style.display='block';
		document.getElementById('personal_box').style.top="0.43rem";
	} else {
	 	return false;
	}
}
is_weixin();

var mainVM = new Vue({
	el:"#mainVM",
	data:{
		allInfo:'',
		ownInfo:'',
		Ls:[],
		form:form,
		starhalf:0,
		starAll:{},
		weixin:'',
		weibo:'',
		taobao:'',
		qqkj:'',
		bdtb:''
	},
	methods:{},
	mounted:function(){
		init();
		perMedia();
	}
});

function init(){
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

function perMedia(){
	getPostData("pm.media.owndetail", {
		'method' : "pm.media.owndetail",
		"sign":'',
		"z_id":personalId
	},function(data,isSuccess){
		console.log(data,personalId);
		if(isSuccess){
			console.log((data.data.allInfo.ownInfo.grade)%1==0);
			if(!((data.data.allInfo.ownInfo.grade)%1==0)){//如果是小数
				mainVM.starhalf=1;
			}
			for(var i=1;i<=data.data.allInfo.ownInfo.grade;i++){
				starAll={};
				mainVM.starAll[i]=1;
			}
			console.log(mainVM.starAll)
			mainVM.ownInfo = data.data.allInfo.ownInfo;
			var Ls = data.data.allInfo.ls;
			mui.each(Ls,function(index,val){
				console.log(val.name);
				if(val.name=="微信"){
					mainVM.weixin=1;
				}
				if(val.name=="微博"){
					mainVM.weibo=1;
				}
				if(val.name=="淘宝"){
					mainVM.taobao=1;
				}
				if(val.name=="百度贴吧"){
					mainVM.bdtb=1;
				}
				if(val.name=="qq空间"){
					mainVM.qqkj=1;
				}
				val.content=val.content.replace(/"/g,function(val){
					return "";
				});
				val.content=val.content.split(',');
				val.keyword=val.keyword.replace(/"/g,function(val){
					return "";
				});
				val.creat_time = getLocalTime(val.creat_time);
			})
			mainVM.Ls = Ls;
		}
	})
};
//个人自媒体资料更新
function toUpdate(){
	localStorage.removeItem("weixin");
	localStorage.removeItem("weibo");
	localStorage.removeItem("qqkongjian");
	localStorage.removeItem("baidutieba");
	localStorage.removeItem("taobao");
	localStorage.removeItem("zmtInfo");
	localStorage.removeItem("img");
	createWin(null,'../renzheng/shenfen.html',{personalId:personalId})
};
function getLocalTime(nS){
    return new Date(parseInt(nS)).toLocaleString().replace(/\//g, ".").replace(/日 /g, "").replace(/(上午|下午)\d+:\d+:\d+/g, "");      
};