var telReg=/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/;
var mobileReg=/^1(3|4|5|7|8)\d{9}$/;
var passwordReg=/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/ ; 
var wait=59;

//var sjh = localStorage.getItem("zhuce");
//var yzm1 = localStorage.getItem("zhuce1");
//var mima1 = localStorage.getItem("zhuce2");

function is_weixin(){
 	var ua = navigator.userAgent.toLowerCase();
	if (ua.match(/MicroMessenger/i) == "micromessenger") {//如果在微信浏览器端
		document.getElementById('header').style.display="none";
		document.getElementById('regForm').style.marginTop=0;
	} else {
	 	return false;
	}
}
is_weixin();

//if(sjh != null){
//	document.getElementById('a1').value = sjh;
//}
//if(yzm1 != null){
//	document.getElementById('yzm').value = yzm1;
//}

//密码加密
/*var encryptAES = function(str){
	var key = ',[AjiEWohgew/.?|';
	var iv = 'alwi2hvnaz.s923k';
	var mode = 'CBC';
	var pad = 'Pkcs7';
	var tstr = CryptoJS.AES.encrypt(str, CryptoJS.enc.Utf8.parse(key), {
		iv: CryptoJS.enc.Utf8.parse(iv || key),
		mode: CryptoJS.mode[mode],
		padding: CryptoJS.pad[pad]
	});
	return tstr.toString();
}*/

var registerVM= new Vue({  
    el:'#regForm',  
    data:{  
        mobile: "",
        name:"",
   		password:"",
   		ranCode:""
    },
	methods: {
		getCode:function(){
			if(a1.value==''){
				mui.toast('请输入手机号');
			}else if(!(mobileReg.test(a1.value))) {
				mui.toast('请输入正确的手机号码');
			} else{
				var _self = this;
				getPostData("pm.login.code", {
					'method' : "pm.login.code",
					'name':a1.value
				}, function(data, isSuccess) {
					console.log(data);
					if(isSuccess) {
						if(data.code=='000'){
							mui.toast('验证码已发送，请注意查收！');
							pourTime();
						}else{
							mui.toast(data.error);
						}
					}
				});
			}
		},
		submitForm:function(evevt){
			if(this.mobile==''){
				mui.toast('请输入手机号');
			}else if(!(mobileReg.test(this.mobile))){
				mui.toast('手机格式不正确');
			}else if(this.ranCode==''){
				mui.toast('请输入验证码');
			}else if(this.password==''){
				mui.toast('请输入密码');
			}else{
				getPostData("pm.login.register",{
					'method' : "pm.login.register",
					'name':this.mobile,
					'code':this.ranCode,
					'password':this.password,//encryptAES(this.password)
				},function(data, isSuccess){
					console.log(data);
					mui.toast(data.description);
		        	if(data.code == '000'){
		        		localStorage.removeItem('zhuce');
		        		localStorage.removeItem("zhuce1");
	        			localStorage.removeItem('zhuce2');
		        		var _user = registerVM;
						if(data.data){
							var res = {};
							res.id = data.data.memberId;
							res.code = this.ranCode;
							res.sex='男';
//							res.commision = res.loginInfo.commision;
//							res.headimgurl = res.loginInfo.headimgurl;
							res.nick_name = this.mobile;
							res.name = this.mobile;
							res.mobile = this.mobile;
							res.password = this.password;
//							res.identity = res.loginInfo.identity;
							console.log(res);
							setuserinfo(res);
							localStorage.setItem("u-nane", _user.mobile);
						}
		        	}else if(data.code=='001'){
						mui.toast('验证码填写错误！');
					}
				});
			}
		}
	}
}) ; 

var setuserinfo = function(loginInfo){
//	mui.toast('登录成功');
	localStorage.setItem(app.userlocalKey, JSON.stringify(loginInfo));
	setTimeout(function(){
		//登录成功，刷新index页面
		createWin(null,'../mine/editData.html', null);
	},1000);
}

function pourTime(btn){
	var btn=document.getElementById('reg-rancode');
	if (wait == 0) {
        btn.removeAttribute("disabled");            
        btn.innerHTML="重新发送";
        wait = 59;  
    }else{
        btn.setAttribute("disabled", true);  
        btn.innerHTML="("+wait + "s)重新发送";  
        wait--;  
        setTimeout(function(){
            pourTime(btn);
        },1000);
    }  
}

var a1 = document.getElementById('a1');
if(a1.value != null){
	a1.onblur = function(){
	 	sjh = a1.value;
	 	localStorage.setItem("zhuce", sjh);
	}
}

var yzm = document.getElementById('yzm');
yzm.onblur = function(){
	if(yzm.value != undefined){
		yzm = yzm.value;
		localStorage.setItem("zhuce1", yzm);
	}
}
var mima = document.getElementById('mima');

mima.onblur = function(){
	if(mima.value != undefined){
		mima = mima.value;
		localStorage.setItem("zhuce2", mima);
	}
}

