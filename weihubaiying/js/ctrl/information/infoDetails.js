//var newsListId = getExtraDataByKey('newsListId');
var newsListId = GetQueryString('newsListId');

var userInfo=JSON.parse(localStorage.getItem(app.userlocalKey));
console.log(userInfo.id);

sessionStorage.setItem("reload4",1);

//var mrListId = getExtraDataByKey('mrListId');
var mrListId = GetQueryString('mrListId');
 
function is_weixin() {
 	var ua = navigator.userAgent.toLowerCase();
	if (ua.match(/MicroMessenger/i) == "micromessenger") {//如果在微信浏览器端
		document.getElementById('header').style.display="none";
		document.getElementById('content').style.marginTop=0;
		mui("body").on('tap', '.back', function(){
			sessionStorage.setItem("indexPage","mediaContent");
			createWin(null,'../index.html',null);
		});
	} else {
		mui("body").on('tap', '.back', function(){
			mui.back();
		});
	 	return false;
	}
}
is_weixin();

var mainVM = new Vue({
	el:"#mainVM",
	data:{
		news:[],
		lnlist:[],
		hotList:[],
		imgList:[],
		userInfo:userInfo
	},
	methods:{
	},
	mounted:function(){
		init();
		perMedia();
		hotList();
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
	
	window.addEventListener("pageshow", function() {
		
	});
	
	
	
	mui("body").on('tap', '#toZMT', function(){
		createWin(null,'../meiti/mrtg.html',{mrListId:mainVM.news.rid});
	});
	
	//分享
	mui("#header").on('tap', '#share-i', function(){
		console.log(mainVM.news.imgUrl[0]);
		mainVM.news.imgUrl[0]=mainVM.news.imgUrl[0].replace(/[\u4e00-\u9fa5]+/g,function(val,index){
			console.log(val)
			return encodeURIComponent(val);
		})
		
		mainVM.news.con=mainVM.news.con?mainVM.news.con:'';
		window.jsObj.shareTitleContentImgUrlWebUrl(mainVM.news.name,mainVM.news.con,mainVM.news.imgUrl[0],window.location.href);
		console.log(mainVM.news.name);
		console.log(mainVM.news.imgUrl[0]);
		console.log(mainVM.news.con);
		console.log(window.location.href);
	});
	var ShareURL = "";
	function SetShareUrl(cmd, config){
		if(ShareURL) {
			config.bdUrl = ShareURL;
		}
		return config;
	}
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
			

	mui('body').on('tap','ul.informationList>li',function(){
		var newsListId = this.id;
		createWin(null,'infoDetails.html',{newsListId:newsListId});
	})
}


function hotList(){//媒体,名人详情展示
	getPostData("pm.news.details",{
		'method' : "pm.news.details",
		"sign":'',
		"news_id":mrListId,
		"pageSize":100
	},function(data,isSuccess){
//		console.log(data);
		if(isSuccess){
			if(data.data!=undefined){
				if(data.data.news.conent){
					/*data.data.news.conent.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (match, capture) {
						console.log(match, capture)
//						mainVM.imgList.push(capture);
					});*/
//					console.log(mainVM.imgList);
//					data.data.news.conent = JSON.stringify(data.data.news.conent).replace(/<.*?>/ig,"").replace(/(\\n)*(\\t)*/ig,"").replace(/\\n*/ig,"").replace(/"/ig,"");
					document.getElementById('conent').innerHTML=data.data.news.conent;
					data.data.news.imgUrl=data.data.news.imgUrl.split(',');
				}
				data.data.news.createTime=getLocalTime(data.data.news.createTime)
				mainVM.news = data.data.news;
				console.log(mainVM.news);
				var tjList = data.data.lnlist;
				mui.each(tjList,function(index,val){
					val.createTime=getLocalTime(val.createTime);
					if((val.new_model==1)||(val.new_model==2)){
						val.imgUrl=val.imgUrl.split(",");
						document.getElementById('conent').innerHTML=data.data.news.conent;
//						val.conent=val.conent.replace(/<.*?>/ig,"").replace(/(\\n)*(\\t)*/ig,"").replace(/\\n*/ig,"").replace(/"/ig,"");
					}
				});
				mainVM.hotList = tjList;
				console.log(mainVM.hotList)
			}
		}
	});
};

function perMedia(){
	getPostData("pm.news.details", {
		'method' : "pm.news.details",
		"sign":'',
		"news_id":newsListId,
//		"pageSize":100
	},function(data,isSuccess){
		console.log(data);
		if(isSuccess){
//			console.log(data);
			if(data.data!=undefined){
				if(data.data.news.conent){
					/*data.data.news.conent.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (match, capture) {
//						mainVM.imgList.push(capture);
					});*/
//					data.data.news.conent.replace(/<img [^>]*width=['"]([^'"]+)[^>]*>/gi,'width="100%"');
//					console.log(data.data.news.conent)
					document.getElementById('conent').innerHTML=data.data.news.conent;
//					data.data.news.conent = JSON.stringify(data.data.news.conent).replace(/<.*?>/ig,"").replace(/(\\n)*(\\t)*/ig,"").replace(/\\n*/ig,"").replace(/"/ig,"");
				}
				data.data.news.createTime=getLocalTime(data.data.news.createTime);
				data.data.news.imgUrl=data.data.news.imgUrl.split(',');
				mainVM.news = data.data.news;
				var tjList = data.data.lnlist;
				mui.each(tjList,function(index,val){
					val.createTime=getLocalTime(val.createTime);
					if((val.new_model==1)||(val.new_model==2)){
						val.imgUrl=val.imgUrl.split(",");
						document.getElementById('conent').innerHTML=val.conent;
//						val.conent=val.conent.replace(/<.*?>/ig,"").replace(/(\\n)*(\\t)*/ig,"").replace(/\\n*/ig,"").replace(/"/ig,"");
					}
				});
				mainVM.lnlist = tjList;
//				console.log(mainVM.lnlist)
			}
		}
	})
}

function getLocalTime(nS) {
	return new Date(parseInt(nS)).toLocaleString().replace(/(\/)|年|月/g, "-").replace(/日|( GMT\+8)|上午|下午/g, "").replace(/\d+:\d+:\d+/g, "");
}
