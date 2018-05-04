var mobileReg=/^1(3|4|5|7|8)\d{9}$/;
var userInfo=JSON.parse(localStorage.getItem(app.userlocalKey));
var globalCameraCanvas;
var globalCameraVideo;
var fileArray = [];
function is_weixin() {
 	var ua = navigator.userAgent.toLowerCase();
	if (ua.match(/MicroMessenger/i) == "micromessenger") {//如果在微信浏览器端
		document.getElementById('back').style.display="none";
		document.getElementById('center').style.marginLeft="0rem";
	} else {
	 	return false;
	}
}
is_weixin();

//	 跳转至 修改密码
mui('body').on('tap','#modifyPassword',function(){
	if(!(userInfo == null)){
		createWin(null, '../login/forget.html', {name:userInfo.name});
	}else{
		createWin(null, '../login/login.html', null);
	}
});
//	退出登录
mui('body').on('tap', '#signOut', function() {
	if(!(userInfo == null)){
		var btnArray = ['取消', '确认'];
		mui.confirm('您确定退出当前账号？', '提示', btnArray, function(e) {
			if (e.index == 1) {
				/*localStorage.removeItem(app.userlocalKey);
				localStorage.removeItem('phone');
				localStorage.removeItem('zhuce');
				localStorage.removeItem('zhuce1');
				localStorage.removeItem('zhuce2');*/
				localStorage.clear();
				createWin(null, '../index.html', null);
			} 
		})
	}else{}
})