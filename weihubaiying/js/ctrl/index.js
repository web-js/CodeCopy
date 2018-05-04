var ua = navigator.userAgent.toLowerCase();
console.log(ua);
if(sessionStorage.getItem("reload")){
	location.reload();
	sessionStorage.removeItem("reload");
}
//var appType=getExtraDataByKey('appType')?getExtraDataByKey('appType'):'H5';
//localStorage.setItem("AppType", appType);
//sessionStorage.removeItem("cartList");
var id = getExtraDataByKey('id');
var styles = {
	top: '0',
	bottom: '0.49rem'
};
var tabVM = new Vue({
	el: '#navbar',
	data: {
		tabsConfig:[{
			id:'main',
			name:'首页',
			src:'../img/zhuye1.png',
			src1:'../img/zhuye.png',
			url: 'main.html',
			styles: styles,
			default: true,
			extras: {
			}
		},{
			id:'mediaContent',
			name:'资讯',
			src:'../img/tuijian1.png',
			src1:'../img/tuijian.png',
			url: 'information/information.html',
			styles: styles,
			extras: {
			}
		},{
			id:'taskSquare',
			name:'任务',
			src:'../img/renwu1.png',
			src1:'../img/renwu.png',
			url: 'task/taskSquare.html',
			styles: styles,
			extras: {
			}
		},{
			id:'mine',
			name:'我的',
			src:'../img/wode1.png',
			src1:'../img/wode.png',
			url: 'mine/homePage.html',
			styles: styles,
			extras: {}
		}
		],
		currentPage:''
	},
	mounted:function(){
		init();
	}
});

var indexPageSet = sessionStorage.getItem('indexPage');

var subpagesStr = createSubWins(tabVM.tabsConfig,{
    "isShowFirst": indexPageSet== null,
    "parentDom": "#indexPage"
},function(){
	if(indexPageSet){
		tabVM.currentPage = indexPageSet;
		showWin(tabVM.currentPage);
		console.log(tabVM.currentPage)
	}else{
		tabVM.currentPage='main';
	}
});


mui('#navbar').on('tap', 'a', function(e){
	var userInfo=localStorage.getItem(app.userlocalKey);
	var targetId = this.dataset.id
	if(tabVM.currentPage == targetId) {
		return;
	}else if(!userInfo&&targetId=="mine"){
		mui.confirm('您还未登录，请登录。', '', ['取消', '去登录'], function(e) {
			if (e.index == 1) {
				createWin('login', 'login/login.html', {});
			}
		})
	}else{
		if(sessionStorage.getItem('id')){
			sessionStorage.removeItem('id');
//			sessionStorage.removeItem('transform');
		}
		hideWin(tabVM.currentPage);
		tabVM.currentPage = targetId;
		showWin(tabVM.currentPage);
		sessionStorage.setItem('indexPage',tabVM.currentPage);
	}
});

window.onload = function(){
	var h = $('body').height();
	$('body').css('min-height',h);
};

/*window.onpageshow = function(event) {
　　if (event.persisted) {
		window.location.reload(); 
　　}
};*/
function init(){
	window.addEventListener("pageshow", function() {
		
		
	});
}
