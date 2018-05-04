var appType=localStorage.getItem("AppType");

var u_id = localStorage.getItem("u-nane");  
    if(u_id != null){  
	    document.getElementById("u-nane").value = u_id;  
	    document.getElementById("checkBox").checked = "checked";  
    }

var dfloginVM = new Vue({
	el: '#login-form',
	data: {
		name: ''||u_id,
		password: "",
	},
	methods: {
		submitForm: function() {
			var name=document.getElementById("u-nane").value;
			if((name =='')&&(this.password == '')){
					mui.toast('请输入账号/密码');
			}else if(name=''){
				mui.toast('请输入账号');
				
			} else if(this.password == '') {
				mui.toast('请输入密码');
			} else {
				var _user = this;
				getPostData("pm.login.member", {
					'name': document.getElementById("u-nane").value,
					'method' : "pm.login.member",
					'password':_user.password
				}, function(data, isSuccess) {
					if(data.code == '000'){
						if(data.level =='Info'){
							var res = data.data;
							res.loginInfo.id = res.loginInfo.id;
							res.loginInfo.code = res.loginInfo.code;
							res.loginInfo.commision = res.loginInfo.commision;
							res.loginInfo.headimgurl = res.loginInfo.headimgurl;
							res.loginInfo.nick_name = res.loginInfo.nick_name;
							res.loginInfo.name = res.loginInfo.name;
							res.loginInfo.nick_name = res.loginInfo.nick_name;
							res.loginInfo.mobile = res.loginInfo.mobile;
							res.loginInfo.password = res.loginInfo.password;
							res.loginInfo.identity = res.loginInfo.identity;
						}
						setuserinfo(data.data.loginInfo)
					}else{
						mui.toast("用户名或密码错误");
					}
				});
			}
			var check = document.getElementById("checkBox"); 
			if(check.checked) {  
                var id1 = document.getElementById("u-nane").value;  
                localStorage.setItem("u-nane", id1);
            }else{  
	            localStorage.removeItem("u-nane");
	        }
		}
	}
});
var setuserinfo = function(loginInfo){
	mui.toast('登录成功');
	localStorage.setItem(app.userlocalKey, JSON.stringify(loginInfo));
	setTimeout(function(){
		createWin(null, '../index.html', null);
	},1000)
}

mui('body').on('tap','#toRegister',function(){
	createWin(null, 'zhuce.html', null);
})
mui('body').on('tap','#toForget',function(){
	createWin(null, 'forget.html', null);
})
